/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-dynamic-require */
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Text, Flex, Image, View, Popup, Collapse } from '@lego/lego_core';
import classNames from 'classnames';
import { on, off } from '@lego/utils';
import { ArrowFilled } from '@lego/lego_icons';
import { weatherContext } from '../..';
import styles from './index.module.less';
import street from './img/street.png';

const rainLevelMap = [0.66, 0.33, 0.063];

function WeatherAlert({ alert, color, popupContent, gps }) {
  const iconMap = {
    橙色: 'orange',
    蓝色: 'blue',
    红色: 'red',
    黄色: 'yellow',
    白色: 'white',
  };

  const wrapper = useRef(null);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState() as any;
  const [animation, setAnimation] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const innerClass = classNames({ [styles.animation]: animation });

  useEffect(() => {
    clearInterval(timer);

    if (alert && alert.length > 1) {
      setTimer(
        setInterval(() => {
          setIndex(index => index + 1);
        }, 3000),
      );
    }
  }, [alert?.length]);

  useEffect(() => {
    const transitionEnd = () => {
      setAnimation(false);
      // 跟新数组
      alert.push(alert.shift());
      setIndex(0);

      setTimeout(() => {
        // 强制页面重新渲染
        setAnimation(true);
      }, 0);
    };
    on(wrapper?.current, 'transitionend', transitionEnd);
    return () => {
      off(wrapper?.current, 'transitionend', transitionEnd);
    };
  }, [alert?.length]);

  const { suffix } = alert?.[index] || {};
  const { fontSize, fontSizeRatio } = useContext(weatherContext) as any;
  const weatherAlertClass = classNames(
    {
      [styles.minWidth]: fontSize !== 'xl' && fontSize !== 'l',
      [styles.minWidthXL]: fontSize === 'xl' || fontSize === 'l',
    },
    'flex-shrink-0',
  );

  const realHeight = 22 * fontSizeRatio + 8;

  function PopupComp() {
    return (
      <Popup
        visible={showPopup}
        title={`${
          popupContent.length > 1 ? `${popupContent.length}条` : ''
        }气象预警`}
        closable={true}
        onClose={() => setShowPopup(false)}>
        <Popup.Body className="pt-16">
          {popupContent.map((item, idx) => {
            const { level, text, content, href } = item;
            return (
              <View
                key={idx}
                className={`p-12 rounded-3 ${
                  idx !== popupContent?.length - 1 ? 'mb-12' : undefined
                } ${
                  level === '白色' ? 'bg-lighter' : `bg-${iconMap[level]}-00`
                }`}>
                <Flex align="center" className="mb-8" href={href}>
                  <Image
                    className="mr-8"
                    src={require(`./img/alert-${iconMap[level]}.png`)}
                    width="20"
                    height="20"
                    bordered={false}
                    transparent={true}
                    hasBg={false}
                  />

                  <Text
                    size="h3"
                    weight="medium"
                    color={
                      level === '白色' ? 'default' : `${iconMap[level]}-500`
                    }>
                    {text.split(',')[0]}
                  </Text>
                </Flex>
                {popupContent.length >= 3 ? (
                  <Collapse
                    type="height"
                    split={88 * fontSizeRatio}
                    initialFold={true}>
                    <Text size="t2" href={href}>
                      {content}
                    </Text>
                  </Collapse>
                ) : (
                  <Text size="t2" href={href}>
                    {content}
                  </Text>
                )}
              </View>
            );
          })}
        </Popup.Body>
      </Popup>
    );
  }

  return (
    <View className="mb-16">
      {Boolean(alert?.length) && (
        <View>
          <View
            onClick={() => setShowPopup(true)}
            style={{ background: color }}
            data-tt-darkmode-disable={true}
            data-log-click={JSON.stringify({ pos: 'warning_info' })}
            className="overflow-hidden rounded-3 mx-16 px-12">
            <Flex
              align="center"
              justify="between"
              style={{ height: realHeight }}
              className="overflow-hidden">
              <div
                className={`${innerClass} self-start`}
                ref={wrapper}
                style={{ transform: `translateY(-${realHeight * index}px)` }}>
                {alert.map(({ text, level }, idx) => (
                  <Flex align="center" key={idx} style={{ height: realHeight }}>
                    <Image
                      className="mr-8"
                      src={require(`./img/alert-${iconMap[level]}.png`)}
                      width="16"
                      height="16"
                      bordered={false}
                      transparent={true}
                      hasBg={false}
                    />
                    <Text
                      color="white-darker"
                      wordLines={1}
                      suffix={
                        alert.length > 1 && (
                          <ArrowFilled
                            size="s"
                            color="white-darker"
                            className="-ml-4"
                          />
                        )
                      }>
                      {text}
                    </Text>
                  </Flex>
                ))}
              </div>

              {alert.length > 1 ? (
                <Text
                  color="white-default"
                  display="block"
                  className={weatherAlertClass}>
                  {suffix}
                </Text>
              ) : (
                <ArrowFilled size="s" color="white-darker" />
              )}
            </Flex>
          </View>
          {useMemo(PopupComp, [popupContent, showPopup])}
        </View>
      )}
      {Boolean(gps) && (
        <>
          {useMemo(
            () => ShortTimeAlert({ color, gps }),
            [popupContent, showPopup],
          )}
        </>
      )}
    </View>
  );
}

const paintPath = points => {
  let pathD = `M ${points[0].x} ,${points[0].y}`;
  const { length } = points;
  const setC = (x1, y1, x2, y2, x, y) =>
    ` C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
  points.forEach((_, i) => {
    if (i > 0 && i <= length - 1) {
      const tempX = (points[i - 1].x + points[i].x) / 2;
      pathD += setC(
        tempX,
        points[i - 1].y,
        tempX,
        points[i].y,
        points[i].x,
        points[i].y,
      );
    }
  });

  return (
    <g>
      <path d={pathD} stroke="rgba(255,255,255,0.6)" fill="rgba(0,0,0,0)" />
    </g>
  );
};

const paintXAxis = (pointsArr, svgHeight) => {
  const { fontSizeRatio } = useContext(weatherContext) as any;
  return (
    <g>
      {pointsArr.map(({ xAxis, x }, idx) => {
        const moveMap = {
          2: 0,
          4: 34,
        };

        const moveLength = xAxis === '2小时后' ? '42' : moveMap[xAxis?.length];
        return (
          <text
            key={idx}
            fontSize={12 / fontSizeRatio}
            x={x - moveLength}
            y={svgHeight - 5}
            fill="rgba(255, 255, 255, 0.75)">
            {xAxis}
          </text>
        );
      })}
    </g>
  );
};

const paintYAxis = (svgWidth, svgHeight, rainLevel) => {
  const { fontSizeRatio } = useContext(weatherContext) as any;

  return (
    <g>
      {['', '小雨', '中雨', '大雨']
        .slice(0, 4 - rainLevel)
        .map((item, index) => {
          const lineSvgHeight = svgHeight - 30;
          const pathD = `M 32, ${
            lineSvgHeight - (lineSvgHeight / (3 - rainLevel)) * index + 6
          } L ${svgWidth}, ${
            lineSvgHeight - (lineSvgHeight / (3 - rainLevel)) * index + 6
          } `;
          return (
            <g key={index}>
              <path d={pathD} stroke="rgba(255, 255, 255, 0.14)" />
              <text
                key={index}
                fontSize={12 / fontSizeRatio}
                x={0}
                y={
                  lineSvgHeight -
                  (lineSvgHeight / (3 - rainLevel)) * index +
                  3 +
                  7
                }
                fill="rgba(255, 255, 255, 0.75)">
                {item}
              </text>
            </g>
          );
        })}
    </g>
  );
};

function formatShortTimeSvg(percent, svgWidth, svgHeight) {
  const lineSvgHeight = svgHeight - 30;

  const renderList = [] as any;
  for (let i = 0; i < 13; i++) {
    if (i === 0) {
      renderList.push({
        ...percent[0],
        x: 32,

        xAxis: '现在',
      });
    } else {
      renderList.push({
        ...percent[i * 10 - 1],
        x: 32 + ((i * 10 - 1) * (svgWidth - 32)) / 120,
        xAxis: i === 6 ? '1小时后' : i === 12 ? '2小时后' : undefined,
      });
    }
  }
  // 当max小于小雨阈值时只展示小雨一档 需将纵轴拉长 放大比例为0.33：1
  // 当max小于中雨阈值时只展示小雨中雨两档 需将纵轴拉长 放大比例为0.66：1
  // 当max小于大雨阈值时展示小雨中雨大雨三档 纵轴无需变化

  const max = Math.max(...renderList.map(item => item.rain_intensity));
  const min = Math.min(...renderList.map(item => item.rain_intensity));
  const rainLevel = rainLevelMap.findIndex(item => max > item);

  return {
    renderList: renderList.map(item => ({
      ...item,
      y:
        lineSvgHeight -
        (item.rain_intensity * lineSvgHeight) /
          [1, ...rainLevelMap][rainLevel] +
        6,
    })),
    max,
    min,
    rainLevel: rainLevel > 1 ? 1 : rainLevel,
  };
}

function ShortTimeAlert({ color, gps }) {
  const {
    width: baseWidth,
    toLocalWeb,
    fontSizeRatio,
  } = useContext(weatherContext) as any;

  const svgWidth = baseWidth - 32 - 8 - 124;
  const svgHeight = 88;
  const { nowcast, short_url } = gps;
  const { percent, long_desc } = nowcast;
  const { renderList, rainLevel } = formatShortTimeSvg(
    percent,
    svgWidth,
    svgHeight,
  );

  return (
    <View
      style={{ background: color }}
      className="p-8 rounded-3 box-border mx-16 mt-4">
      <Flex align="center" justify="between">
        <svg width={svgWidth} height={svgHeight}>
          {paintPath(renderList)}
          {paintXAxis(renderList, svgHeight)}
          {paintYAxis(svgWidth, svgHeight, rainLevel)}
        </svg>
        <View
          href={toLocalWeb(short_url)}
          className="text-center ml-16"
          data-log-click={JSON.stringify({ pos: 'cloud_pictures' })}>
          <Image
            adjustBigFont={false}
            bordered={false}
            radius="none"
            src={street}
            height={66}
            width={100}
            className="overflow-hidden rounded-4"
            style={{
              boxShadow: `inset 0px 0px 16px 12px ${[
                ...color.split(',').slice(0, -1),
                '0.3)',
              ].join(',')}`,
            }}
          />
          <Text
            size="t3"
            color="white-default"
            style={{
              fontSize: 12 / fontSizeRatio,
              lineHeight: `${18 / fontSizeRatio}px`,
            }}
            className="mt-4">
            查看实时气象
          </Text>
        </View>
      </Flex>
      <Text size="t3" color="white-default" className="mt-12" wordLines={1}>
        {long_desc}
      </Text>
    </View>
  );
}

export { WeatherAlert };
