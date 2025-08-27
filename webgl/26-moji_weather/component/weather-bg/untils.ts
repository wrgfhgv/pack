/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import anime from 'animejs';

// 随机生成 min 到 max 之间的整数
function random(min, max) {
  return Math.floor((max - min + 1) * Math.random()) + min;
}

// len:生成整数的数量   start:最小值   end:最大值
function getRandomArr(len, start, end) {
  const arr = [] as any;
  while (arr.length < len) {
    const num = random(start, end);
    if (arr.indexOf(num) === -1) {
      arr.push(num);
    }
  }
  return arr;
}

// 范围映射
const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

// 范围随机数
const randomRange = (min, max) => Math.random() * (max - min) + min;

// 背景 Canvas
const createCanvasTexture = (w, h, color1, color2) => {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  ctx.canvas.width = w / 2;
  ctx.canvas.height = h / 2;
  const g = ctx.createLinearGradient(0, 256, 0, 0);
  g.addColorStop(1, color1);
  g.addColorStop(0.26, color2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  return ctx;
};

// 阳光
const createLensflare = (
  { light, scene },
  { TextureLoader, Lensflare, LensflareElement },
) => {
  const textureLoader = new TextureLoader();
  // lensflare
  const tfl00 = textureLoader.load(require('./img/lens/lens0.png'));
  const tfl01 = textureLoader.load(require('./img/lens/lens1.png'));
  const tfl02 = textureLoader.load(require('./img/lens/lens2.png'));
  const tfl03 = textureLoader.load(require('./img/lens/lens3.png'));
  // const tfl04 = textureLoader.load('/img/lens/lens4.png')

  const lensflare = new Lensflare();
  // const ele00 = new LensflareElement(tfl00, 1000, 0)
  lensflare.addElement(new LensflareElement(tfl00, 1000, 0));

  lensflare.addElement(new LensflareElement(tfl01, 800, 0.1));
  lensflare.addElement(new LensflareElement(tfl01, 420, 0.26));
  lensflare.addElement(new LensflareElement(tfl01, 220, 0.6));

  lensflare.addElement(new LensflareElement(tfl03, 40, 0.2));

  lensflare.addElement(new LensflareElement(tfl02, 68, 0.32));
  lensflare.addElement(new LensflareElement(tfl02, 80, 0.36));
  lensflare.addElement(new LensflareElement(tfl02, 20, 0.36));

  lensflare.addElement(new LensflareElement(tfl02, 140, 0.5));

  lensflare.addElement(new LensflareElement(tfl03, 54, 0.55));

  lensflare.addElement(new LensflareElement(tfl02, 240, 0.68));
  lensflare.addElement(new LensflareElement(tfl02, 160, 0.7));

  lensflare.name = 'lensflare';
  lensflare.position.copy(light.position);
  // return lensflare;
  scene.add(lensflare);
};

// 云层 晴/多云
const createCloudPraticle = (
  color,
  opacity,
  {
    TextureLoader,
    Group,
    PlaneBufferGeometry,
    MeshLambertMaterial,
    Mesh,
    Color,
  },
) => {
  const cloudParticles = [] as any;
  const textureLoader = new TextureLoader();
  const group = new Group();
  // cloud
  textureLoader.load(require('./img/cloud.png'), texture => {
    const cloudGeo = new PlaneBufferGeometry(1384 / 10, 766 / 10);
    const cloudMaterial = new MeshLambertMaterial({
      map: texture,
      transparent: true,
      depthWrite: true,
    });
    group.type = 'Cloud Group';

    const result = getRandomArr(3, -100, -10);
    for (let p = 0; p < 3; p++) {
      const cloud = new Mesh(cloudGeo, cloudMaterial);
      cloud.name = 'cloud';
      cloud.position.set(anime.random(-70, 70), 40, result[p]);
      const scale = anime.random(0.6, 1);
      cloud.rotation.x = Math.PI / 3.5;
      cloud.scale.x = scale;
      cloud.scale.y = scale;
      cloud.material.opacity = opacity;
      cloud.material.color = new Color(color);
      group.add(cloud);
      cloudParticles.push(cloud);
    }
  });
  return { group };
};

// 云层 雪天
const createSnowCloudPraticle = (
  color,
  opacity,
  {
    TextureLoader,
    Group,
    PlaneBufferGeometry,
    MeshLambertMaterial,
    Mesh,
    Color,
  },
) => {
  const cloudParticles = [] as any;
  const textureLoader = new TextureLoader();
  const group = new Group();
  // cloud
  textureLoader.load(require('./img/smoke.png'), texture => {
    const size = anime.random(120, 150);
    const cloudGeo = new PlaneBufferGeometry(size, size);
    const cloudMaterial = new MeshLambertMaterial({
      map: texture,
      transparent: true,
    });
    group.type = 'Cloud Group';
    cloudMaterial.needsUpdate = true;

    const result = getRandomArr(6, -100, -10);
    for (let p = 0; p < 6; p++) {
      const cloud = new Mesh(cloudGeo, cloudMaterial);
      cloud.name = 'cloud';
      cloud.position.set(anime.random(-60, 60), 40, result[p]);
      cloud.rotation.x = Math.PI / 3.5;
      cloud.material.opacity = anime.random(0.3, 0.4);
      cloud.material.opacity = opacity;
      cloud.material.color = new Color(color);
      group.add(cloud);
      cloudParticles.push(cloud);
    }
  });
  return { group };
};

// 星空 晴/多云
const createStarParticle = (
  count,
  {
    BufferGeometry,
    Float32BufferAttribute,
    BufferAttribute,
    ShaderMaterial,
    Color,
    Points,
  },
) => {
  const vertex = `
    attribute float scale;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = scale * ( 300.0 / - mvPosition.z );;
      gl_Position = projectionMatrix * mvPosition;
    }`;

  const fragment = `
    uniform vec3 color;
    uniform float opacity;
    void main() {
      if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
      gl_FragColor = vec4( color,0.0 );
    }
    `;

  const starGeometry = new BufferGeometry();
  const starGeometryArr = [] as any;

  for (let i = 0; i < count; i++) {
    starGeometryArr.push(
      anime.random(-60, 60),
      anime.random(-30, 30),
      anime.random(0, -20),
    );
  }

  starGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(starGeometryArr, 3),
  );
  starGeometry.setAttribute(
    'scale',
    new BufferAttribute(new Float32Array(2500), 1),
  );

  const material = new ShaderMaterial({
    uniforms: {
      color: { value: new Color(0xffffff) },
      opacity: { value: 1.0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  material.uniformsNeedUpdate = true;

  const starPoints = new Points(starGeometry, material);

  return { starGeometry, starPoints };
};

const createRainCloudPraticle = (
  color,
  opacity,
  { TextureLoader, Group, PlaneBufferGeometry, MeshLambertMaterial, Mesh },
) => {
  const cloudParticles = [] as any;
  const textureLoader = new TextureLoader();
  const group = new Group();
  // cloud
  textureLoader.load(require('./img/smoke.png'), texture => {
    // const size = anime.random(48, 50)
    const cloudGeo = new PlaneBufferGeometry(60, 60);
    const cloudMaterial = new MeshLambertMaterial({
      map: texture,
      transparent: true,
    });
    group.type = 'Cloud Group';

    for (let p = 0; p < 50; p++) {
      const cloud = new Mesh(cloudGeo, cloudMaterial);
      cloud.name = 'cloud';
      cloud.position.set(
        Math.random() * 200 - 100,
        30,
        Math.random() * 200 - 160,
      );
      cloud.rotation.x = Math.PI / 3.5;
      cloud.material.opacity = opacity;
      group.add(cloud);
      cloudParticles.push(cloud);
    }
  });
  return { group };
};

const createSandParticle = (
  params,
  {
    BufferGeometry,
    Float32BufferAttribute,
    TextureLoader,
    PointsMaterial,
    Color,
    Points,
  },
) => {
  const sandGeometry = new BufferGeometry();
  const sandGeometryArr = [] as any;
  const sandGeometryVelocitiesArr = [] as any;
  const count = params['sand.count'];
  const color = params['sand.color'];
  const opacity = params['sand.opacity'];
  for (let i = 0; i < count; i++) {
    sandGeometryArr.push(
      anime.random(-500, 500),
      anime.random(-20, 20),
      anime.random(-80, 40),
    );
  }

  for (let v = 0; v < count; v++) {
    sandGeometryVelocitiesArr.push(
      Math.floor(Math.random() * 6 - 3) * 0.1,
      Math.floor(Math.random() * 10 + 3) * -0.05,
      Math.floor(Math.random() * 6 - 3) * 0.1,
    );
  }

  sandGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(sandGeometryArr, 3),
  );
  sandGeometry.setAttribute(
    'velocity',
    new Float32BufferAttribute(sandGeometryVelocitiesArr, 3),
  );

  const sandTexture = new TextureLoader().load(require('./img/snow.png'));
  const sandMaterial = new PointsMaterial({
    color: new Color(color),
    size: anime.random(3, 3.4),
    opacity,
    sizeAttenuation: false,
    map: sandTexture,
    transparent: true,
  });
  const sandPoints = new Points(sandGeometry, sandMaterial);
  return { sandGeometry, sandPoints };
};

const createSandCloudParticle = ({
  TextureLoader,
  Group,
  PlaneBufferGeometry,
  MeshLambertMaterial,
  Mesh,
}) => {
  const textureLoader = new TextureLoader();
  const cloudParticles = [] as any;
  const group = new Group();
  textureLoader.load(require('./img/smoke.png'), texture => {
    const cloudGeo = new PlaneBufferGeometry(100, 100);
    const cloudMaterial = new MeshLambertMaterial({
      map: texture,
      transparent: true,
      depthWrite: true,
    });
    cloudMaterial.needsUpdate = true;
    group.type = 'Cloud Group';

    const result = getRandomArr(20, -40, 20);
    for (let p = 0; p < 20; p++) {
      const cloud = new Mesh(cloudGeo, cloudMaterial);
      cloud.name = 'cloud';
      cloud.position.set(
        anime.random(-80, 80),
        anime.random(-20, 20),
        result[p],
        // -200
      );
      cloud.rotation.z = Math.PI;
      cloud.material.opacity = 0.3;
      group.add(cloud);
      cloudParticles.push(cloud);
    }
  });

  return { group };
};

const createSnowParticle = (
  scene,
  count,
  {
    BufferGeometry,
    Float32BufferAttribute,
    TextureLoader,
    PointsMaterial,
    Points,
  },
) => {
  const snowGeometry = new BufferGeometry();
  const snowGeometryArr = [] as any;
  const snowGeometryVelocitiesArr = [] as any;

  for (let i = 0; i < count; i++) {
    snowGeometryArr.push(
      Math.floor(Math.random() * 100 - 50),
      Math.floor(Math.random() * 100 - 50),
      Math.floor(Math.random() * 100 - 50),
    );
  }

  for (let v = 0; v < count; v++) {
    snowGeometryVelocitiesArr.push(
      Math.floor(Math.random() * 6 - 3) * 0.1,
      Math.floor(Math.random() * 10 + 3) * -0.05,
      Math.floor(Math.random() * 6 - 3) * 0.1,
    );
  }

  snowGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(snowGeometryArr, 3),
  );
  snowGeometry.setAttribute(
    'velocity',
    new Float32BufferAttribute(snowGeometryVelocitiesArr, 3),
  );

  const snowTexture = new TextureLoader().load(require('./img/snow.png'));
  const snowMaterial = new PointsMaterial({
    color: 0xffffff,
    size: 1,
    opacity: 1,
    depthTest: true,
    map: snowTexture,
    transparent: true,
  });
  const snowPoints = new Points(snowGeometry, snowMaterial);
  scene.add(snowPoints);
  return { snowGeometry };
};

const createParticle = (
  scene,
  count,
  source,
  size,
  materialOpacity,
  {
    BufferGeometry,
    Float32BufferAttribute,
    TextureLoader,
    PointsMaterial,
    Points,
  },
) => {
  const particleGeometry = new BufferGeometry();
  const particleGeometryArr = [] as any;
  const particleGeometryVelocitiesArr = [] as any;

  for (let i = 0; i < count; i++) {
    particleGeometryArr.push(
      Math.floor(Math.random() * 100 - 50),
      Math.floor(Math.random() * 100 - 50),
      Math.floor(Math.random() * 100 - 50),
    );
  }

  for (let v = 0; v < count; v++) {
    particleGeometryVelocitiesArr.push(
      Math.floor(Math.random() * 6 - 3) * 0.1,
      Math.floor(Math.random() * 10 + 3) * -0.05,
      Math.floor(Math.random() * 6 - 3) * 0.1,
    );
  }

  particleGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(particleGeometryArr, 3),
  );
  particleGeometry.setAttribute(
    'velocity',
    new Float32BufferAttribute(particleGeometryVelocitiesArr, 3),
  );

  const particleTexture = new TextureLoader().load(source);
  const particleMaterial = new PointsMaterial({
    color: 0xffffff,
    size,
    opacity: materialOpacity,
    map: particleTexture,
    depthTest: false,
    transparent: true,
  });
  const particlePoints = new Points(particleGeometry, particleMaterial);
  scene.add(particlePoints);
  return { particleGeometry };
};

const createFogCloudParticle = ({
  TextureLoader,
  Group,
  PlaneBufferGeometry,
  MeshLambertMaterial,
  Mesh,
}) => {
  const textureLoader = new TextureLoader();
  const cloudParticles = [] as any;
  const group = new Group();
  textureLoader.load(require('./img/smoke.png'), texture => {
    const cloudGeo = new PlaneBufferGeometry(100, 100);
    const cloudMaterial = new MeshLambertMaterial({
      map: texture,
      transparent: true,
      depthWrite: true,
    });
    cloudMaterial.needsUpdate = true;
    cloudMaterial.uniformsNeedUpdate = true;
    group.type = 'Cloud Group';
    const result = getRandomArr(20, -100, 40);
    for (let p = 0; p < 20; p++) {
      const cloud = new Mesh(cloudGeo, cloudMaterial);
      cloud.name = 'cloud';
      cloud.position.set(
        anime.random(-80, 80),
        anime.random(-20, 20),
        result[p],
        // -200
      );
      cloud.rotation.z = Math.PI;
      cloud.material.opacity = 0.3;
      group.add(cloud);
      cloudParticles.push(cloud);
    }
  });

  return { group };
};

// sand animation
const runSandAnimation = SandGeometry => {
  const posArr = SandGeometry.getAttribute('position').array;
  const velArr = SandGeometry.getAttribute('velocity').array;

  for (let a = 0; a < posArr.length; a += 3) {
    const x = a;
    const y = a + 1;
    posArr[x] -= velArr[y] * 2;
    posArr[y] += Math.sin(a) * 0.14;
    if (posArr[x] > 50) {
      posArr[x] = -50;
      posArr[y] = anime.random(-20, 20);
    }
  }
  SandGeometry.attributes.position.needsUpdate = true;
  SandGeometry.attributes.velocity.needsUpdate = true;
};

const runStarAnimation = starGeometry => {
  const scaleArr = starGeometry.attributes.scale.array;

  for (let a = 0; a < 50; a += anime.random(1, 4)) {
    scaleArr[a] += anime.random(0.01, 0.06);
    if (scaleArr[a] >= 1) {
      scaleArr[a] = 0;
    }
  }
  starGeometry.attributes.scale.needsUpdate = true;
};

const runSandCloudAnimation = group => {
  for (let i = 0; i < group.children.length; i++) {
    group.children[i].rotation.z += i * 0.0002;
    group.children[i].position.x += i * 0.02;
    if (group.children[i].position.x > 100) {
      group.children[i].position.x = -100;
    }
  }
};

const runCloudAnimation = group => {
  for (let i = 0; i < group.children.length; i++) {
    group.children[i].rotation.z += i * 0.0001;
    group.children[i].position.x += i * 0.007;
    if (group.children[i].position.x > 120) {
      group.children[i].position.x = -120;
    }
  }
};

const runSnowCloudAnimation = group => {
  for (let i = 0; i < group.children.length; i++) {
    group.children[i].rotation.z += i * 0.0002;
    group.children[i].position.x += i * 0.02;
    if (group.children[i].position.x > 100) {
      group.children[i].position.x = -100;
    }
  }
};

const runSnowAnimation = snowGeometry => {
  if (snowGeometry) {
    const posArr = snowGeometry.getAttribute('position').array;
    const velArr = snowGeometry.getAttribute('velocity').array;

    for (let a = 0; a < posArr.length; a += 3) {
      const x = a;
      const y = a + 1;
      posArr[y] += velArr[y] * 0.2;
      posArr[x] -= Math.sin(a) * 0.04;
      if (posArr[y] < -50) {
        posArr[y] = 50;
      }
      if (posArr[x] > 50 || posArr[x] < -50) {
        posArr[x] = anime.random(-60, 60);
      }
    }
    snowGeometry.attributes.position.needsUpdate = true;
    snowGeometry.attributes.velocity.needsUpdate = true;
  }
};

const runRainCloudAnimation = group => {
  for (let i = 0; i < group.children.length; i++) {
    group.children[i].rotation.z += i * 0.00001;
    group.children[i].position.x += i * 0.0003;
    if (group.children[i].position.x > 100) {
      group.children[i].position.x = -100;
    }
  }
};

const runRainAnimation = (rainGeometry, speed) => {
  if (rainGeometry) {
    const posArr = rainGeometry.getAttribute('position').array;
    for (let a = 0; a < posArr.length; a += 3) {
      const y = a + 1;
      if (posArr[y] < -40) {
        posArr[y] = 50;
      } else {
        posArr[y] -= speed + Math.random() * (speed - 0.1);
      }
    }
    rainGeometry.attributes.position.needsUpdate = true;
  }
};

const runFogAnimation = group => {
  for (let i = 0; i < group.children.length; i++) {
    group.children[i].rotation.z += i * 0.0002;
    group.children[i].position.x += i * 0.006;
    if (group.children[i].position.x > 100) {
      group.children[i].position.x = -100;
    }
  }
};

const handleCanvasTextureBackgroundColor = (scene, color1, color2) => {
  const ctx = scene.background.image.getContext('2d');
  scene.background.needsUpdate = true;
  const g = ctx.createLinearGradient(0, 256, 0, 0);
  g.addColorStop(1, color1);
  g.addColorStop(0.26, color2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export {
  handleCanvasTextureBackgroundColor,
  createCanvasTexture,
  createLensflare,
  createCloudPraticle,
  createStarParticle,
  createSnowCloudPraticle,
  createRainCloudPraticle,
  createSnowParticle,
  createParticle,
  createSandParticle,
  createFogCloudParticle,
  runFogAnimation,
  runSnowAnimation,
  runSnowCloudAnimation,
  runStarAnimation,
  runCloudAnimation,
  runRainCloudAnimation,
  runRainAnimation,
  runSandCloudAnimation,
  runSandAnimation,
  createSandCloudParticle,
  map,
  randomRange,
};
