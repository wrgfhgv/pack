import { mat4 } from 'gl-matrix';
import { vertexShaderSource, fragmentShaderSource } from './shaders';

function initShaderProgram(gl) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('无法初始化着色器程序: ' + gl.getProgramInfoLog(program));
        return null;
    }
    return program;

}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('编译着色器时发生错误: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function initBuffer(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        0.0,  0.5,  0.0,
        -0.5, -0.5,  0.0,
         0.5, -0.5,  0.0,
         
         0.0,  0.5, -0.5,  // z轴位置不同
         -0.5, -0.5, -0.5,
          0.5, -0.5, -0.5
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colors = [
        1, 0, 0.4, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,

        1, 0, 0.4, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);    

    return {
        positionBuffer,
        colorBuffer,
    }
    
        
}

function initProjectionMatrix(gl, fieldDegree = 45, aspect = gl.canvas.clientWidth / gl.canvas.clientHeight, zNear = 0.1, zFar = 100.0) {
    const fieldOfView = fieldDegree * Math.PI / 180;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    return projectionMatrix;
}



function drawScene(gl, programInfo, rotation) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const modelMatrix = mat4.create();
    mat4.rotate(modelMatrix, modelMatrix, rotation, [0.5, 1, 0]);
    
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, modelMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

        

}

function main() {
    const canvas = document.querySelector('#glCanvas');
    const gl = canvas.getContext('webgl');

    canvas.width = 800;
    canvas.height = 600;

    gl.viewport(0, 0, canvas.width, canvas.height);

    const program = initShaderProgram(gl);

    const programInfo = {
        program,
        attributeLocations: {
            vertexPosition: gl.getAttribLocation(program, 'a_VertexPosition'),
            vertexColor: gl.getAttribLocation(program, 'a_VertexColor')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(program, 'u_ProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(program, 'u_ModelMatrix'),
            viewMatrix: gl.getUniformLocation(program, 'u_ViewMatrix'),
        }
    }

    const buffers = initBuffer(gl);

    let rotation = 0.0;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL)

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -6]);

    const projectionMatrix = initProjectionMatrix(gl);

    gl.useProgram(programInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    gl.vertexAttribPointer(programInfo.attributeLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attributeLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
    gl.vertexAttribPointer(programInfo.attributeLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attributeLocations.vertexColor);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);


    function render() {
        rotation += 0.01;
        drawScene(gl, programInfo, rotation);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();
