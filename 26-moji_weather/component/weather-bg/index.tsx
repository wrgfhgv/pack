/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect } from 'react';
import anime from 'animejs';
import { judgeVersion } from '@Utils';
import { WEBGL } from 'three/examples/jsm/WebGL';
import config from './config';
import {
  handleCanvasTextureBackgroundColor,
  createCanvasTexture,
  createLensflare,
  createCloudPraticle,
  createStarParticle,
  runStarAnimation,
  runCloudAnimation,
  createSnowCloudPraticle,
  runSnowCloudAnimation,
  createSnowParticle,
  runSnowAnimation,
  createParticle,
  createRainCloudPraticle,
  runRainCloudAnimation,
  runRainAnimation,
  createSandParticle,
  runSandCloudAnimation,
  createSandCloudParticle,
  runSandAnimation,
  createFogCloudParticle,
  runFogAnimation,
  map,
} from './untils';

function WeatherBg({ children, threeKey, setCamera, compState }) {
  const bgHeightMap = {
    hasSvg: 220,
    hasAlert: 36.6,
    hasGps: 150,
  };
  // 什么都没有的基础高度
  const baseHeight = 204;

  const height =
    baseHeight +
    compState.map(item => bgHeightMap[item]).reduce((pre, next) => pre + next);

  const params = config[threeKey];

  let flashAniInterval;
  const formatConfig = () => {
    // const params = config[threeKey];
    const lensflareEnable = params['lensflare.enable'];
    const width =
      document.body.clientWidth ||
      window.innerWidth ||
      document.documentElement.clientWidth;

    return {
      // params,
      lensflareEnable,
      width: width > 600 ? 375 : width,
    };
  };

  // 添加具体动效
  // 不同的天气状况 需要的动效不同
  const addThreeDetail = ({
    Color,
    Scene,
    WebGLRenderer,
    CanvasTexture,
    PerspectiveCamera,
    AmbientLight,
    PointLight,
    FogExp2,
    DirectionalLight,
    TextureLoader,
    Group,
    PlaneBufferGeometry,
    MeshLambertMaterial,
    Mesh,
    Points,
    PointsMaterial,
    Float32BufferAttribute,
    BufferGeometry,
    ShaderMaterial,
    BufferAttribute,
    Lensflare,
    LensflareElement,
  }) => {
    const { lensflareEnable, width } = formatConfig();
    let camera;
    let scene;
    let ambient;
    let light;
    let group;
    let geometry;
    let renderer;
    let count;
    let directionalLight;
    let speed;
    let rainGeometry;
    let snowGeometry;
    let hailGeometry;
    // 场景渲染
    renderer = new WebGLRenderer({ alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);

    const sunAndCloud = [
      's01',
      's02',
      's03',
      's04',
      's05',
      's06',
      's07',
      's08',
    ];
    if (sunAndCloud.includes(threeKey)) {
      // create camera
      camera = new PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.z = 50;
      camera.position.y = -16;

      // create scene
      scene = new Scene();

      // 环境光
      ambient = new AmbientLight(0xffffff, 1);
      ambient.name = 'ambient';
      scene.add(ambient);

      // 点光源
      light = new PointLight(0xffffff, 1.5, 2000);
      light.position.set(28, 38, -20);
      light.name = 'lens flare light';
      scene.add(light);

      if (lensflareEnable) {
        createLensflare(
          { light, scene },
          { TextureLoader, Lensflare, LensflareElement },
        );
        const lensflare = scene.getObjectByName('lensflare');
        lensflare.position.x = params['lensflareLight.position'].x;
        lensflare.position.y = params['lensflareLight.position'].y;

        anime({
          targets: scene.getObjectByName('lensflare').position,
          x: [24, 28],
          easing: 'linear',
          direction: 'alternate',
          duration: 4000,
          delay: 1000 * 4,
          loop: true,
        });
      }

      if (params['star.opacity']) {
        const { starGeometry, starPoints } = createStarParticle(100, {
          BufferGeometry,
          Float32BufferAttribute,
          BufferAttribute,
          ShaderMaterial,
          Color,
          Points,
        });
        scene.add(starPoints);
        geometry = starGeometry;
      }

      const color = params['cloud.color'];
      const opacity = params['cloud.opacity'];
      const { group: cloudGroup } = createCloudPraticle(color, opacity, {
        TextureLoader,
        Group,
        PlaneBufferGeometry,
        MeshLambertMaterial,
        Mesh,
        Color,
      });
      group = cloudGroup;
      scene.add(group);
    }

    const snow = ['s09', 's10', 's11', 's12', 's13', 's14'];
    if (snow.includes(threeKey)) {
      scene = new Scene();
      camera = new PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.z = 70;
      camera.position.y = -16;

      ambient = new AmbientLight(0xffffff, 1);
      ambient.name = 'ambient';
      scene.add(ambient);

      light = new PointLight(0xffffff, 1.5, 2000);
      light.name = 'lens flare light';
      scene.add(light);

      scene.fog = new FogExp2(params['canvasBackground.bottom'], 0.0065);
      renderer.setClearColor(0xffffff, 0);

      const color = params['cloud.color'];
      const opacity = params['cloud.opacity'];
      const { group: snowCloudGroup } = createSnowCloudPraticle(
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
      );
      group = snowCloudGroup;
      scene.add(group);

      count = params['snow.count'];

      const { snowGeometry } = createSnowParticle(scene, count, {
        BufferGeometry,
        Float32BufferAttribute,
        TextureLoader,
        PointsMaterial,
        Points,
      });

      geometry = snowGeometry;
    }

    const rain = [
      's17',
      's18',
      's19',
      's20',
      's21',
      's22',
      's23',
      's24',
      's25',
      's26',
      's27',
      's28',
      's30',
      's31',
      's32',
      's33',
      's34',
      's35',
    ];
    if (rain.includes(threeKey)) {
      scene = new Scene();
      camera = new PerspectiveCamera(60, width / height, 1, 1000);
      camera.position.z = 70;
      camera.position.y = -16;

      ambient = new AmbientLight(0xffffff, 1);
      ambient.name = 'ambient';
      scene.add(ambient);

      directionalLight = new DirectionalLight(0xffeedd);
      directionalLight.color = new Color(params['directional.color']);
      directionalLight.intensity = params['directional.intensity'];
      directionalLight.position.set(0, 0, 1);
      scene.add(directionalLight);

      light = new PointLight(0x004d98, 1.5, 2000);
      light.name = 'lens flare light';
      light.color = new Color(params['pointlight.color']);
      light.intensity = params['pointlight.intensity'];
      light.distance = params['pointlight.distance'];
      light.decay = params['pointlight.decay'];
      light.position.set(0, -14, -70);

      if (params['rain.flash']) {
        const flashAni = anime({
          targets: light,
          decay: [8, 0, 2.8, 8],
          intensity: [0, 20, 80, 60, 20, 0],
          duration: 100,
          autoPlay: false,
          easing: 'easeInOutSine',  
          begin: () => {
            handleCanvasTextureBackgroundColor(
              scene,
              '#4c6592',
              params['canvasBackground.bottom'],
            );
          },
          complete: () => {
            handleCanvasTextureBackgroundColor(
              scene,
              params['canvasBackground.top'],
              params['canvasBackground.bottom'],
            );
          },
        });
        flashAniInterval = setInterval(() => {
          flashAni.loop = anime.random(2, 6);
          light.position.x = anime.random(-20, 20);
          light.position.y = anime.random(-40, 40);
          light.position.z = anime.random(-30, 30);
          flashAni.restart();
        }, 4000);
      }

      scene.add(light);

      scene.fog = new FogExp2(params['canvasBackground.bottom'], 0.0065);
      scene.fog.color = new Color(params['fog.color']);
      const color = params['cloud.color'];
      const opacity = params['cloud.opacity'];

      const { group: rainCloudGroup } = createRainCloudPraticle(
        color,
        opacity,
        {
          TextureLoader,
          Group,
          PlaneBufferGeometry,
          MeshLambertMaterial,
          Mesh,
        },
      );
      group = rainCloudGroup;
      scene.add(rainCloudGroup);

      const rainCount = params['rain.count'];
      const snowCount = params['snow.count'];
      const hailCount = params['hail.count'];

      const rainPng = require('./img/rain_new.png');
      const snowPng = require('./img/snow.png');
      const { particleGeometry: rainParticleGeometry } = createParticle(
        scene,
        rainCount,
        rainPng,
        3,
        0.4,
        {
          BufferGeometry,
          Float32BufferAttribute,
          TextureLoader,
          PointsMaterial,
          Points,
        },
      );
      const { particleGeometry: snowParticleGeometry } = createParticle(
        scene,
        snowCount,
        snowPng,
        1,
        1,
        {
          BufferGeometry,
          Float32BufferAttribute,
          TextureLoader,
          PointsMaterial,
          Points,
        },
      );
      const { particleGeometry: hailParticleGeometry } = createParticle(
        scene,
        hailCount,
        snowPng,
        1,
        1,
        {
          BufferGeometry,
          Float32BufferAttribute,
          TextureLoader,
          PointsMaterial,
          Points,
        },
      );
      rainGeometry = rainParticleGeometry;
      snowGeometry = snowParticleGeometry;
      hailGeometry = hailParticleGeometry;

      speed = params['rain.speed'];
    }

    const sandStorm = ['s15', 's16'];
    if (sandStorm.includes(threeKey)) {
      scene = new Scene();
      camera = new PerspectiveCamera(72, width / height, 1, 1000);
      camera.position.z = 50;
      camera.position.y = -16;

      ambient = new AmbientLight(0xffffff, 1);
      ambient.name = 'ambient';
      scene.add(ambient);

      scene.fog = new FogExp2(params['fog.color'], 0.025);
      const { group: sandCloudGroup } = createSandCloudParticle({
        TextureLoader,
        Group,
        PlaneBufferGeometry,
        MeshLambertMaterial,
        Mesh,
      });
      group = sandCloudGroup;
      scene.add(sandCloudGroup);

      const { sandGeometry, sandPoints } = createSandParticle(params, {
        BufferGeometry,
        Float32BufferAttribute,
        TextureLoader,
        PointsMaterial,
        Color,
        Points,
      });
      scene.add(sandPoints);
      geometry = sandGeometry;
    }

    const fog = ['s29', 's36'];
    if (fog.includes(threeKey)) {
      scene = new Scene();
      camera = new PerspectiveCamera(72, width / height, 1, 1000);
      camera.position.z = 50;
      camera.position.y = -16;

      ambient = new AmbientLight(0xffffff, 1);
      ambient.name = 'ambient';
      scene.add(ambient);

      scene.fog = new FogExp2(params['fog.color'], 0.025);

      const { group: fogGroup } = createFogCloudParticle({
        TextureLoader,
        Group,
        PlaneBufferGeometry,
        MeshLambertMaterial,
        Mesh,
      });

      group = fogGroup;
      scene.add(fogGroup);
    }

    // 使用 canvas 做画布
    const ctx = createCanvasTexture(
      width,
      height,
      params['canvasBackground.top'],
      params['canvasBackground.bottom'],
    );
    const canvasTexture = new CanvasTexture(ctx.canvas);
    canvasTexture.needsUpdate = true;
    scene.background = canvasTexture;

    ambient.color = new Color(params['ambient.color']);
    ambient.intensity = params['ambient.intensity'];

    return {
      renderer,
      scene,
      camera,
      group,
      geometry,
      speed,
      rainGeometry,
      snowGeometry,
      hailGeometry,
    };
  };

  const initThree = () => {
    const wrapper = document.getElementById('moji-bg') as any;
    const container = document.createElement('div');
    container.setAttribute('id', 'three');
    wrapper?.appendChild(container);
    if (process.env.TARGET === 'web') {
      Promise.all([
        import('three' /* webpackChunkName: "three" */),
        import(
          'three/examples/jsm/objects/Lensflare' /* webpackChunkName: "three" */
        ),
      ]).then(
        ([
          {
            Color,
            Scene,
            WebGLRenderer,
            CanvasTexture,
            PerspectiveCamera,
            AmbientLight,
            PointLight,
            FogExp2,
            DirectionalLight,
            TextureLoader,
            Group,
            PlaneBufferGeometry,
            MeshLambertMaterial,
            Mesh,
            Points,
            PointsMaterial,
            Float32BufferAttribute,
            BufferGeometry,
            ShaderMaterial,
            BufferAttribute,
          },
          { Lensflare, LensflareElement },
        ]) => {
          // 单场景 geometry
          // 多场景(雨雪) 不同 geometry
          // 问就是 历史包袱
          const {
            renderer,
            scene,
            camera,
            group,
            geometry,
            speed,
            rainGeometry,
            snowGeometry,
            hailGeometry,
          } = addThreeDetail({
            Color,
            Scene,
            WebGLRenderer,
            CanvasTexture,
            PerspectiveCamera,
            AmbientLight,
            PointLight,
            FogExp2,
            DirectionalLight,
            TextureLoader,
            Group,
            PlaneBufferGeometry,
            MeshLambertMaterial,
            Mesh,
            Points,
            PointsMaterial,
            Float32BufferAttribute,
            BufferGeometry,
            ShaderMaterial,
            BufferAttribute,
            Lensflare,
            LensflareElement,
          });

          container.appendChild(renderer.domElement);
          setCamera(camera);

          window.addEventListener('scroll', () => {
            const scrollTop = document?.documentElement?.scrollTop || 0;
            // 部分动效不需要 随用户屏幕一起向下滚动
            const cannotScroll = ['s15', 's16', 's29', 's36'];
            if (scrollTop <= 400 && !cannotScroll.includes(threeKey)) {
              camera.rotation.x = map(scrollTop * 0.7, 0, 400, 0, 0.5);
            }
          });
          const render = () => {
            const sunAndCloud = [
              's01',
              's02',
              's03',
              's04',
              's05',
              's06',
              's07',
              's08',
            ];
            if (sunAndCloud.includes(threeKey)) {
              runCloudAnimation(group);
              params['star.opacity'] && runStarAnimation(geometry);
            }

            const snow = ['s09', 's10', 's11', 's12', 's13', 's14'];
            if (snow.includes(threeKey)) {
              runSnowCloudAnimation(group);
              runSnowAnimation(geometry);
            }

            const rain = [
              's17',
              's18',
              's19',
              's20',
              's21',
              's22',
              's23',
              's24',
              's25',
              's26',
              's27',
              's28',
              's30',
              's31',
              's32',
              's33',
              's34',
              's35',
            ];
            if (rain.includes(threeKey)) {
              runRainAnimation(rainGeometry, speed);
              runSnowAnimation(snowGeometry);
              runRainAnimation(hailGeometry, speed);
              runRainCloudAnimation(group);
            }

            const sandStorm = ['s15', 's16'];
            if (sandStorm.includes(threeKey)) {
              runSandAnimation(geometry);
              runSandCloudAnimation(group);
            }

            const fog = ['s29'];
            if (fog.includes(threeKey)) {
              runFogAnimation(group);
            }
            renderer.render(scene, camera); // 执行渲染操作
            requestAnimationFrame(render);
          };
          render();
        },
      );
    }
  };

  useEffect(() => {
    const canUse = judgeVersion('os', { android: '8', ios: '10' });
    if (WEBGL.isWebGLAvailable() && canUse) {
      const wrapper = document.getElementById('three') as any;
      wrapper?.parentNode?.removeChild(wrapper);
      initThree();
    }

    return () => {
      clearInterval(flashAniInterval);
    };
  }, [threeKey, height]);

  return (
    <div className="-ml-16 -mr-16 -mt-20">
      {/* 把three动画作为背景 大字号时自动向下延伸 */}
      <div
        className="abs-top-left w-full h-full rounded-t-1 overflow-hidden"
        id="moji-bg"
        style={{
          backgroundImage: `linear-gradient(180deg, ${params['canvasBackground.top']} 0%, ${params['canvasBackground.bottom']} 100%)`,
          height: `${height}px`,
          position: 'relative',
        }}></div>
      <div
        className="z-10 relative"
        style={{
          marginTop: `-${height}px`,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {children}
      </div>
    </div>
  );
}

export { WeatherBg };
