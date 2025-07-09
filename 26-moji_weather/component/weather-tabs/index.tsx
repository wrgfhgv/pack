import React from 'react';
import { Tabs, View } from '@lego/lego_core';
import anime from 'animejs';
import classNames from 'classnames';
import { WeatherSvg } from '../weather-svg';
// import './index.less';
import styles from '../../index.module.less';

function WeatherTabs({ svgInfo, topColors, bottomColors, camera, isSummer }) {
  const tabsMap = [
    { name: '天气', info: 'temp' },
    { name: '降水量', info: 'precipitationRate' },
    { name: '风力', info: 'windlevel' },
    isSummer
      ? { name: '紫外线', info: 'uvi' }
      : { name: '湿度', info: 'humidity' },
  ];

  // 户用点击 tab 切换镜头位置
  const tabCameraScroll = i => {
    camera &&
      anime({
        targets: camera.position,
        x: [camera.position.x, i * 12],
        autoPlay: false,
        easing: 'spring(1, 60, 16, 1)',
      });
  };

  return (
    <View>
      <Tabs
        theme="land"
        onIndexChange={i => tabCameraScroll(i)}
        defaultActiveIndex={0}
        key={JSON.stringify(tabsMap)}>
        <Tabs.Bar
          className={classNames(styles.hackTab, styles.hackTab2)}
          inverse={true}
          style={{
            background: `linear-gradient(180deg, ${topColors} 0%, ${bottomColors} 100%)`,
          }}>
          {tabsMap.map(({ name, info }, i) => (
            <Tabs.Tab key={i} data-log-click={JSON.stringify({ pos: info })}>
              {name}
            </Tabs.Tab>
          ))}
        </Tabs.Bar>
        <Tabs.Content>
          {tabsMap.map(({ info }, i) => (
            <Tabs.Panel key={i}>
              <WeatherSvg svgInfo={svgInfo} info={info} index={i} />
            </Tabs.Panel>
          ))}
        </Tabs.Content>
      </Tabs>
    </View>
  );
}

export { WeatherTabs };
