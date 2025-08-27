// 顶点着色器
export const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

// 片段着色器
export const fragmentShaderSource = `
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vColor;
    }
`; 