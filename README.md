# Lab 8 - Projection, Schmejection

## What it does
The page builds a perspective projection matrix from the left, right, bottom,
top, near and far values of a viewing volume. It projects each 3D point into
normalized device coordinates (NDC), draws the points in a WebGL canvas, and
lists in a table whether each point lands inside the viewing volume. The Reset
button puts the original two points and the original viewing-volume values back.

## Reflection
Writing recalculateProjMat() made me slow down and work through the
perspective matrix one row at a time. The part that caught me was that
gl-matrix stores matrices in column-major order, so the values have to be typed
in one column at a time, not the way the matrix is written on paper. I checked
my matrix against the sample output: point (2, 1, -3) has to come out as
(0.17, 0.11, 0.48). Seeing a point at z = -12 get an NDC z of 1.04, and so
become "Not visible", made the role of the far plane click for me. The w
coordinate is just -z, and dividing by it is what makes far-away points
shrink toward the center.

## Refactoring I did, and why
1. **Extracted updateScene().** The same four lines (read the inputs, rebuild
   the matrix, render, redraw the table) were copied three times. They also
   used leftINP, rightINP, ... which only work because the browser turns
   element ids into hidden global variables. Now there is one function, and it
   reads from the bounds array.
2. **Kept the starting points in one place.** The two starting points, their
   NDC values and their results were typed by hand in points.js *and*
   hard-coded as rows in index.html. If anyone changed one, the other would be
   wrong. Now Points.INITIAL_POINTS is the only copy, and everything else is
   calculated.
3. **Created the WebGL buffer once.** render() called gl.createBuffer() every
   time anything changed, so it leaked a GPU buffer per keystroke. It also
   depended on the global gl and program. Now they are set up once in the
   Points constructor.
4. **Removed dead code.** I removed translate, scale, rotate (which was also
   wrong), rand, rotateAroundAxis, a commented-out function, the unused uColor
   uniform, the unused imports, the two misplaced @ts-check lines (they didn't
   do anything) and the console.logs. I renamed createShader to
   compileAndAttachShader because it doesn't return a shader. It attaches the
   shader to the program.
5. **Cleaned up the HTML/CSS.** I moved the inline styles into styles.css,
   deleted styles for elements that don't exist, and fixed the page title and
   the heading typo.

## Bugs
None known.