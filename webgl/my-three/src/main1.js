import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({color: 0xffff00, roughness: 1, metalness: 0})
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

const gradientMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec3 topColor = vec3(0.1, 0.1, 0.5);
        vec3 bottomColor = vec3(1.0, 1.0, 1.0);

        float gradient = (vWorldPosition.y + 100.0) / 200.0;
        vec3 finalColor = mix(bottomColor, topColor, clamp(gradient, 0.0, 1.0));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.BackSide
  });

// 创建一个包围整个场景的球体作为背景
const skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const skyMesh = new THREE.Mesh(skyGeometry, gradientMaterial);
scene.add(skyMesh);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 200, 0);
scene.add(light);
light.castShadow = true;
light.shadow.mapSize.set(512 * 4, 512 * 4);
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
