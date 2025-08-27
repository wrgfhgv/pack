import * as THREE from 'three';
import cloudPic from '../assets/cloud.png'; // 确保图片路径正确，且Webpack配置了图片loader
import * as TWEEN from '@tweenjs/tween.js';

const { 
  Scene, 
  Color,
  PerspectiveCamera, 
  WebGLRenderer, 
  TextureLoader, 
  Mesh, 
  PlaneGeometry, 
  MeshLambertMaterial, // 注意材质名称是否正确（如MeshStandardMaterial等）
  PointLight, 
  BufferGeometry,
  ShaderMaterial,
  AmbientLight,
  Group,
  LineBasicMaterial,
  PointsMaterial,
  Line,
  BufferAttribute,
  Float32BufferAttribute,
  Points
} = THREE;

import { utils } from 'animejs';
import { vec3 } from 'gl-matrix';

// 创建场景、相机、渲染器
const scene = new Scene();
scene.background = new Color('#0959B3');

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 30, 50); // 相机位置
scene.add(camera);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 灯光设置
const ambientLight = new AmbientLight(0xffffff, 1); // 环境光
scene.add(ambientLight);

const pointLight = new PointLight(0xffffff, 1, 1000); 
pointLight.position.set(50, 50, 50); // 避免与相机位置重叠，调整光源位置
scene.add(pointLight);

let cloudArray: THREE.Mesh[] = []; // 声明云对象

for(let i = 0; i < 3; i++) {
  // 纹理加载（异步操作）
  const textureLoader = new TextureLoader();
  textureLoader.load(cloudPic, (texture) => {
    // 错误1：材质变量名拼写错误（meterial → material）
    const material = new MeshLambertMaterial ({ 
      map: texture, 
      transparent: true, // 开启透明
      depthWrite: false, // 透明物体通常需要关闭深度写入
    });

    const geometry = new PlaneGeometry(1384 / 50, 766 / 50); // 平面几何体

    const cloud = new Mesh(geometry, material);
     // 随机缩放和位置
     cloud.scale.set(
      utils.random(0.8, 1.2),
      utils.random(0.8, 1.2),
      1
    );
    cloud.position.set(
      utils.random(-50, 50), // 初始X位置分布更广
      utils.random(10, 40),
      utils.random(2, 50)
    );
    // scene.add(cloud); // 添加到场景
    cloudArray.push(cloud);
  });
}

const vertexShader = `
      attribute float aScale;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aScale * ( 20.0 / position.z);
      }
    `

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uOpacity;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5, 0.5));
      if(dist > 0.45) discard;
      float alpha = smoothstep(0.5, 0.45, dist);
      gl_FragColor = vec4(uColor, uOpacity * alpha);
    }
  `
  let stars: THREE.Points;

  const positionArr = new Float32Array(100 * 3);
  const scaleArr = new Float32Array(100);

  for(let i = 0; i < 100; i++) {
    positionArr[i * 3] = utils.random(-10, 10);
    positionArr[i * 3 + 1] = utils.random(10, 40);
    positionArr[i * 3 + 2] = utils.random(10, 50);
    scaleArr[i] = utils.random(0.8, 1.2);
  }
  const starMaterial = new ShaderMaterial({
    uniforms: {
      uColor: {value: new Color(0xffffff)},
      uOpacity: {value: utils.random(0.5, 1)},
    },
    vertexShader,
    fragmentShader
  })

  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute('position', new Float32BufferAttribute(positionArr, 3));
  starGeometry.setAttribute(
    'aScale',
    new BufferAttribute(new Float32Array(scaleArr), 1),
  );
  stars = new Points(starGeometry, starMaterial);
  scene.add(stars);


  function lightning() {
    const lightningCount = 5;
    const lightningColors = [0xffffff, 0xadd8e6, 0xb0e0e6];
    const lightningMeshes: THREE.Line[] = [];
    for(let i = 0; i < lightningCount; i++) {
      const lightning = createCustomLightning();
      lightning.position.set(
        -15 + Math.random() * 30,
        30,
        -30 + Math.random() * 60
      );
      const color = new Color(lightningColors[Math.floor(Math.random() * lightningColors.length)]);
      lightning.material.color = color;
      scene.add(lightning);
      lightningMeshes.push(lightning);
    }

    function createCustomLightning() {
      const geometry = new BufferGeometry();
      const part = 15;
      const width = 10 + Math.random() * 10;
      const positions = new Float32Array(part * 3);
      const colors = new Float32Array(part * 3);
      const startPoint = vec3.create();
      const endPoint = vec3.create();
      vec3.set(startPoint, 0, 30, 0);
      vec3.set(endPoint, 0, -30, 0);

      for(let i = 0; i < part; i++) {
        const t = i / part;
        const point = vec3.create();
        vec3.lerp(point, startPoint, endPoint, t);
        if(i > 0 && i < part) {
          const offset = width * (1 - t) * (Math.random() - 0.5);
          point[0] += offset;
          point[2] += offset * 0.5;
        }
        positions[i * 3] = point[0];
        positions[i * 3 + 1] = point[1];
        positions[i * 3 + 2] = point[2];
        const alpha = 1 - t * 0.5;
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
      

      const lineMaterial = new LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          linewidth: 2
      })
      const line = new Line(geometry, lineMaterial);
      return line;
    }
  }

  lightning();

function animate() {
  requestAnimationFrame(animate); // 递归渲染
  TWEEN.update();
  // 错误2：transparent是布尔值，无x属性（应为rotation或position）
  cloudArray.forEach(cloud => {
    if(cloud) {
      cloud.position.x += 0.01;
    }
  });
  const scaleArr = stars.geometry.attributes.aScale.array;

  for(let i = 0; i < 100; i += utils.random(1, 4)) {
    if(scaleArr[i] > 1.2) {
      scaleArr[i] = 0;
    }
    scaleArr[i] += 0.01;
    stars.geometry.attributes.aScale.needsUpdate = true;
  }

  renderer.render(scene, camera); // 渲染场景
}

animate(); // 启动动画