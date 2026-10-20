const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/\r\n/g,'\n');
const {parseNumber,matches}=require('../numeric-tools.js');

test('numerical inputs accept equivalent arithmetic, fractions, surds and scientific notation',()=>{
  for(const [text,value] of [['1/4',.25],['16^(-1/2)',.25],['−1/4',-.25],['sqrt(2)',Math.sqrt(2)],['√(9)',3],['2π',2*Math.PI],['2(3+4)',14],['3.2 × 10^-3',.0032],['3.2 x 10^-3',.0032],['3.2e-3',.0032],['2³',8],['-2^2',-4],['2^-2',.25],['1,234.5',1234.5]]) assert.ok(matches(parseNumber(text),value,1e-12),text);
});
test('invalid, unsafe and incomplete expressions cannot become numerical answers',()=>{
  for(const text of ['', '1/0','sqrt(-1)','1/','2+','x+4y-2=0','1,2','NaN','Infinity','alert(1)','globalThis','2;3','1e999','('.repeat(400)]) assert.ok(Number.isNaN(parseNumber(text)),text);
});
test('tolerances work at tiny scales and do not accept zero for a non-zero answer',()=>{
  for(const value of [1e-20,1e-8,.25,100000]) { assert.equal(matches(value,value),true); assert.equal(matches(0,value),false); assert.equal(matches(value*1.1,value),false); }
  assert.equal(matches(0,0,0),true); assert.equal(matches(.001,0,0,.002),true);
});
test('all scripts parse and all local JavaScript references exist',()=>{
  for(const [i,match] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries()) new vm.Script(match[1],{filename:`inline ${i}`});
  for(const [,name] of html.matchAll(/<script[^>]*src="([^"/:]+\.js)"[^>]*>/g)) new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
});
test('unchecked final answers and written answers are saved immediately by the actual input handler',()=>{
  const listener=html.split('\n').find(line=>line.startsWith('document.addEventListener("input",e=>{ const t=e.target, id=t.dataset.xw||t.dataset.xin;'));
  assert.ok(listener);
  let onInput, persisted;
  const saved={};
  const context=vm.createContext({saved,KEY:'test',store:{set:(key,data)=>{persisted=JSON.parse(JSON.stringify(data));}},document:{addEventListener:(event,fn)=>{onInput=fn;}}});
  const save=html.split('\n').find(line=>line==='const save=()=>store.set(KEY,saved);');
  assert.ok(save,'persistence must not depend on a timer that can lose input on reload');
  vm.runInContext(save+'\n'+listener,context);
  onInput({target:{dataset:{xin:'part-a'},value:'1/4'}});
  assert.equal(persisted['part-a'].f,'1/4');
  onInput({target:{dataset:{xw:'part-a'},value:'my working'}});
  assert.equal(persisted['part-a'].w,'my working');
  assert.equal(persisted['part-a'].f,'1/4');
});
test('supporting lessons register in the hub with valid quizzes and unique stable IDs',()=>{
  const lessons=[], checks=[];
  const elements=new Map();
  const context=vm.createContext({LEARN:{unit:'previous',lesson:cfg=>lessons.push({...cfg,unit:context.LEARN.unit}),B:new Proxy({check:qs=>{checks.push(...qs);return '';}},{get:(target,key)=>target[key]||(()=> '')})},LAB:{ICONS:{}},document:{getElementById:id=>{if(!elements.has(id))elements.set(id,{value:'1',textContent:'',addEventListener(){}});return elements.get(id);}}});
  vm.runInContext(fs.readFileSync(path.join(root,'measurements.js'),'utf8'),context);
  assert.equal(lessons.length,fs.existsSync(path.join(root,'chemistry-equilibrium.js'))?5:4);
  assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length);
  assert.ok(lessons.every(x=>x.unit==='measurements'&&x.blocks.length&&x.outcomes.length));
  assert.equal(context.LEARN.unit,'previous');
  assert.ok(checks.length>=12);
  checks.forEach(q=>assert.ok(q.opts?Number.isInteger(q.a)&&q.a>=0&&q.a<q.opts.length:Number.isFinite(q.a)));
});

if (html.includes('window.MSTEPS=')) {
  const source=html.slice(html.indexOf('function mark(p,lines){\n  // Working'),html.indexOf('\n\n/* ---- the UI ---- */',html.indexOf('function mark(p,lines){\n  // Working')));
  const context=vm.createContext({NumericTools:{parseNumber,matches},plain:t=>t.replace(/<[^>]+>/g,' ')});
  vm.runInContext(source+';this.mark=mark;',context);
  test('the actual five-mark normal question never receives marks for a gradient or copied hint',()=>{
    const line=html.split('\n').find(l=>l.includes('Find the equation of the normal to C at the point where x = 2'));
    assert.ok(line);
    const part=vm.runInContext('('+line.trim().replace(/\}\]\},?$/,'}')+')',context);
    for(const working of [['-0.25'],['4','0','-1/4'],['x + 4y − 2 = 0'],['x + 4y + 200 = 0']]) assert.equal(context.mark(part,working).award.filter(Boolean).length,0);
  });
  test('intermediate values in working cannot award final-answer or method marks',()=>{
    const p={q:'Calculate the value.',ans:{a:.25,tol:0},ms:[['M1','Method'],['A1','Answer']]};
    assert.equal(context.mark(p,['1/4']).award.filter(Boolean).length,0);
    for(const s of ['99 + 0.25','answer 0.25','x = 0.25']) assert.equal(context.mark(p,[s]).award.filter(Boolean).length,0);
    assert.equal(context.mark({...p,q:'Show that the result is 0.25.'},['0.25']).award.filter(Boolean).length,0);
  });
}
const chemistry=path.join(root,'chemistry-equilibrium.js');
if(fs.existsSync(chemistry)) {
  const {acidPH,bufferPH}=require(chemistry);
  test('buffer exhaustion gives the alkaline ethanoate equilibrium rather than pH 7',()=>{
    assert.ok(Math.abs(bufferPH(.005,.020,5)-9.068)<.005);
    assert.ok(bufferPH(.020,.005,-5)<3.1);
    assert.ok(Math.abs(bufferPH(.020,.020,0)+Math.log10(1.74e-5))<.001);
  });
  test('buffer curve is continuous and increasing through both exhaustion boundaries',()=>{
    for(const [ha,a,boundary] of [[.005,.020,5],[.020,.005,-5]]) {
      const values=[-.000001,0,.000001].map(d=>bufferPH(ha,a,boundary+d));
      assert.ok(values[0]<values[1]&&values[1]<values[2]);
      assert.ok(values[2]-values[0]<.01);
    }
  });
  test('acid equilibrium satisfies mass and charge balance over the whole slider range',()=>{
    for(const ha of [.005,.02,.05]) for(const a of [.005,.02,.05]) for(let x=-15;x<=15;x+=.5){
      const pH=bufferPH(ha,a,x),h=10**-pH,V=.1+Math.abs(x)/1000;
      const residual=h+(a+x/1000)/V-(ha+a)/V*1.74e-5/(1.74e-5+h)-1e-14/h;
      assert.ok(Number.isFinite(pH)&&Math.abs(residual)<1e-12);
    }
    assert.ok(Math.abs(acidPH(0,0,1.74e-5)-7)<1e-10);
    assert.ok(Math.abs(acidPH(1e-12,0,1.74e-5)-7)<.001);
  });
}
