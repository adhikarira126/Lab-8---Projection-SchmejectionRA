/**
 * Compiles a shader and attaches it to the given program.
 * @param {WebGL2RenderingContext} gl
 * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
 * @param {string} source - the GLSL source code
 * @param {WebGLProgram} program - the program to attach the shader to
 */
function compileAndAttachShader(gl, type, source, program) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    gl.attachShader(program, shader);
}

/**
 * Builds, links and starts using a WebGL program.
 * @param {WebGL2RenderingContext} gl
 * @param {string} vertexShaderSource
 * @param {string} fragmentShaderSource
 * @returns {WebGLProgram}
 */
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const program = gl.createProgram();

    compileAndAttachShader(gl, gl.VERTEX_SHADER, vertexShaderSource, program);
    compileAndAttachShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource, program);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);
    return program;
}