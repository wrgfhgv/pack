/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-dynamic-require */
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Flex,
  Text,
  Button,
  Scroller,
  Image,
  Container,
} from '@lego/lego_core';

import { ArrowFilled, ArrowDownFilled, ArrowUpFilled } from '@lego/lego_icons';
import classNames from 'classnames';
import { Switch } from '..';

import { useSingleton } from '../../hooks/useSingleton';
import { ExpandInfoArrow } from './assets';
import { format, getPoint } from './format';

// 由于不明原因 svg text的fontsize大小比实际的要大两号 即svg的fontsize=14对应dom属性的fontsize=16

function WeatherInfo({
  arr,
  url,
  diff = 0,
  isFutureWeather = false,
  weatherContext,
  history_ts = '',
}) {
  const [isListShow, setIsListShow] = useState(false);
  const [switchIndex, setSwitchIndex] = useState(0);

  const { width, fontSize, fontSizeRatio, isDarkMode, isIOS, curTs } = useContext(
    weatherContext,
  ) as any;

  const { infos, tempDays, tempNights, max, min } = format({
    arr: arr.slice(
      0,
      isFutureWeather ? undefined : isListShow || !switchIndex ? 15 : 7,
    ),
    curTs: history_ts || curTs
  });

  const baseWidth =
    width ||
    document?.body?.clientWidth ||
    window?.innerWidth ||
    document?.documentElement?.clientWidth ||
    375;

  const diffPoint = diff + 1;
  const hasYesterday = infos?.[0]?.date === '昨天';

  const maxTextLength = Math.max(
    ...arr.slice(0, 15).map(item => item.conditionInterval.length),
  );

  const isForeign = !infos?.[0]?.qualityLevel;

  // 计算列表中间天气栏是否需要带省略
  const isListCenterEllipsis =
    baseWidth -
      ((36 + (fontSizeRatio > 1 ? 0 : 28)) * fontSizeRatio +
        (fontSizeRatio > 1 ? 0 : 4)) -
      (60 + (isForeign ? 0 : 26) * fontSizeRatio + 16) -
      24 -
      32 <
    8 + (maxTextLength * 14 + 24) * fontSizeRatio;

  const svgHeight = 330 + (24 * 2 + 22 * 3 + 18 * 4 + 16) * (fontSizeRatio - 1);

  const dayPoints = useSingleton(() =>
    getPoint({
      max,
      min,
      arr: tempDays,
      width,
      fontSize,
      fontSizeRatio,
      svgHeight,
    }),
  );
  const nightPoints = useSingleton(() =>
    getPoint({
      max,
      min,
      arr: tempNights,
      width,
      fontSize,
      fontSizeRatio,
      svgHeight,
    }),
  );

  const [tempDayArr, setTempDayArr] = useState(dayPoints);
  const [tempNightArr, setTempNightsArr] = useState(nightPoints);
  const [selectLine, setSelectLine] = useState(-1);
  const [selectRow, setSelectRow] = useState(-1);
  const infoRef = useRef(null) as any;

  function ExpandInfo({ hasArrow = false, type = 'line' }) {
    if (type === 'line' && selectLine < 0) {
      return null;
    }
    const {
      conditionInterval,
      tempInterval,
      pop,
      qpf,
      humidity,
      windInterval,
      sunrise,
      sunset,
    } = arr?.[type === 'line' ? selectLine : selectRow];

    const renderList = [
      {
        text: '降水概率',
        value: `${pop}%`,
      },
      {
        text: '降水量',
        value: `${qpf}mm`,
      },
      {
        text: '相对湿度',
        value: `${humidity}%`,
      },
      {
        text: '风力风向',
        value: windInterval.replace(' ', ''),
      },
      {
        text: '日出时间',
        value: sunrise.match(/ (\d\d:\d\d):/)[1],
      },
      {
        text: '日落时间',
        value: sunset.match(/ (\d\d:\d\d):/)[1],
      },
    ];
    return (
      <View
        className="relative"
        data-log-click={JSON.stringify({ pos: 'daily_weather' })}>
        {hasArrow && (
          <ExpandInfoArrow
            className="absolute"
            style={{
              top: -8,
              left: 22,
            }}
          />
        )}
        <View
          className={classNames(
            'p-12 bg-default mx-2 overflow-hidden',
            switchIndex ? 'mb-12' : '',
            fontSize === 'xl' && !switchIndex ? '-mt-6' : '-mt-4',
          )}>
          <Flex align="center" className="mb-8">
            <Text size="t2" color="darker" className="mr-12" weight="medium">
              {conditionInterval}
            </Text>
            <Text size="t2" color="darker" weight="medium">
              {tempInterval.join('~')}℃
            </Text>
          </Flex>
          <Scroller layout={fontSize === 'xl' ? 3.6 : 4.6}>
            {renderList.map(({ text, value }, index) => (
              <View key={index} className="text-center">
                <Text size="t3" color="light">
                  {text}
                </Text>
                <Text
                  size="t2"
                  color="darker"
                  className="break-normal whitespace-nowrap"
                  style={{
                    marginLeft: value.length === 7 ? '-0.5em' : undefined,
                  }}>
                  {value}
                </Text>
              </View>
            ))}
          </Scroller>
        </View>
      </View>
    );
  }

  const paintCircle = (
    pointsArr,
    r = 1.5,
    strokeWid = 1,
    stroke = '#5E6570',
    fill = '#5E6570',
    opacity = 1,
  ) => {
    const getPerCircle = (point, i) => {
      const opacityNew = opacity ? opacity : i === 0 && hasYesterday ? 0.5 : 1;
      return (
        <circle
          key={`paintCircle${i}`}
          cx={point.x}
          cy={point.y}
          r={r}
          strokeWidth={strokeWid}
          stroke={!i && hasYesterday ? '#A0A5AD' : stroke}
          fill={!i && hasYesterday ? '#A0A5AD' : fill}
          opacity={opacityNew}
        />
      );
    };

    return <g>{pointsArr.map(getPerCircle)}</g>;
  };

  const paintMask = pointsArr =>
    pointsArr.map(({ x }, index) => (
      <rect
        onClick={() => handleItemClick(index)}
        data-log-click={JSON.stringify({ pos: 'weather' })}
        key={index}
        rx="8"
        ry="8"
        height="100%"
        width={72}
        x={x - 36}
        y={0}
        style={{ opacity: 0 }}></rect>
    ));

  const paintOtherText = (pointsArr, isForeign, fill = '#161A22') => {
    const getPerText = ({ x }, i) => {
      const {
        date,
        time,
        windLevel,
        qualityLevel,
        qualityColor,
        conditionDay,
        conditionNight,
        icon_day,
        icon_night,
        pop,
        windDegrees,
      } = infos[i];

      const perWidth = baseWidth / (fontSize === 'xl' ? 4 : 5) / 2 - 3;

      let maxTextNum = (perWidth * 2) / (14 * fontSizeRatio);
      if (`${maxTextNum}`.split('.')?.[1]) {
        maxTextNum = Math.floor(maxTextNum) - 1;
      }

      const pathD = `M ${x - perWidth}, ${svgHeight}  L ${x - perWidth}, 8 Q ${
        x - perWidth
      }, 0 ${x - 26}, 0 L ${x + 25}, 0 Q ${x + perWidth}, 0 ${
        x + perWidth
      }, 8 L ${x + perWidth}, ${svgHeight} L ${x - perWidth} ${svgHeight} Z`;

      const isDayHasPercent =
        conditionDay.includes('雨') || conditionDay.includes('雪');
      const isNightHasPercent =
        conditionNight.includes('雨') || conditionNight.includes('雪');

      const windLengthMap = {
        4: 29.34 + 2 + 14,
        2: 18.68 + 2 + 14,
      };

      return (
        <g>
          {selectLine === i && (
            <path d={pathD} stroke="#F2F5F7" fill="#F2F5F7" />
          )}
          <g style={{ opacity: !i && hasYesterday ? 0.6 : undefined }}>
            <text
              style={{ textAnchor: 'middle' }}
              key={`text1${i}`}
              fontSize={(isIOS ? 1 : fontSizeRatio) * 14}
              x={x}
              y={4 + (4 + 14) * fontSizeRatio}
              opacity={1}
              fill={fill}>
              {date}
            </text>
            <text
              style={{ textAnchor: 'middle' }}
              key={`text2${i}`}
              fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
              x={x}
              y={4 + (22 + 3 + 12) * fontSizeRatio}
              opacity={1}
              fill={fill}>
              {time}
            </text>
            {Boolean(icon_day) && (
              <g>
                <image
                  xlinkHref={require(`../../icons/Weather${icon_day}.png`)}
                  x={x - 14 * fontSizeRatio}
                  y={4 + (isDayHasPercent ? 8 : 15) + (22 + 18) * fontSizeRatio}
                  width={24 * fontSizeRatio}
                  height={24 * fontSizeRatio}
                />
                {isDayHasPercent && (
                  <text
                    style={{ textAnchor: 'middle' }}
                    key={`text3${i}`}
                    fontSize={(isIOS ? 1 : fontSizeRatio) * 10}
                    x={x}
                    y={4 + 8 + (22 + 18 + 24 + 2 + 10) * fontSizeRatio}
                    opacity={1}
                    fill="#848A94">
                    {pop}%
                  </text>
                )}
              </g>
            )}
            <text
              style={{ textAnchor: 'middle' }}
              fontSize={(isIOS ? 1 : fontSizeRatio) * 14}
              x={x}
              y={4 + 15 * 2 + (22 + 18 + 24 + 4 + 14) * fontSizeRatio}
              opacity={1}
              fill={fill}>
              {conditionDay.length > ((perWidth * 2) / 14) * fontSizeRatio
                ? `${conditionDay.slice(0, maxTextNum)}...`
                : conditionDay}
            </text>

            {/* 折线图下方内容 */}
            {Boolean(icon_night) && (
              <g>
                <image
                  xlinkHref={require(`../../icons/Weather${icon_night}.png`)}
                  x={x - 12 * fontSizeRatio}
                  y={
                    svgHeight -
                    4 -
                    8 * 2 -
                    (isNightHasPercent ? 22 : 15) -
                    (16 + 18 + 22 + 24) * fontSizeRatio
                  }
                  width={24 * fontSizeRatio}
                  height={24 * fontSizeRatio}
                />
                {isNightHasPercent && (
                  <text
                    style={{ textAnchor: 'middle' }}
                    key={`text4${i}`}
                    fontSize={(isIOS ? 1 : fontSizeRatio) * 10}
                    x={x}
                    y={
                      svgHeight - 4 - 8 * 3 - (16 + 18 + 22 + 2) * fontSizeRatio
                    }
                    opacity={1}
                    fill="#848A94">
                    {pop}%
                  </text>
                )}
              </g>
            )}
            <text
              style={{ textAnchor: 'middle' }}
              className="truncate"
              key={`text5${i}`}
              fontSize={(isIOS ? 1 : fontSizeRatio) * 14}
              x={x}
              y={svgHeight - 4 - 8 * 2 - (16 + 18 + 4) * fontSizeRatio}
              opacity={1}
              fill={fill}>
              {conditionNight.length > ((perWidth * 2) / 14) * fontSizeRatio
                ? `${conditionNight.slice(0, maxTextNum)}...`
                : conditionNight}
            </text>
            <g>
              {/* 真的是巨恶心 ios的svg image不支持transform-origin 只能这么搞了 */}
              <foreignObject
                style={{ position: 'relative' }}
                x={x - (windLengthMap[windLevel.length] * fontSizeRatio) / 2}
                y={svgHeight - 4 - 10 - (16 + 14) * fontSizeRatio}
                width="20"
                height="20">
                <Image
                  bordered={false}
                  transparent={true}
                  hasBg={false}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${windDegrees}deg)`,
                  }}
                  src={require(isDarkMode
                    ? './assets/windDark.png'
                    : './assets/wind.png')}
                  width={14}
                  height={14}
                />
              </foreignObject>
              <text
                key={`text6${i}`}
                fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
                x={
                  x -
                  (windLengthMap[windLevel.length] * fontSizeRatio) / 2 +
                  14 * fontSizeRatio +
                  2
                }
                y={svgHeight - 4 - 8 - (16 + 5) * fontSizeRatio}
                opacity={1}
                fill={fill}>
                {windLevel}
              </text>
            </g>
            {!isForeign && (
              <g>
                <rect
                  data-tt-darkmode-disable={true}
                  x={x - 13 * fontSizeRatio}
                  y={svgHeight - 4 - 16 * fontSizeRatio}
                  width={26 * fontSizeRatio}
                  height={16 * fontSizeRatio}
                  rx="4"
                  fill={qualityColor || '#F2F5F7'}
                />
                <text
                  key={`text7${i}`}
                  style={{ textAnchor: 'middle' }}
                  fontSize={(isIOS ? 1 : fontSizeRatio) * 10}
                  x={x}
                  y={svgHeight - 4 - 4 * fontSizeRatio}
                  fill={qualityColor ? 'white' : '#848A94'}
                  fontWeight="500">
                  {qualityLevel === '爆表' ? '严重' : qualityLevel || '暂无'}
                </text>
              </g>
            )}
          </g>
        </g>
      );
    };

    return <g>{pointsArr.map(getPerText)}</g>;
  };

  // 今天之前为虚线 今天之后为实线
  const paintPath = (points, stroke = '#5E6570') => {
    if (points.length) {
      const drawDottedLine = () => {
        const tempArr = points.slice(0, diffPoint + 1);

        let pathD = `M ${tempArr[0].x}, ${tempArr[0].y}`;
        const { length } = tempArr;
        const setC = (x1, y1, x2, y2, x, y) =>
          ` C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
        tempArr.forEach((_, i) => {
          if (i > 0 && i <= length - 1) {
            const tempX = (tempArr[i - 1].x + tempArr[i].x) / 2;
            pathD += setC(
              tempX,
              tempArr[i - 1].y,
              tempX,
              tempArr[i].y,
              tempArr[i].x,
              tempArr[i].y,
            );
          }
        });

        return (
          <path
            strokeDasharray={hasYesterday ? '3,3' : undefined}
            d={pathD}
            stroke={hasYesterday ? '#A0A5AD' : stroke}
            fillOpacity="0"
          />
        );
      };

      const drawSolidLine = () => {
        const tempArr = points.slice(diffPoint);

        let pathD = `M ${points[diffPoint]?.x}, ${points[diffPoint]?.y}`;
        const { length } = tempArr;
        const setC = (x1, y1, x2, y2, x, y) =>
          ` C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
        tempArr.forEach((_, i) => {
          if (i > 0 && i <= length - 1) {
            const tempX = (tempArr[i - 1]?.x + tempArr[i]?.x) / 2;
            pathD += setC(
              tempX,
              tempArr[i - 1]?.y,
              tempX,
              tempArr[i]?.y,
              tempArr[i].x,
              tempArr[i].y,
            );
          }
        });

        return <path d={pathD} stroke={stroke} fillOpacity="0" />;
      };

      return (
        <g>
          {drawDottedLine()}
          {drawSolidLine()}
        </g>
      );
    }
    return null;
  };

  const paintText = (pointsArr, increaseY = 5, r = 4, fill = '#161A22') => {
    const getPerText = (point, i) => {
      const length = (point.text.length - 1) * 2;
      return (
        <text
          style={{ opacity: !i ? 0.6 : undefined }}
          key={`text${i}`}
          fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
          x={point.x - r - length}
          y={point.y + increaseY}
          opacity={1}
          fill={fill}>
          {point.text}
        </text>
      );
    };

    return <g>{pointsArr.map(getPerText)}</g>;
  };

  useEffect(() => {
    const { top } = infoRef.current.getBoundingClientRect();

    infoRef.current.top = top + window.scrollY;

    const dayPoints = getPoint({
      max,
      min,
      arr: tempDays,
      width: baseWidth,
      fontSize,
      fontSizeRatio,
      svgHeight,
    });
    const nightPoints = getPoint({
      max,
      min,
      arr: tempNights,
      width: baseWidth,
      fontSize,
      fontSizeRatio,
      svgHeight,
    });

    setTempDayArr(dayPoints);
    setTempNightsArr(nightPoints);
  }, [arr]);

  function handleHideButtonClick() {
    window.scrollTo(0, infoRef.current.top - 100);
    setIsListShow(false);
  }

  function handleItemClick(i, type = 'line') {
    if (type === 'line') {
      if (selectLine === i) {
        setSelectLine(-1);
      } else {
        setSelectLine(i);
      }
    } else if (selectRow === i) {
      setSelectRow(-1);
    } else {
      setSelectRow(i);
    }
  }

  function PaintSvg() {
    return (
      <svg
        width={(baseWidth / (fontSize === 'xl' ? 4 : 5)) * infos?.length}
        height={svgHeight - (isForeign ? 12 + 16 * fontSizeRatio : 0)}>
        {paintOtherText(tempDayArr, isForeign)}

        {paintPath(tempDayArr)}
        {paintCircle(tempDayArr)}
        {paintText(tempDayArr, -5, 4)}

        {paintPath(tempNightArr)}
        {paintCircle(tempNightArr, 1.5, 1)}

        {paintText(tempNightArr, 17)}

        {/* 折线图上方的遮罩 用于点击后背景变灰 */}
        {paintMask(tempNightArr)}
      </svg>
    );
  }

  return (
    <View className="bg-card relative" ref={infoRef}>
      {!isFutureWeather && (
        <Flex align="center" justify="between" className="m-16 mb-12">
          <Text
            data-log-click={JSON.stringify({ pos: '24hour_detail' })}
            color="darker"
            size="t1"
            weight="medium">
            15天天气预报
          </Text>
          <Switch
            pos="tab_list"
            switchList={['趋势', '列表']}
            OnIndexChange={setSwitchIndex}
          />
        </Flex>
      )}

      {/* 趋势 */}
      {!switchIndex ? (
        <>
          <View className="overflow-scroll">
            <View data-log-click={JSON.stringify({ pos: 'forecast_detail' })}>
              <PaintSvg />
            </View>
          </View>

          <ExpandInfo />

          <Button
            data-log-click={JSON.stringify({ pos: '40day_detail' })}
            block={true}
            href={url}
            color="darker"
            className="mx-16 mt-12"
            size="m"
            suffix={<ArrowFilled color="darker" size="s" />}>
            40天天气预报
          </Button>
        </>
      ) : (
        <View id="listContent">
          {/* 列表 */}
          {infos.map((item, index) => {
            const { date, time } = item;
            const {
              conditionInterval,
              tempNight,
              tempDay,
              qualityLevel,
              qualityColor,
              pop,
              icon_day,
            } = arr?.[index];

            return (
              <View key={index} onClick={() => handleItemClick(index, 'row')}>
                <Flex
                  align="center"
                  justify="between"
                  style={{
                    opacity: !index ? 0.6 : undefined,
                    height: 38 * fontSizeRatio,
                  }}
                  className="mx-16 mb-12 overflow-x-hidden">
                  <Flex
                    align="center"
                    className="mr-12"
                    style={{ flexShrink: 0, flexGrow: 0 }}>
                    {fontSizeRatio === 1 && (
                      <Text color="darker" className="mr-4 flex-nowrap">
                        {date}
                      </Text>
                    )}
                    <Text color="darker" className="flex-nowrap">
                      {time}
                    </Text>
                  </Flex>

                  <Flex
                    align="center"
                    style={{
                      minWidth: isListCenterEllipsis
                        ? baseWidth -
                          ((40 + (fontSizeRatio > 1 ? 0 : 28)) * fontSizeRatio +
                            (fontSizeRatio > 1 ? 0 : 4)) -
                          (60 + (isForeign ? 0 : 26) * fontSizeRatio + 16) -
                          24 -
                          32
                        : undefined,
                    }}>
                    <View className="mr-8 flex-shrink-0">
                      {Boolean(icon_day) && (
                        <Image
                          width={24}
                          height={24}
                          bordered={false}
                          transparent={true}
                          src={require(`../../icons/Weather${icon_day}.png`)}
                        />
                      )}
                      {(conditionInterval.includes('雨') ||
                        conditionInterval.includes('雪')) && (
                        <Text size="t4" color="light">
                          {pop}%
                        </Text>
                      )}
                    </View>
                    <Text
                      color="darker"
                      wordLines={1}
                      style={{
                        minWidth: isListCenterEllipsis
                          ? undefined
                          : maxTextLength * 14 * fontSizeRatio,
                      }}>
                      {conditionInterval}
                    </Text>
                  </Flex>

                  <Flex
                    align="center"
                    justify="end"
                    className="flex-shrink-0 ml-12"
                    style={{
                      flex: `0 0 ${
                        60 + (isForeign ? 0 : 26) * fontSizeRatio + 16
                      }px`,
                    }}>
                    <View
                      className="mr-4 color-darker t2 text-right"
                      style={{ flex: `0 0 ${30 * fontSizeRatio}px` }}>
                      {tempNight}°
                    </View>
                    <View
                      className="color-darker t2 text-right"
                      style={{ flex: `0 0 ${30 * fontSizeRatio}px` }}>
                      {tempDay}°
                    </View>
                    {!isForeign && (
                      <Text
                        data-tt-darkmode-disable={true}
                        style={{
                          flex: `0 0 ${26 * fontSizeRatio}px`,
                          background: qualityColor || '#F2F5F7',
                          paddingTop: 1,
                          paddingBottom: 1,
                        }}
                        size="t4"
                        weight="medium"
                        color={!qualityLevel ? 'light' : 'white-darker'}
                        className="flex-shrink-0 text-center rounded-5 ml-12">
                        {qualityLevel || '暂无'}
                      </Text>
                    )}
                  </Flex>
                </Flex>
                {index === selectRow && (
                  <ExpandInfo hasArrow={true} type="row" />
                )}
              </View>
            );
          })}
          <Container
            layout={isListShow ? '1-2' : '1-0'}
            align="center"
            gutter={isListShow ? 8 : undefined}
            className="mx-16 mt-12 overflow-hidden relative">
            {isListShow && (
              <View>
                <Button
                  onClick={handleHideButtonClick}
                  data-log-click={JSON.stringify({ pos: '15day_detail' })}
                  block={true}
                  color="darker"
                  size="m"
                  suffix={<ArrowUpFilled color="darker" size="s" />}>
                  收起
                </Button>
              </View>
            )}
            <View>
              <Button
                onClick={() => setIsListShow(true)}
                data-log-click={JSON.stringify({ pos: '15day_detail' })}
                block={true}
                color="darker"
                size="m"
                href={isListShow ? url : undefined}
                suffix={
                  isListShow ? (
                    <ArrowFilled color="darker" size="s" />
                  ) : (
                    <ArrowDownFilled color="darker" size="s" />
                  )
                }>
                {isListShow ? '40天天气预报' : '展开15天天气预报'}
              </Button>
            </View>
          </Container>
        </View>
      )}
    </View>
  );
}

export { WeatherInfo };
