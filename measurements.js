/* Supporting revision for numerical accuracy and applied mathematical modelling. */
(() => {
  "use strict";
  const {B, lesson} = LEARN, previous = LEARN.unit;
  LEARN.unit = "measurements";
  LAB.ICONS["u-measurements"] = LAB.ICONS["u-measure"] = LAB.ICONS["l-measure"] = '<path d="M3 7h18v10H3zM6 7v5M10 7v3M14 7v5M18 7v3"/>';
  const add = (id, num, name, intro, outcomes, blocks, onShow) => lesson({id,num,name,intro,group:"f",icon:"measure",lvl:`Supporting skills · Lesson ${num}`,eyebrow:"Edexcel A Level Mathematics · Supporting revision",title:name,outcomes:outcomes.map(t=>[t]),blocks,onShow});
  add("mu1",1,"Rounding, significant figures and exact values",
    "Keep exact values through a calculation and choose a useful precision for the final answer. This section revisits supporting skills used throughout Pure Mathematics, Statistics and Mechanics.",
    ["Distinguish exact and rounded values","Use significant figures and decimal places correctly","Avoid premature rounding"],[
      B.text("Exact or approximate?",'<p>Fractions such as 1/3, surds such as √2 and expressions such as π/6 can be exact. Their finite decimal displays are approximations. Use = for equality and ≈ when you round. A counted total can be exact; a measured length usually has limited accuracy.</p><p>Keep fractions, surds and calculator memory values until the final step. Follow a question’s requested accuracy. In a context question, include units and choose a precision that makes sense for the data.</p>'),
      B.text("Reading precision",'<p>Significant figures count from the first non-zero digit: 0.00450 has three significant figures. Decimal places count digits after the decimal point: 0.00450 has five decimal places. A trailing zero can communicate precision: 2.40 m conveys a different rounding interval from 2.4 m.</p>'),
      B.example("Avoid premature rounding","Calculate 3 × (1/3), then compare it with 3 × 0.33.",[["Keep the fraction","",["3 × (1/3) = 1 exactly"]],["Compare the rounded input","",["3 × 0.33 = 0.99","Rounding the input changes the calculation; retain the exact fraction until the end."]]]),
      B.check([
        {q:"How many significant figures are in 0.00450?",a:3,tol:0,why:"4, 5 and the final 0 are significant."},
        {q:"Round 12.3456 to three significant figures.",a:12.3,tol:0,why:"The first three significant digits are 1, 2 and 3; the next digit is 4."},
        {q:"Which should normally be kept during a calculation?",opts:["A two-decimal approximation at every step","Exact fractions and unrounded calculator values","Only whole numbers","The fewest digits possible"],a:1,why:"Round at the end, following the required accuracy."}
      ]), B.mistakes(["Confusing three significant figures with three decimal places.","Replacing π by 3.14 too early.","Writing an exact equality for a rounded value."])
    ]);
  add("mu2",2,"Measurements and error intervals",
    "A rounded measurement represents a range of possible values. Use interval notation before combining measurements.",
    ["Find lower and upper bounds","Write error intervals using inequalities","Distinguish rounding from truncation"],[
      B.text("Rounding to the nearest unit",'<p>If a positive measurement is rounded to the nearest step d, its possible values run from the displayed value minus d/2 up to, but not including, the displayed value plus d/2, using the usual school rounding convention. A length of 8.4 cm to the nearest 0.1 cm means <b>8.35 ≤ L &lt; 8.45 cm</b>.</p><p>The upper bound is a limiting value; it need not be an attainable maximum. State whether endpoints are included when asked for an interval.</p>'),
      B.text("Truncating is different",'<p>For positive x, truncating to one decimal place and obtaining 8.4 gives 8.4 ≤ x &lt; 8.5. Do not subtract half a step: truncation removes digits rather than choosing the nearest displayed value. Negative values require care with the direction of the interval.</p>'),
      B.example("A measured time","A time is recorded as 2.30 s to the nearest 0.01 s. State its error interval.",[["Find half the rounding step","",["0.01/2 = 0.005 s"]],["Form the bounds","",["2.295 ≤ t < 2.305 s"]]]),
      B.check([
        {q:"A length is 8.4 cm to the nearest 0.1 cm. Give its lower bound in cm.",a:8.35,tol:0,why:"8.4 − 0.05 = 8.35 cm."},
        {q:"A mass is 120 g to the nearest 10 g. Give its upper bound in g.",a:125,tol:0,why:"The half-step is 5 g, so 115 ≤ m < 125 g."},
        {q:"A positive value truncated to one decimal place is 6.2. Which interval applies?",opts:["6.15 ≤ x < 6.25","6.2 ≤ x < 6.3","6.1 < x ≤ 6.2","6.19 ≤ x < 6.21"],a:1,why:"Truncation discards later digits; it does not round to the nearest tenth."}
      ])
    ]);
  const controls = B.text("Explore speed bounds",'<p>A distance and time are rounded to the nearest stated step. Change the measurements to see the resulting speed interval. Inputs must describe positive distance and time intervals.</p><div class="two"><label>Distance / m <input id="bounds-distance" type="number" min="0.001" step="any" value="100"></label><label>Distance rounding step / m <input id="bounds-dstep" type="number" min="0.001" step="any" value="1"></label><label>Time / s <input id="bounds-time" type="number" min="0.001" step="any" value="12.4"></label><label>Time rounding step / s <input id="bounds-tstep" type="number" min="0.001" step="any" value="0.1"></label></div><p id="bounds-result" role="status" aria-live="polite"></p>');
  function drawBounds() {
    const get = id => Number(document.getElementById(id).value);
    const d=get("bounds-distance"), ds=get("bounds-dstep"), t=get("bounds-time"), ts=get("bounds-tstep");
    const output=document.getElementById("bounds-result");
    if (![d,ds,t,ts].every(Number.isFinite)||ds<=0||ts<=0||d-ds/2<=0||t-ts/2<=0) { output.textContent="Enter positive rounding steps and intervals that stay above zero."; return; }
    const low=(d-ds/2)/(t+ts/2), high=(d+ds/2)/(t-ts/2), fmt=n=>Number(n.toPrecision(12));
    output.textContent=`Lower speed bound: (${fmt(d-ds/2)})/(${fmt(t+ts/2)}) ≈ ${low.toFixed(4)} m s⁻¹. Upper speed bound: (${fmt(d+ds/2)})/(${fmt(t-ts/2)}) ≈ ${high.toFixed(4)} m s⁻¹. Decimal bounds shown are rounded; retain the fractions for exact comparisons.`;
  }
  add("mu3",3,"Combining bounds in calculations",
    "Choose the combination that makes the whole expression largest or smallest. Positive denominators are essential for the simple quotient rules used here.",
    ["Find bounds for sums, differences, products and quotients","Use positive intervals to bound a speed","Avoid rounding before comparing limits"],[
      B.text("Choose the correct ends",'<p>For independent positive intervals a<sub>L</sub> ≤ a &lt; a<sub>U</sub> and b<sub>L</sub> ≤ b &lt; b<sub>U</sub>:</p><ul><li>Sum: use a<sub>L</sub> + b<sub>L</sub> and a<sub>U</sub> + b<sub>U</sub>.</li><li>Difference a − b: lower bound a<sub>L</sub> − b<sub>U</sub>; upper bound a<sub>U</sub> − b<sub>L</sub>.</li><li>Product: use a<sub>L</sub>b<sub>L</sub> and a<sub>U</sub>b<sub>U</sub>.</li><li>Quotient a/b: lower bound a<sub>L</sub>/b<sub>U</sub>; upper bound a<sub>U</sub>/b<sub>L</sub>.</li></ul><p>Check endpoint inclusion separately. Intervals involving negative values or zero require a fresh analysis. If variables are linked, their endpoints may not be independently selectable.</p>'),
      controls,
      B.example("A rectangular area","A rectangle has length 5.0 cm and width 3.0 cm, both to the nearest 0.1 cm. Find the bounds for its area.",[["Bound each measurement","",["4.95 ≤ L < 5.05; 2.95 ≤ W < 3.05"]],["Multiply positive endpoints","",["A lower = 4.95 × 2.95 = 14.6025 cm²","A upper = 5.05 × 3.05 = 15.4025 cm²"]]]),
      B.check([
        {q:"For 9.5 ≤ a < 10.5 and 1.5 ≤ b < 2.5, give the lower bound of a − b.",a:7,tol:0,why:"Choose the smallest a and largest limiting b: 9.5 − 2.5 = 7."},
        {q:"For the same intervals, give the upper bound of a/b.",a:7,tol:0,why:"10.5/1.5 = 7."},
        {q:"Why can you not always maximise x(10 − x) by maximising both factors separately?",opts:["Products have no bounds","The two factors depend on the same x","Bounds apply only to lengths","You must round x first"],a:1,why:"Increasing x decreases 10 − x: the factors are not independent."}
      ])
    ],drawBounds);
  ["bounds-distance","bounds-dstep","bounds-time","bounds-tstep"].forEach(id=>document.getElementById(id).addEventListener("input",drawBounds)); drawBounds();
  add("mu4",4,"Measured data, uncertainty and modelling",
    "Separate uncertainty in the inputs from variation in a population and from assumptions in a mathematical model.",
    ["Distinguish measurement uncertainty from statistical spread","Check units and model assumptions","Interpret numerical results in context"],[
      B.text("Three different limitations",'<ul><li><b>Measurement uncertainty:</b> a ruler or timer gives limited information about one observation.</li><li><b>Statistical variation:</b> individuals in a population differ; a standard deviation describes spread, not an instrument’s resolution.</li><li><b>Model assumptions:</b> treating a particle as a point or ignoring air resistance simplifies reality and may limit a prediction.</li></ul><p>A calculation can be algebraically correct while its inputs or assumptions are unsuitable. Discuss a specific limitation and its likely effect, rather than simply writing “human error”.</p>'),
      B.text("Units and sense checks",'<p>Convert units before substituting: 72 km h⁻¹ = 20 m s⁻¹. For a speed v = d/t, the unit is distance divided by time. Check the sign, order of magnitude, domain and whether a probability lies between 0 and 1. An interval due to rounding is not a confidence interval and has no stated probability of containing a parameter.</p>'),
      B.example("An assumption in Mechanics","A projectile model ignores air resistance. How might this affect the prediction?",[["Name what is omitted","",["Drag opposes the motion; it is omitted from the model."]],["Connect it to the prediction","",["For an ordinary projectile in still air, this may overestimate the horizontal range. The effect depends on the object and its speed."]]]),
      B.check([
        {q:"Convert 72 km h⁻¹ to m s⁻¹.",a:20,tol:0,why:"72 × 1000/3600 = 20."},
        {q:"Does a sample standard deviation directly measure the uncertainty of a ruler?",opts:["Yes, always","No; it describes the spread of the observed data","Only if the sample has ten values","Only for normally distributed data"],a:1,why:"Instrument uncertainty and population spread describe different things."},
        {q:"What is the strongest evaluation of a model?",opts:["The answer is a decimal","All models are wrong","Identify a specific assumption and explain its effect","Add more significant figures"],a:2,why:"An evaluation links a concrete assumption to the prediction’s limitations."}
      ]), B.keypoints(["Keep exact values until the final answer.","A rounded measurement represents an interval.","Choose bounds for the whole expression, respecting linked variables.","Distinguish uncertainty, statistical variation and model assumptions."])
    ]);
  LEARN.unit=previous;
})();
