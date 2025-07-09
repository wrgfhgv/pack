declare global {
  interface Window {
    bodymovin: any;
    require: any;
  }
}

const lottie = (callBack, failCallback) => {
  // 这里报错会导致卡片直接消失，catch住。
  try {
    const { body } = document;
    const script = document.createElement('script');
    script.onload = () => {
      if (window.bodymovin) {
        callBack(window.bodymovin);
      } else if (window.require) {
        window.require(['bodymovin'], lottie => {
          callBack(lottie);
        });
      }
    };
    if (typeof failCallback === 'function') {
      script.onerror = failCallback;
    }
    body.appendChild(script);
    script.src =
      'https://sf1-cdn-tos.toutiaostatic.com/obj/card-system/common/lottie_v5.6.4.js';
    script.style.visibility = 'hidden';
    // define 通过 data-module-id 属性来设定模块的id
    script.setAttribute('data-module-id', 'bodymovin');
  } catch (e) {
    //
  }
};

export function getLottie() {
  return new Promise((resolve, reject) => {
    lottie(resolve, reject);
  });
}

export default lottie;
