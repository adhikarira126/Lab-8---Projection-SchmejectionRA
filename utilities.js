
/**
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader(gl, type, source, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    gl.attachShader(program, shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {

    const program = gl.createProgram();

    console.log('about to work on vertex shader');
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource, program);
    console.log('about to work on fragment shader');
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, program);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program); // how to indicate which program you plan to use (you can switch between WebGL programs) 
    return program;
}

function translate(tx, ty) {
    return glMatrix.mat4.fromValues(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0.0,
        tx, ty, 0, 1);
}

function scale(sx, sy) {
    return glMatrix.mat4.fromValues(
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, 1, 0.0,
        0, 0, 0, 1);
}

function rotate(theta) {
    return glMatrix.mat4.fromValues(
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 1);
}

function rand(min = -1, max = 1) {
    return min + (max - min) * Math.random();
}

/**
 * This function rotates a point around an arbitrary axis in 3D space.
 * @param {vec3} out - The output vector where the result will be stored.
 * @param {vec3} point - The point to be rotated. 
* @param {vec3} pivot - The pivot point around which the rotation occurs.
 * @param {vec3} axis - The axis of rotation (should be a normalized vector).
 * @param {number} rad - The angle of rotation in radians.
 * @returns {vec3} The rotated point stored in the 'out' vector.
 */
function rotateAroundAxis(out, point, pivot, axis, rad) {
    const m = mat4.create(); // m = I4

    mat4.translate(m, m, pivot); // m = I * translate(pivot)
    mat4.rotate(m, m, rad, axis); // m = I * translate(pivot) * rotate(rad, axis)
    mat4.translate(m, m, vec3.negate(vec3.create(), pivot)); // m = I * translate(pivot) * rotate(rad, axis) * translate(-pivot)
    return vec3.transformMat4(out, point, m); //
}

/*
function establishMVMatrices(gl, eye, at, up) {
    // set up the model matrix M
    const uModelLoc = gl.getUniformLocation(program, 'uModel');
    const uModel = new Float32Array([
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    gl.uniformMatrix4fv(uModelLoc, false, uModel);

    // set up the view matrix V (from scratch)
    let n = vec3.create();
    vec3.subtract(n, new Float32Array(eye), new Float32Array(at)); // n = eye - at
    vec3.normalize(n, n);

    let u = vec3.create();
    vec3.cross(u, up, n);   // u = up x n
    vec3.normalize(u, u);

    let v = vec3.create();
    vec3.cross(v, n, u);    // v = n x u
    
    // build V
    const uViewLoc = gl.getUniformLocation(program, 'uView');

    const uView = new Float32Array([            //  V, from scratch
        u[0], v[0], n[0], 0,                    // as usual, column-wise order
        u[1], v[1], n[1], 0,
        u[2], v[2], n[2], 0,
        -vec3.dot(u, eye), -vec3.dot(v, eye), -vec3.dot(n, eye), 1
    ]);

    gl.uniformMatrix4fv(uViewLoc, false, uView);
}
    */