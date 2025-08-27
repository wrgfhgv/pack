// 顶点着色器
export const vertexShaderSource = `
    attribute vec4 a_VertexPosition;
    attribute vec4 a_VertexColor;
    
    uniform mat4 u_ProjectionMatrix;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;

    varying lowp vec4 v_Color;

    void main(void) {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_VertexPosition;
        v_Color = a_VertexColor;
    }
`;

// 片段着色器
export const fragmentShaderSource = `
    varying lowp vec4 v_Color;

    void main(void) {
        gl_FragColor = v_Color;
    }
`