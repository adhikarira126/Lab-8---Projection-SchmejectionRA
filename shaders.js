const vertexShaderSource = `#version 300 es
//#pragma vscode_glsllint_stage : STAGE

in vec3 aPosition;

void main() {
   
    gl_Position = vec4(aPosition, 1.0);
    gl_PointSize = 10.0;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform vec4 uColor;
out vec4 fragColor; // the type 
void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
