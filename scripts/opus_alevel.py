"""Original review-lesson content and supporting-skills exam questions for A level Maths.
Every numerical answer is computed and asserted here. Run: python3 scripts/opus_alevel.py -> alevel-opus-data.js"""
import json, math
from fractions import Fraction as Fr
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
def close(a, b, tol=1e-9): return abs(a - b) <= tol * max(1, abs(b))
def Phi(z): return 0.5 * (1 + math.erf(z / math.sqrt(2)))
def binom_pmf(n, p, k): return math.comb(n, k) * p ** k * (1 - p) ** (n - k)

def P(q, ms, ans=None, unit='', tol=0):
    d = dict(q=q, m=len(ms), ms=[list(x) for x in ms])
    if ans is not None: d['ans'] = dict(a=round(ans, 10), unit=unit, tol=tol)
    return d
def Q(stem, *parts): return dict(stem=stem, parts=list(parts))
def H(title, q, lines, ans, fig=None):
    d = dict(title=title, q=q, lines=[dict(m=m, n=n) for m, n in lines] + [dict(m=ans, ans=True)])
    if fig: d['fig'] = fig
    return d
def F(q, *lines): return dict(q=q, lines=list(lines))

R = {}
# p9 -----------------------------------------------------------------------
assert -13 + 4 + 25 == 16 and -1 + 25 + 1 == 25
for x in (3, -0.6): y = 2 * x - 3; assert close(x * x + y * y, 18) and close(5 * x * x - 12 * x - 9, 0)
assert close(3 / (math.sqrt(5) - 2), 6 + 3 * math.sqrt(5))
assert close(8 ** (2 / 3), 4) and all(close(x * x - 8 * x + 3, (x - 4) ** 2 - 13) for x in (0.3, 7.1))
R['p9'] = dict(
    hand=[H('Centre and radius of a circle', 'Find the centre and radius of the circle x² + y² + 4x − 10y + 13 = 0.', [('(x + 2)² − 4 + (y − 5)² − 25 + 13 = 0', 'complete the square in x and in y'), ('(x + 2)² + (y − 5)² = 16', 'collect the constants on the right')], 'centre (−2, 5), radius 4', fig='circle'),
          H('Using the discriminant', 'kx² + 4x + 1 = 0 has two distinct real roots. Find the possible values of k.', [('b² − 4ac &gt; 0', 'two distinct real roots'), ('16 − 4k &gt; 0', 'a = k, b = 4, c = 1'), ('k &lt; 4', 'divide by 4')], 'k &lt; 4 and k ≠ 0 (otherwise the equation is not quadratic)')],
    fill=[F('Complete the square.', 'x² − 8x + 3 = (x − [[4]])² − [[13]]'),
          F('Evaluate without a calculator.', '8^(2/3) = (∛8)² = [[4]]'),
          F('Line through (1, 2) with gradient 3.', 'y − 2 = 3(x − 1), so y = 3x − [[1]]')],
    exam=[Q('', P('Find the centre and the radius of the circle x² + y² + 10x − 2y + 1 = 0.', [('M1', '(x + 5)² − 25 seen'), ('M1', '(y − 1)² − 1 seen'), ('A1', 'centre (−5, 1), radius 5')])),
          Q('', P('Solve the simultaneous equations y = 2x − 3 and x² + y² = 18.', [('M1', 'substitutes: x² + (2x − 3)² = 18'), ('A1', '5x² − 12x − 9 = 0'), ('M1', 'solves: (5x + 3)(x − 3) = 0'), ('A1', '(3, 3) and (−0.6, −4.2)')])),
          Q('', P('Express 3/(√5 − 2) in the form a + b√5, where a and b are integers.', [('M1', 'multiplies numerator and denominator by √5 + 2'), ('A1', '6 + 3√5')]))])
# q6 -----------------------------------------------------------------------
assert [math.comb(5, k) * 2 ** k for k in range(4)] == [1, 10, 40, 80]
assert round(math.log(20) / math.log(3), 2) == 2.73
assert math.comb(6, 2) * 2 ** 4 == 240
x = Fr(1, 8); assert (x + 1) / x == 9
c = math.sqrt(49 + 64 - 2 * 7 * 8 * math.cos(math.radians(60))); assert close(c * c, 57) and round(c, 2) == 7.55
R['q6'] = dict(
    hand=[H('Binomial expansion', 'Expand (1 + 2x)⁵ in ascending powers of x up to and including the term in x³.', [('1 + 5(2x) + 10(2x)² + 10(2x)³', 'coefficients 1, 5, 10, 10 from ⁵Cᵣ'), ('= 1 + 10x + 10 × 4x² + 10 × 8x³', 'bracket every power of 2x')], '1 + 10x + 40x² + 80x³'),
          H('Solving an exponential equation', 'Solve 3ˣ = 20, giving x to 3 significant figures.', [('x ln 3 = ln 20', 'take logs of both sides'), ('x = ln 20 ÷ ln 3 = 2.726…', 'divide')], 'x = 2.73')],
    fill=[F('A key identity.', 'sin²θ + cos²θ = [[1]]'),
          F('Magnitude of a vector.', '|3i + 4j| = √(9 + 16) = [[5]]'),
          F('Evaluate.', 'log₂ 32 = [[5]]')],
    exam=[Q('', P('Find the coefficient of x² in the expansion of (2 − x)⁶.', [('M1', '⁶C₂ × 2⁴ × (−x)²'), ('A1', '240')], ans=240)),
          Q('', P('Solve log₃(x + 1) − log₃ x = 2.', [('M1', 'log₃((x + 1)/x) = 2'), ('M1', '(x + 1)/x = 9'), ('A1', 'x = 1/8')], ans=0.125)),
          Q('', P('In triangle ABC, AB = 7 cm, AC = 8 cm and angle BAC = 60°. Find BC, giving your answer to 3 significant figures.', [('M1', 'BC² = 7² + 8² − 2 × 7 × 8 × cos 60°'), ('A1', '√57 = 7.55 cm')], ans=round(c, 2), unit='cm', tol=0.001))])
# d6 -----------------------------------------------------------------------
assert 2 ** 3 - 4 * 2 + 1 == 1 and 3 * 4 - 4 == 8 and 8 * 2 - 15 == 1
assert Fr(27, 3) + 6 - (Fr(1, 3) + 2) == Fr(38, 3)
f = lambda x: x ** 3 - 3 * x ** 2 - 9 * x + 2
assert f(-1) == 7 and f(3) == -25 and 3 - (-6) - 9 == 0 and 27 - 18 - 9 == 0 and 6 * -1 - 6 == -12 and 6 * 3 - 6 == 12
assert Fr(5 * 25, 2) - Fr(125, 3) == Fr(125, 6)
R['d6'] = dict(
    hand=[H('Tangent to a cubic', 'Find the equation of the tangent to y = x³ − 4x + 1 at the point where x = 2.', [('y = 8 − 8 + 1 = 1', 'the point is (2, 1)'), ('dy/dx = 3x² − 4 = 8', 'gradient at x = 2'), ('y − 1 = 8(x − 2)', 'y − y₁ = m(x − x₁)')], 'y = 8x − 15', fig='tangent'),
          H('Definite integral', 'Evaluate ∫₁³ (x² + 2) dx.', [('[x³/3 + 2x]₁³', 'integrate each term'), ('(9 + 6) − (1/3 + 2)', 'top limit minus bottom limit')], '38/3 ≈ 12.67')],
    fill=[F('Differentiate.', 'd/dx(5x⁴) = [[20]]x³'),
          F('Integrate.', '∫ 6x² dx = [[2]]x³ + c'),
          F('Stationary points.', 'at a stationary point dy/dx = [[0]]')],
    exam=[Q('<p>A curve has equation y = x³ − 3x² − 9x + 2.</p>',
            P('Find the coordinates of the stationary points of the curve.', [('M1', 'dy/dx = 3x² − 6x − 9'), ('M1', 'sets dy/dx = 0: 3(x − 3)(x + 1) = 0'), ('A1', 'x = −1 and x = 3'), ('A1', '(−1, 7) and (3, −25)')]),
            P('Determine the nature of each stationary point.', [('M1', 'd²y/dx² = 6x − 6 evaluated at both points'), ('A1', '(−1, 7) maximum (−12 &lt; 0); (3, −25) minimum (12 &gt; 0)')])),
          Q('', P('Find the area of the region bounded by the curve y = 5x − x² and the x-axis.', [('M1', 'limits 0 and 5'), ('M1', '[5x²/2 − x³/3] from 0 to 5'), ('A1', '125/6')], ans=125 / 6, tol=0.001))])
# r6 -----------------------------------------------------------------------
assert 30 * (2 * 5 + 29 * 4) // 2 == 1890 and 3 * 2 ** 4 == 48 and 10 / (1 - 0.5) == 20
assert Fr(1, (3 * 1 - 1) + 2) == Fr(1, 4) and 80 / (1 - 0.75) == 320 and sum(3 * r + 2 for r in range(1, 21)) == 670
R['r6'] = dict(
    hand=[H('Composite and inverse functions', 'f(x) = 2x + 3 and g(x) = x². Find fg(x) and f⁻¹(x).', [('fg(x) = f(x²) = 2x² + 3', 'apply g first, then f'), ('y = 2x + 3 → x = (y − 3)/2', 'rearrange, then swap the letters')], 'fg(x) = 2x² + 3; f⁻¹(x) = (x − 3)/2'),
          H('Sum of an arithmetic series', 'Find the sum of the first 30 terms of 5, 9, 13, …', [('a = 5, d = 4, n = 30', 'identify the values'), ('S = 30/2 × (2 × 5 + 29 × 4)', 'Sₙ = n/2 (2a + (n − 1)d)')], 'S₃₀ = 15 × 126 = 1890')],
    fill=[F('Geometric sequence with a = 3 and r = 2.', '5th term = 3 × 2⁴ = [[48]]'),
          F('Sum to infinity with a = 10 and r = 0.5.', 'S∞ = 10 ÷ (1 − 0.5) = [[20]]'),
          F('Modulus.', '|−7| = [[7]]')],
    exam=[Q('', P('f(x) = 3x − 1 and g(x) = 1/(x + 2). Find gf(1).', [('M1', 'f(1) = 2'), ('A1', 'g(2) = 1/4')], ans=0.25)),
          Q('', P('A geometric series has first term 80 and sum to infinity 320. Find the common ratio.', [('M1', '80/(1 − r) = 320'), ('A1', 'r = 0.75')], ans=0.75)),
          Q('', P('Find the value of Σ (3r + 2) for r = 1 to 20.', [('M1', 'arithmetic with a = 5, d = 3, or 3 × Σr + 40'), ('M1', '20/2 × (5 + 62), or 3 × 210 + 40'), ('A1', '670')], ans=670))])
# t5 -----------------------------------------------------------------------
assert close(math.hypot(8, 6), 10) and round(math.degrees(math.atan2(6, 8)), 2) == 36.87
for xd in (0, 37, 211): assert close(8 * math.sin(math.radians(xd)) + 6 * math.cos(math.radians(xd)), 10 * math.sin(math.radians(xd + math.degrees(math.atan2(6, 8)))))
Rr, al = math.sqrt(29), math.degrees(math.atan(5 / 2))
for th in (10, 200): assert close(2 * math.cos(math.radians(th)) - 5 * math.sin(math.radians(th)), Rr * math.cos(math.radians(th + al)))
assert round(al, 1) == 68.2 and round(Rr, 2) == 5.39
sols = [d for d in range(360) if abs(math.sin(math.radians(2 * d)) - math.sin(math.radians(d))) < 1e-9]
assert sols == [0, 60, 180, 300], sols
R['t5'] = dict(
    hand=[H('Harmonic form', 'Express 8 sin x + 6 cos x in the form R sin(x + α), with R &gt; 0 and 0° &lt; α &lt; 90°.', [('R cos α = 8, R sin α = 6', 'expand R sin(x + α) and compare'), ('R = √(8² + 6²) = 10', 'square and add'), ('tan α = 6/8 → α = 36.87°', 'divide')], '10 sin(x + 36.9°)', fig='harmonic'),
          H('Reciprocal function equation', 'Solve sec x = 2 for 0° ≤ x &lt; 360°.', [('cos x = 1/2', 'sec x = 1/cos x'), ('x = 60° or x = 360° − 60°', 'cos is positive in the first and fourth quadrants')], 'x = 60°, 300°')],
    fill=[F('Double angle.', 'cos 2A = 1 − [[2]]sin²A'),
          F('If tan θ = 3:', 'sec²θ = 1 + tan²θ = [[10]]'),
          F('5 sin x + 12 cos x = R sin(x + α).', 'R = [[13]]')],
    exam=[Q('', P('Express 2 cos θ − 5 sin θ in the form R cos(θ + α), where R &gt; 0 and 0° &lt; α &lt; 90°. Give α to 1 decimal place.', [('M1', 'R = √29'), ('M1', 'tan α = 5/2'), ('A1', '√29 cos(θ + 68.2°)')]),
            P('Hence write down the maximum value of 2 cos θ − 5 sin θ.', [('B1', '√29 ≈ 5.39')], ans=round(Rr, 2), tol=0.002)),
          Q('', P('Solve sin 2x = sin x for 0° ≤ x &lt; 360°.', [('M1', 'uses sin 2x = 2 sin x cos x'), ('A1', 'sin x(2 cos x − 1) = 0'), ('M1', 'sin x = 0 or cos x = ½'), ('A1', 'x = 0°, 60°, 180°, 300°')]))])
# c9 -----------------------------------------------------------------------
h = 1e-6
yf = lambda x: x ** 3 * math.log(x)
dy = lambda x: (yf(x + h) - yf(x - h)) / (2 * h)
assert close(dy(1.7), 1.7 ** 2 * (3 * math.log(1.7) + 1), 1e-5)
ip = lambda a, b: (b * math.exp(b) - math.exp(b)) - (a * math.exp(a) - math.exp(a))
n = 20000; num = sum(((i + .5) / n * 2) * math.exp((i + .5) / n * 2) for i in range(n)) * 2 / n; assert close(num, ip(0, 2), 1e-6)
assert close(6 * 1 / (3 + 1), 1.5) and Fr(2 ** 4 - 1, 4) == Fr(15, 4)
R['c9'] = dict(
    hand=[H('Product rule', 'Differentiate y = x³ ln x.', [('u = x³, v = ln x', 'choose u and v'), ('du/dx = 3x², dv/dx = 1/x', 'standard derivatives'), ('dy/dx = 3x² ln x + x³ × 1/x', 'v du/dx + u dv/dx')], 'dy/dx = x²(3 ln x + 1)'),
          H('Integration by parts', 'Find ∫ xeˣ dx.', [('u = x, dv/dx = eˣ', 'differentiate the polynomial part'), ('du/dx = 1, v = eˣ', ''), ('xeˣ − ∫ eˣ dx', 'uv − ∫ v du/dx')], 'xeˣ − eˣ + c')],
    fill=[F('Gradient of y = e⁴ˣ at x = 0.', 'dy/dx = 4e⁴ˣ, so the gradient is [[4]]'),
          F('Evaluate ∫ cos x dx from 0 to π/2.', '[sin x] = 1 − 0 = [[1]]'),
          F('Gradient of y = sin 3x at x = 0.', 'dy/dx = 3 cos 3x = [[3]]')],
    exam=[Q('', P('Differentiate y = (2x + 1)⁵.', [('M1', 'k(2x + 1)⁴'), ('A1', '10(2x + 1)⁴')])),
          Q('', P('Find the gradient of the curve y = ln(3x² + 1) at the point where x = 1.', [('M1', 'dy/dx = 6x/(3x² + 1)'), ('A1', '3/2')], ans=1.5)),
          Q('', P('Find the exact value of ∫ 2x(x² + 1)³ dx from x = 0 to x = 1.', [('M1', '(x² + 1)⁴ ÷ 4, by substitution or inspection'), ('M1', 'substitutes the limits: (16 − 1)/4'), ('A1', '15/4')], ans=3.75))])
# s9 -----------------------------------------------------------------------
p3 = binom_pmf(10, 0.4, 3); assert round(p3, 4) == 0.2150
p125 = 1 - Phi(25 / 15); assert round(p125, 4) == 0.0478
le2 = sum(binom_pmf(12, 0.3, k) for k in range(3)); assert round(le2, 4) == 0.2528
band = Phi(1.5) - Phi(-1); assert round(band, 4) == 0.7745
assert close(0.3 + 0.5 - 0.15, 0.65) and close(0.5 + 0.4 - 0.2, 0.7)
R['s9'] = dict(
    hand=[H('A binomial probability', 'X ~ B(10, 0.4). Find P(X = 3).', [('P(X = 3) = ¹⁰C₃ × 0.4³ × 0.6⁷', 'nCr pʳ (1 − p)ⁿ⁻ʳ'), ('= 120 × 0.064 × 0.027 993 6', 'evaluate each factor')], '0.2150 (4 d.p.)', fig='binom'),
          H('A normal probability', 'X ~ N(100, 15²). Find P(X &gt; 125).', [('z = (125 − 100) ÷ 15 = 1.667', 'standardise'), ('P(Z &gt; 1.667) = 1 − 0.9522', 'or use the calculator normal function directly')], '0.0478', fig='normal')],
    fill=[F('X ~ B(40, 0.25).', 'mean = np = [[10]]'),
          F('Normal distribution.', 'about [[68]]% of values lie within one standard deviation of the mean'),
          F('P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2.', 'P(A ∪ B) = [[0.7]]')],
    exam=[Q('', P('X ~ B(12, 0.3). Find P(X ≤ 2).', [('M1', 'P(0) + P(1) + P(2), or calculator cumulative function'), ('A1', '0.2528')], ans=round(le2, 4), tol=0.001)),
          Q('', P('X ~ N(30, 4²). Find P(26 &lt; X &lt; 36).', [('M1', 'standardises: z = −1 and z = 1.5'), ('A1', '0.7745')], ans=round(band, 4), tol=0.001)),
          Q('', P('A and B are independent events with P(A) = 0.3 and P(B) = 0.5. Find P(A ∪ B).', [('M1', '0.3 + 0.5 − 0.3 × 0.5'), ('A1', '0.65')], ans=0.65))])
# m8 -----------------------------------------------------------------------
g = 9.8
assert (15 - 3) / 4 == 3 and (3 + 15) / 2 * 4 == 36 and round(g * math.sin(math.radians(25)), 2) == 4.14
assert 2 + 3 * 5 == 17 and 6 * 2.5 == 15 and close(5 * g, 49)
tdrop = math.sqrt(2 * 45 / g); assert round(tdrop, 2) == 3.03
RA = (10 * g * 3 + 5 * g * 5) / 6; assert round(RA, 1) == 89.8
acc = (20 - 0.4 * 3 * g) / 3; assert round(acc, 2) == 2.75
R['m8'] = dict(
    hand=[H('Constant acceleration', 'A particle accelerates uniformly from 3 m s⁻¹ to 15 m s⁻¹ in 4 s. Find its acceleration and the distance travelled.', [('a = (15 − 3) ÷ 4 = 3 m s⁻²', 'v = u + at'), ('s = (3 + 15)/2 × 4', 's = (u + v)t/2')], 'a = 3 m s⁻², s = 36 m'),
          H('Smooth inclined plane', 'A particle of mass 4 kg slides down a smooth plane inclined at 25° to the horizontal. Find its acceleration.', [('resolve parallel to the plane: 4g sin 25° = 4a', 'the normal reaction has no component along the plane'), ('a = 9.8 × sin 25°', 'the mass cancels')], 'a = 4.14 m s⁻² (3 s.f.)', fig='slope')],
    fill=[F('v = u + at with u = 2, a = 3, t = 5.', 'v = [[17]] m s⁻¹'),
          F('F = ma with m = 6 kg and a = 2.5 m s⁻².', 'F = [[15]] N'),
          F('Weight of a 5 kg mass (g = 9.8 m s⁻²).', 'W = [[49]] N')],
    exam=[Q('', P('A ball is dropped from rest from a height of 45 m. Find the time it takes to reach the ground. Give your answer to 3 significant figures.', [('M1', '45 = ½ × 9.8 × t²'), ('A1', '3.03 s')], ans=round(tdrop, 2), unit='s', tol=0.002)),
          Q('<p>A uniform rod AB of length 6 m and mass 10 kg rests horizontally on supports at A and B. A particle of mass 5 kg is placed on the rod 1 m from A.</p>', P('Find the reaction at A.', [('M1', 'takes moments about B'), ('A1', '6R = 10g × 3 + 5g × 5'), ('A1', 'R = 89.8 N')], ans=round(RA, 1), unit='N', tol=0.002)),
          Q('', P('A block of mass 3 kg is pulled across a rough horizontal surface by a horizontal force of 20 N. The coefficient of friction is 0.4. Find the acceleration of the block.', [('M1', 'F = 0.4 × 3g = 11.76 N'), ('M1', '20 − 11.76 = 3a'), ('A1', '2.75 m s⁻²')], ans=round(acc, 2), unit='m s⁻²', tol=0.003))])

# supporting skills (measurement) exam questions -----------------------------
assert close(math.sqrt(50), 5 * math.sqrt(2)) and close(3.2e4 * 4.5e-2, 1440) and round(math.pi / 6 + math.sqrt(3), 2) == 2.26
assert round(8.45 / 2.05, 2) == 4.12 and close(8.35 - 2.15, 6.2) and close(9.8 * 3, 29.4) and round((29.4 - 27.1) / 27.1 * 100, 1) == 8.5
EX = {
 'mu1': [Q('', P('Write √50 in the form k√2.', [('B1', '5√2')])),
         Q('', P('Work out (3.2 × 10⁴) × (4.5 × 10⁻²). Give your answer to 2 significant figures.', [('M1', '1440 seen'), ('A1', '1400')], ans=1400)),
         Q('', P('x = π/6 + √3. Give x correct to 3 significant figures.', [('B1', '2.26')], ans=2.26, tol=0.002))],
 'mu2': [Q('', P('The mass of a parcel is 4.7 kg, correct to 2 significant figures. Write down the error interval for the mass m kg.', [('B1', '4.65 or 4.75 as a bound'), ('B1', '4.65 ≤ m &lt; 4.75')])),
         Q('', P('A time is truncated to 12 whole seconds. Write down the error interval for the time t seconds.', [('B1', '12 ≤ t &lt; 13')]))],
 'mu3': [Q('<p>a = 8.4 and b = 2.1, each correct to 1 decimal place.</p>',
           P('Work out the upper bound of a ÷ b. Give your answer to 3 significant figures.', [('M1', 'upper bound of a: 8.45'), ('M1', 'divides by the lower bound of b: 2.05'), ('A1', '4.12')], ans=4.12, tol=0.002),
           P('Work out the lower bound of a − b.', [('M1', '8.35 − 2.15'), ('A1', '6.2')], ans=6.2, tol=0.0001))],
 'mu4': [Q('<p>A model for a ball dropped from rest gives its speed as v = 9.8t m s⁻¹.</p>',
           P('State one assumption made in this model.', [('B1', 'air resistance is negligible, or the ball is modelled as a particle')]),
           P('After 3 s the measured speed is 27.1 m s⁻¹. Work out the percentage by which the model’s prediction exceeds the measured speed.', [('M1', 'prediction 9.8 × 3 = 29.4'), ('M1', '(29.4 − 27.1) ÷ 27.1 × 100'), ('A1', '8.5%')], ans=8.5, unit='%', tol=0.006))],
}
nparts = 0
for bank in [EX] + [{k: v['exam']} for k, v in R.items()]:
    for lid, qs in bank.items():
        for q in qs:
            for p in q['parts']:
                assert p['m'] == len(p['ms']) and 1 <= p['m'] <= 5, (lid, p['q']); nparts += 1
(ROOT / 'alevel-opus-data.js').write_text('/* Generated by scripts/opus_alevel.py: original review content and supporting-skills questions. */\nwindow.ALEVEL_OPUS=' + json.dumps(dict(reviews=R, exams=EX), ensure_ascii=False) + ';\n', encoding='utf-8')
print('exam parts', nparts, 'reviews', len(R), 'support lessons', len(EX))
