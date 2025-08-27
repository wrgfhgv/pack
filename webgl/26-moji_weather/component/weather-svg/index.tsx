/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-dynamic-require */
import React, { useContext } from 'react';
import { View } from '@lego/lego_core';
import { judgeVersion } from '@Utils';
import './index.less';
import { weatherContext } from '../..';
import { getPoint } from './format';

// 由于不明原因 svg text的fontsize大小比实际的要大两号 即svg的fontsize=14对应dom属性的fontsize=16

function LineSvg({ tempArr, info, width, svgHeight, bottom }) {
  const { fontSizeRatio, isIOS } = useContext(weatherContext) as any;

  const pointLinearGradient = (points, stroke = 'white') => {
    let pathD = `M ${points[0].x} ,${bottom} L ${points[0].x}, ${points[0].y}`;
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

    pathD += `L ${points[length - 1].x}, ${bottom}`;
    return (
      <g>
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%">
            <stop offset="10%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          stroke={stroke}
          style={{ fill: 'url(#linear-gradient)' }}
        />
      </g>
    );
  };

  const paintPath = (points, stroke = '#fff') => {
    let pathD = `M ${points[0].x} ,100 L ${points[0].x}, ${points[0].y}`;
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

    pathD += `L ${points[length - 1].x}, 100`;
    return (
      <g>
        <path d={pathD} stroke={stroke} fill="rgba(0,0,0,0)" />
      </g>
    );
  };

  const paintCircle = (
    pointsArr,
    r = 1.5,
    strokeWid = 1,
    stroke = '#fff',
    fill = '#fff',
    opacity = 1,
  ) => {
    const getPerCircle = (point, i) => {
      const opacityNew = opacity ? opacity : i === 0 ? 0.5 : 1;
      return (
        <circle
          key={`paintCircle${i}`}
          cx={point.x}
          cy={point.y}
          r={r}
          strokeWidth={strokeWid}
          stroke={stroke}
          fill={fill}
          opacity={opacityNew}
        />
      );
    };

    return <g>{pointsArr.map(getPerCircle)}</g>;
  };

  const paintXAxis = pointsArr => (
    <g>
      {pointsArr.map(({ xAxis, x }, idx) => (
        <text
          style={{ textAnchor: 'middle' }}
          key={idx}
          fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
          x={x}
          y={svgHeight - 4 - (3 + 2) * fontSizeRatio}
          fill={'#fff'}>
          {xAxis}
        </text>
      ))}
    </g>
  );

  const paintText = (
    pointsArr,
    increaseY = 10,
    // r = 4,
    fill = '#fff',
  ) => {
    const getPerText = ({ text, x, y }, i) => (
      <text
        style={{ textAnchor: 'middle' }}
        fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
        key={`text${i}`}
        x={x}
        y={y - increaseY}
        opacity={1}
        fill={fill}>
        {text}
      </text>
    );

    return <g>{pointsArr.map(getPerText)}</g>;
  };

  const paintDashLine = pointsArr => (
    <g>
      {pointsArr.map(({ x, y }, index) => (
        <path
          key={index}
          strokeDasharray="3,3"
          d={`M${x} ${y} L${x} ${bottom}`}
          stroke="rgba(255,255,255,0.5)"
        />
      ))}
    </g>
  );

  const paintWeatherIcon = pointsArr => {
    // 如果以下数组含有icon的值则代表为雨雪天气需要显示降水概率
    const hasPercentMap = [
      3, 33, 13, 34, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 19,
    ];

    return (
      <g>
        {pointsArr.map(({ x, icon, precipitationRate }, idx) => {
          const hasPercent = hasPercentMap.includes(Number(icon));
          const iconY = hasPercent ? 4 : 11;
          return (
            <g key={idx}>
              <image
                xlinkHref={require(`../../tab-icons/Weather${icon}.png`)}
                x={x - 12 * fontSizeRatio}
                y={iconY}
                height={24 * fontSizeRatio}
                width={24 * fontSizeRatio}
              />
              {hasPercent && (
                <text
                  style={{ textAnchor: 'middle' }}
                  fontSize={(isIOS ? 1 : fontSizeRatio) * 10}
                  x={x}
                  y={4 + (24 + 10 + 2) * fontSizeRatio}
                  fill="rgba(255, 255, 255, 0.75)">
                  {precipitationRate}%
                </text>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const PaintWeatherTag = pointsArr => (
    <g>
      {pointsArr.map(({ x, airQualityLevel }, idx) => {
        const tagMap = {
          优: '#2DA822',
          良: '#FFBA12',
          轻度: '#FF7528',
          中度: '#F04142',
          重度: '#87176D',
          严重: '#701843',
          爆表: '#701843',
        };
        return (
          <g key={idx}>
            <rect
              data-tt-darkmode-disable={true}
              x={x - 13 * fontSizeRatio}
              y={svgHeight - 4 * 2 - (18 + 16) * fontSizeRatio}
              width={26 * fontSizeRatio}
              height={16 * fontSizeRatio}
              rx="4"
              fill={tagMap[airQualityLevel] || '#F2F5F7'}
            />
            <text
              style={{ dominantBaseline: 'middle', textAnchor: 'middle' }}
              fontSize={(isIOS ? 1 : fontSizeRatio) * 10}
              x={x}
              y={svgHeight - 4 * 2 - (18 + 3 + 4) * fontSizeRatio}
              fill={airQualityLevel ? 'white' : '#848A94'}
              fontWeight="500">
              {airQualityLevel === '爆表' ? '严重' : airQualityLevel || '暂无'}
            </text>
          </g>
        );
      })}
    </g>
  );

  const paintWindInfo = pointsArr => (
    <g>
      {pointsArr.map(({ windInfo, x }, idx) => (
        <text
          style={{ textAnchor: 'middle' }}
          key={idx}
          fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
          x={x}
          y={svgHeight - 4 * 2 - (18 + 3 + 2) * fontSizeRatio}
          fill="white">
          {windInfo}
        </text>
      ))}
    </g>
  );

  const paintUviInfo = pointsArr => (
    <g>
      {pointsArr.map(({ uviText, x }, idx) => (
        <text
          key={idx}
          fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
          x={x}
          y={svgHeight - 4 * 2 - (18 + 3 + 2) * fontSizeRatio}
          fill="white"
          style={{ textAnchor: 'middle' }}>
          {uviText}
        </text>
      ))}
    </g>
  );

  return tempArr.length ? (
    <View
      className="wrap"
      style={{
        height: svgHeight,
      }}>
      <View className="svgW">
        <svg width={width} height={svgHeight}>
          {paintDashLine(tempArr)}
          {paintPath(tempArr)}
          {paintCircle(tempArr)}
          {paintText(tempArr)}
          {paintXAxis(tempArr)}
          {info === 'temp' &&
            Boolean(tempArr?.[0]?.airQualityLevel) &&
            PaintWeatherTag(tempArr)}
          {info === 'temp' && paintWeatherIcon(tempArr)}
          {info === 'windlevel' && paintWindInfo(tempArr)}
          {info === 'uvi' && paintUviInfo(tempArr)}
          {info !== 'temp' && pointLinearGradient(tempArr)}
        </svg>
      </View>
    </View>
  ) : null;
}

function SquareSvg({
  tempArr,
  rainTextXaxis,
  rainPointPro,
  width,
  canUseLinear,
  svgHeight,
  bottom,
}) {
  const { fontSizeRatio, isIOS } = useContext(weatherContext) as any;

  // 盖一层渐变色
  const pointLinearGradient = tempArr => {
    const { length } = tempArr;
    let pathD = `M ${tempArr[0].x} ,${bottom}`;
    tempArr.forEach(({ x, y }) => {
      pathD += `L ${x} ${y}`;
    });
    pathD += `L ${tempArr[length - 1].x}, ${bottom}`;

    return (
      <g>
        <defs>
          <linearGradient
            id="linear-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%">
            <stop offset="10%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          stroke="rgba(255, 255, 255, 0)"
          style={{ fill: 'url(#linear-gradient)' }}
        />
      </g>
    );
  };

  const paintPath = (stroke = '#fff') => {
    const { length } = rainPointPro;
    let pathD = `M ${rainPointPro[0].x} ,${rainPointPro[0].y}`;
    rainPointPro.forEach(({ x, y }, i) => {
      const nextY =
        i < length - 1 ? rainPointPro[i + 1].y : rainPointPro[length - 1].y;
      if (y !== nextY) {
        pathD += `L ${x} ${y} M ${x} ${nextY}`;
      } else {
        pathD += `L ${x} ${y}`;
      }
    });

    pathD += `L ${rainPointPro[length - 1].x}, ${rainPointPro[length - 1].y}`;

    return (
      <g>
        <path d={pathD} stroke={stroke} fill="rgba(0,0,0,0)" />
      </g>
    );
  };

  const paintCircle = (
    r = 1.5,
    strokeWid = 1,
    stroke = '#fff',
    fill = '#fff',
    opacity = 1,
  ) => {
    const getPerCircle = (point, i) => {
      if (!i) {
        return null;
      }
      const opacityNew = opacity ? opacity : i === 0 ? 0.5 : 1;
      return (
        <circle
          key={`paintCircle${i}`}
          cx={point.x}
          cy={point.y}
          r={r}
          strokeWidth={strokeWid}
          stroke={stroke}
          fill={fill}
          opacity={opacityNew}
        />
      );
    };

    return <g>{rainPointPro.map(getPerCircle)}</g>;
  };

  const paintDashLine = () => {
    const { length } = rainPointPro;

    return (
      <g>
        {rainPointPro.map(({ x, y, show }, i) => {
          const nextY =
            i < length - 1 ? rainPointPro[i + 1].y : rainPointPro[length - 1].y;
          const nextItem =
            i < length - 1 ? rainPointPro[i + 1] : rainPointPro[length - 1];
          if (y !== nextY) {
            nextItem.show = false;
          }
          if (show) {
            const minY = Math.min(y, nextY);
            return (
              <path
                key={i}
                strokeDasharray="3,3"
                d={`M${x} ${minY} L${x} ${bottom}`}
                stroke="rgba(255, 255, 255, 0.3)"
              />
            );
          }
          return null;
        })}
      </g>
    );
  };

  const paintText = (increaseY = 6, fill = '#fff') => {
    const getPerText = ({ text, x, y }, i) => (
      <text
        style={{ textAnchor: 'middle' }}
        fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
        key={`text${i}`}
        x={x}
        y={y - increaseY}
        opacity={1}
        fill={fill}>
        {text}
      </text>
    );

    return <g>{rainTextXaxis.map(getPerText)}</g>;
  };

  const paintXAxis = () => (
    <g>
      {tempArr.map(({ xAxis, x }, idx) => (
        <text
          style={{ textAnchor: 'middle' }}
          fontSize={(isIOS ? 1 : fontSizeRatio) * 12}
          key={idx}
          x={x}
          y={svgHeight - 4 - (3 + 2) * fontSizeRatio}
          fill={'#fff'}>
          {xAxis}
        </text>
      ))}
    </g>
  );

  return tempArr.length ? (
    <View
      className="wrap"
      style={{
        height: svgHeight,
      }}>
      <View className="svgW">
        <svg width={width} height={svgHeight}>
          {paintDashLine()}
          {paintPath()}
          {paintCircle()}
          {paintText()}
          {paintXAxis()}
          {canUseLinear ? pointLinearGradient(rainPointPro) : null}
        </svg>
      </View>
    </View>
  ) : null;
}

function WeatherSvg({ svgInfo, info, index }) {
  const {
    width: baseWidth,
    fontSize,
    fontSizeRatio,
  } = useContext(weatherContext) as any;

  const bottomOffset =
    !index && !svgInfo?.[0]?.airQualityLevel ? 16 * fontSizeRatio + 4 : 0;

  const svgHeight =
    140 + (38 + 14 + 16 + 12) * (fontSizeRatio - 1) - bottomOffset;

  const {
    tempPointArr: tempArr,
    rainTextXaxis,
    rainPointPro,
    bottom,
  } = getPoint({
    svgInfo,
    info,
    width: baseWidth,
    fontSize,
    fontSizeRatio,
    svgHeight,
    bottomOffset,
  });

  const width =
    (tempArr.length - 2) * (baseWidth / 5) * (fontSize === 'xl' ? 5 / 4 : 1);

  const canUseLinear = judgeVersion('os', {
    ios: '13.0.0',
  });

  if (info === 'precipitationRate') {
    return (
      <SquareSvg
        tempArr={tempArr}
        rainTextXaxis={rainTextXaxis}
        rainPointPro={rainPointPro}
        width={width}
        canUseLinear={canUseLinear}
        svgHeight={svgHeight}
        bottom={bottom}
      />
    );
  }

  return (
    <LineSvg
      tempArr={tempArr}
      info={info}
      width={width}
      svgHeight={svgHeight}
      bottom={bottom}
    />
  );
}

export { WeatherSvg };
