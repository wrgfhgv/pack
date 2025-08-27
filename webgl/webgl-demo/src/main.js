import { mat4 } from 'gl-matrix';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import './style.css';

let gl;
let programInfo;
let buffers;

// 初始化着色器程序
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('无法初始化着色器程序: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// 创建着色器
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

// 初始化缓冲区
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    0.0,
    0.5,
    0.0,
    -0.5,
    -0.5,
    0.0,
    0.5,
    -0.5,
    0.0,

    0.0,
    0.5,
    -0.5, // z轴位置不同
    -0.5,
    -0.5,
    -0.5,
    0.5,
    -0.5,
    -0.5,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  const colors = [
    1.0,
    0.0,
    0.0,
    1.0, // 红色
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0,
    1.0, // 蓝色
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

// 绘制场景
function drawScene(gl, programInfo, buffers, rotation) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 创建透视矩阵
  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 设置绘图位置
  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0.5, 1, 0]);

  // 告诉WebGL如何从位置缓冲区中提取位置到顶点着色器的aVertexPosition属性
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // 告诉WebGL如何从颜色缓冲区中提取颜色到顶点着色器的aVertexColor属性
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  {
    const offset = 0;
    const vertexCount = 6;
    gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
  }
}

// 主函数
function main() {
  const canvas = document.querySelector('#glCanvas');
  gl = canvas.getContext('webgl');

  if (!gl) {
    alert('无法初始化WebGL。您的浏览器或机器可能不支持它。');
    return;
  }

  // 设置画布大小
  canvas.width = 800;
  canvas.height = 600;
  gl.viewport(0, 0, canvas.width, canvas.height);

  // 初始化着色器程序
  const shaderProgram = initShaderProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
  );

  programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix',
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  buffers = initBuffers(gl);

  let rotation = 0.0;

  // 渲染循环
  function render() {
    rotation += 0.01;
    drawScene(gl, programInfo, buffers, rotation);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// 启动应用
main();
