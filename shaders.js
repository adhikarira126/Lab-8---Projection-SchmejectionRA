const vertexShaderSource = `#version 300 es

in vec3 aPosition; // already in NDC (projection is done in points.js)

void main() {
    gl_Position = vec4(aPosition, 1.0);
    gl_PointSize = 10.0;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0); // red
}
`;