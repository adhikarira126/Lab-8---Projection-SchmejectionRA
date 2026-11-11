"use strict";
/*
 * Name:        Rachin Adhikari
 * Date:        11/10/2026
 * Description: Lab 8 - Projection, Schmejection. Builds a perspective
 *              projection matrix from the left/right/bottom/top/near/far
 *              values of a viewing volume, projects a list of 3D points
 *              into normalized device coordinates (NDC), draws them in a
 *              WebGL canvas, and reports in a table whether each point is
 *              inside the viewing volume.
 * Bugs:        None known.
 * Reflection:  See README.md
 */

// @ts-check
// handy-dandy shortcut
const { mat4, mat3, vec4, vec3, vec2 } = glMatrix;


// @ts-check
/** @type {WebGL2RenderingContext} */
let gl;
/** @type {WebGLProgram} */
let program;

let points = new Points();
let projMat;


let bounds = [
    document.getElementById('leftINP'),
    document.getElementById('rightINP'),
    document.getElementById('bottomINP'),
    document.getElementById('topINP'),
    document.getElementById('nearINP'),
    document.getElementById('farINP')
];

let pointsTable = document.getElementById('pointsTBL');

let newPointCoordinates = [
    document.getElementById('xINP'),
    document.getElementById('yINP'),
    document.getElementById('zINP'),
];

function initScene() {

    const canvas = document.getElementById('sandbox'); // snag the canvas element
    /** @type {WebGL2RenderingContext} */
    gl = canvas.getContext('webgl2'); // get its context
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    // each time a new value is entered, recalculate projMat and re-render points
    for (let j = 0; j < bounds.length; j++) {
        bounds[j].addEventListener('input', () => {
            recalculateProjMat(leftINP.valueAsNumber, rightINP.valueAsNumber, bottomINP.valueAsNumber, topINP.valueAsNumber, nearINP.valueAsNumber, farINP.valueAsNumber);
            points.render(projMat);
            drawTable();
        })
    };

    document.getElementById('addPointBTN').addEventListener('click', () => addPoint(xINP.valueAsNumber, yINP.valueAsNumber, zINP.valueAsNumber));
    document.getElementById('resetBTN').addEventListener('click', reset);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    recalculateProjMat(leftINP.valueAsNumber, rightINP.valueAsNumber, bottomINP.valueAsNumber, topINP.valueAsNumber, nearINP.valueAsNumber, farINP.valueAsNumber);
    points.render(projMat);
    drawTable();
}

/**
 * Builds the perspective projection matrix for the viewing volume (frustum).
 *     | 2n/(r-l)     0      (r+l)/(r-l)       0       |
 *     |    0      2n/(t-b)  (t+b)/(t-b)       0       |
 *     |    0         0     -(f+n)/(f-n)  -2fn/(f-n)   |
 *     |    0         0          -1            0       |
 * gl-matrix is column-major, so the values are listed one column at a time.
 */
function recalculateProjMat(l, r, b, t, n, f) {
    projMat = mat4.fromValues(
        2 * n / (r - l),     0,                   0,                        0,   // column 0
        0,                   2 * n / (t - b),     0,                        0,   // column 1
        (r + l) / (r - l),   (t + b) / (t - b),   -(f + n) / (f - n),      -1,   // column 2
        0,                   0,                   -2 * f * n / (f - n),     0    // column 3
    );
}

/**
 * Restores the original two points and the original viewing-volume values
 * (the values in the HTML), then redraws the canvas and the table.
 */
function reset() {
    points.points3D = [
        2, 1, -3,
        1, 2, -5
    ];
    for (let j = 0; j < bounds.length; j++) {
        bounds[j].value = bounds[j].defaultValue; // defaultValue = the HTML value attribute
    }
    recalculateProjMat(leftINP.valueAsNumber, rightINP.valueAsNumber, bottomINP.valueAsNumber, topINP.valueAsNumber, nearINP.valueAsNumber, farINP.valueAsNumber);
    points.render(projMat);
    drawTable();
}

function addPoint(x, y, z) {
    points.points3D.push(x, y, z); // add points to the array
    points.render(projMat);  
    drawTable();
}

function drawTable() {

    while (pointsTable.rows.length > 1) {
        pointsTable.deleteRow(-1);
    }

    for (let i = 0; i < points.numPoints(); i++) {
        let x = points.points3D[3 * i + 0];
        let y = points.points3D[3 * i + 1];
        let z = points.points3D[3 * i + 2];

        let xNDC = points.pointsNDC[3 * i + 0];
        let yNDC = points.pointsNDC[3 * i + 1];
        let zNDC = points.pointsNDC[3 * i + 2];

        let visibility = points.points3DInsideViewVolume[i];

        let newRow = pointsTable.insertRow(-1); // appends a new row
        let pointCell = newRow.insertCell(0);
        let ndcCell = newRow.insertCell(1);
        let resultCell = newRow.insertCell(2);

        pointCell.innerHTML = `${i + 1}. (${x}, ${y}, ${z})`;
        ndcCell.innerHTML = `(${xNDC.toFixed(2)}, ${yNDC.toFixed(2)},  ${zNDC.toFixed(2)})`;
        resultCell.textContent = visibility ? 'Visible' : 'Not visible';
    }
}



initScene();