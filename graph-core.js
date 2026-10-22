/* Bounded function parser. Student expressions are never evaluated as JavaScript. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.GraphTools=api;})(typeof window==='undefined'?globalThis:window,()=>{
 'use strict';
 const names=new Set(['sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','sec','cosec','csc','cot','sqrt','abs','exp','ln','log','floor','ceil']);
 function compile(input){
  const s=String(input).trim().replace(/^y\s*=\s*/i,'').toLowerCase().replace(/[−–]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\*\*/g,'^').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g,t=>'^'+[...t].map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'.includes(c)?'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c):'-').join(''));
  if(!s||s.length>250)throw Error('Enter a function of x, up to 250 characters.');
  const tokens=[];let pos=0;
  while(pos<s.length){const ch=s[pos];if(/\s/.test(ch)){pos++;continue;}const n=s.slice(pos).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/);if(n){tokens.push({number:Number(n[0])});pos+=n[0].length;continue;}const word=s.slice(pos).match(/^[a-z]+/);if(word){const w=word[0];if(names.has(w)||['x','a','b','c','pi','e'].includes(w))tokens.push(w);else if(/^[xabc]+$/.test(w))tokens.push(...w);else throw Error('Unknown name: '+w+'. Use x, a, b, c and the listed functions.');pos+=w.length;continue;}if('+-*/^()'.includes(ch)){tokens.push(ch);pos++;continue;}throw Error('Unsupported character: '+ch);}
  let at=0,budget=350;const take=t=>tokens[at]===t?(at++,true):false;
  function atom(){if(--budget<0)throw Error('Expression is too complex.');const t=tokens[at++];if(t==='('){const v=sum();if(!take(')'))throw Error('Close every bracket.');return v;}if(t&&typeof t==='object')return()=>t.number;if(['x','a','b','c'].includes(t))return v=>v[t];if(t==='pi'||t==='e')return()=>t==='pi'?Math.PI:Math.E;if(names.has(t)){if(!take('('))throw Error('Use '+t+'(...) with brackets.');const arg=sum();if(!take(')'))throw Error('Close every bracket.');return v=>{let a=arg(v),k=v.degrees?Math.PI/180:1;if(['sin','cos','tan','sec','cosec','csc','cot'].includes(t)){a*=k;if(t==='sin'||t==='cos'||t==='tan')return Math[t](a);return t==='sec'?1/Math.cos(a):t==='cot'?1/Math.tan(a):1/Math.sin(a);}if(['asin','acos','atan'].includes(t))return Math[t](a)/k;return t==='ln'?Math.log(a):t==='log'?Math.log10(a):Math[t](a);};}throw Error('Expected a number, x, or a bracketed function.');}
  function power(){const left=atom();if(take('^')){const right=unary();return v=>left(v)**right(v);}return left;}
  function unary(){if(--budget<0)throw Error('Expression is too complex.');if(take('+'))return unary();if(take('-')){const a=unary();return v=>-a(v);}return power();}
  const startsAtom=t=>t==='('||t&&typeof t==='object'||typeof t==='string'&&(/^[xabce]$/.test(t)||t==='pi'||names.has(t));
  function product(){let a=unary();for(;;){if(take('*')){const l=a,r=unary();a=v=>l(v)*r(v);}else if(take('/')){const l=a,r=unary();a=v=>l(v)/r(v);}else if(startsAtom(tokens[at])){const l=a,r=unary();a=v=>l(v)*r(v);}else return a;}}
  function sum(){let a=product();for(;;){if(take('+')){const l=a,r=product();a=v=>l(v)+r(v);}else if(take('-')){const l=a,r=product();a=v=>l(v)-r(v);}else return a;}}
  const f=sum();if(at!==tokens.length)throw Error('Check the expression and brackets.');return(x,parameters={})=>{const v=f({x,a:1,b:0,c:0,degrees:false,...parameters});return Number.isFinite(v)?v:NaN;};
 }
 function paths(f,range,{width=780,height=440,steps=1400}={}){
  const [x0,x1,y0,y1]=range,X=x=>(x-x0)/(x1-x0)*width,Y=y=>height-(y-y0)/(y1-y0)*height;let segments=[],current=[],last=null;
  for(let i=0;i<=steps;i++){const x=x0+(x1-x0)*i/steps,y=f(x),point=[X(x),Y(y)];let gap=!Number.isFinite(y)||Math.abs(point[1])>height*1000;
   if(last&&!gap){const mid=f((x+last.x)/2),ym=Y(mid);gap=!Number.isFinite(mid)||Math.abs(point[1]-last.py)>height*.9||Math.abs(ym-(point[1]+last.py)/2)>height*.25;}
   if(gap){if(current.length>1)segments.push(current);current=[];last=null;continue;}current.push(point);last={x,py:point[1]};
  }if(current.length>1)segments.push(current);return segments;
 }
 function ticks(lo,hi){const raw=(hi-lo)/8,p=10**Math.floor(Math.log10(raw)),m=raw/p,step=(m<=1?1:m<=2?2:m<=5?5:10)*p;const out=[];for(let i=Math.ceil(lo/step);i*step<=hi+step*1e-8&&out.length<30;i++)out.push(i*step);return out;}
 return{compile,paths,ticks};
});
