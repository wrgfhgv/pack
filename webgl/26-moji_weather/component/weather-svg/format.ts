import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

function getDestAryProperties(arr, property) {
  const temp = [] as any;
  arr.forEach(item => {
    temp.push(item?.[property]);
  });

  return { max: Math.max(...temp), min: Math.min(...temp) };
}

function getPoint({
  svgInfo,
  info,
  width,
  fontSize,
  fontSizeRatio,
  svgHeight,
  bottomOffset,
}) {
  const tempPointArr = [] as any;
  const perView = fontSize === 'xl' ? 4 : 5;
  const perWidth = width / perView;
  const rainPoint = [] as any;
  const rainPointPro = [] as any;
  const rainTextXaxis = [] as any;
  const sunPoint = {} as any;

  const svgMap = {
    temp: {
      top: 4 * 2 + (24 + 14 + 18) * fontSizeRatio,
      bottom: svgHeight - 4 * 3 - 4 - (18 + 16) * fontSizeRatio + bottomOffset,
    },
    precipitationRate: {
      top: 4 + 18 * fontSizeRatio,
      bottom: svgHeight - 4 * 2 - 4 - 18 * fontSizeRatio,
    },
    windlevel: {
      top: 4 + 18 * fontSizeRatio,
      bottom: svgHeight - 4 * 3 - 4 - (18 + 18) * fontSizeRatio,
    },
    humidity: {
      top: 4 + 18 * fontSizeRatio,
      bottom: svgHeight - 4 * 2 - 4 - 18 * fontSizeRatio,
    },
    uvi: {
      top: 4 + 18 * fontSizeRatio,
      bottom: svgHeight - 4 * 2 - 4 - (18 + 18) * fontSizeRatio,
    },
  };

  const { max, min } = getDestAryProperties(svgInfo, info);
  const { top, bottom } = svgMap?.[info];

  if (info === 'temp') {
    dayjs.extend(isBetween);
    let sunrise;
    let sunset;
    let now;
    const perHeight = max - min !== 0 ? (bottom - top) / (max - min) : 0;
    svgInfo.forEach(
      (
        {
          hour,
          airQualityLevel,
          time,
          rise1,
          rise2,
          set1,
          set2,
          temp,
          icon = 0,
          precipitationRate,
        },
        i,
      ) => {
        if (i === 0) {
          now = time;
          if (dayjs(time).isBefore(rise1, 's')) {
            sunrise = rise1;
            sunset = set1;
          } else if (dayjs(time).isBetween(rise1, set1, 's')) {
            sunrise = rise2;
            sunset = set1;
          } else {
            sunrise = rise2;
            sunset = set2;
          }
        }

        tempPointArr.push({
          xAxis: i === 0 ? '现在' : `${hour}:00`,
          x: (i + 0.5) * perWidth,
          y: bottom - (temp - min) * perHeight,
          text: `${temp}°`,
          icon,
          airQualityLevel,
          precipitationRate,
        });
      },
    );

    sunPoint.sunsetX =
      dayjs(sunset).diff(dayjs(now), 'minute') * (70 / 60) + 35;
    sunPoint.sunriseX =
      dayjs(sunrise).diff(dayjs(now), 'minute') * (70 / 60) + 35;
  } else if (info === 'uvi') {
    const perHeight = max - min !== 0 ? (bottom - top) / (max - min) : 0;

    svgInfo.forEach(({ hour, uvi, uviText }, i) => {
      tempPointArr.push({
        xAxis: i === 0 ? '现在' : `${hour}:00`,
        x: (i + 0.5) * perWidth,
        y:
          max > 10
            ? bottom - perHeight * (uvi - 1)
            : -((bottom - top) / 10) * uvi + bottom,
        text: `${uvi}级`,
        uviText,
      });
    });
  } else if (info === 'humidity') {
    svgInfo.forEach(({ hour, humidity }, i) => {
      tempPointArr.push({
        xAxis: i === 0 ? '现在' : `${hour}:00`,
        x: (i + 0.5) * perWidth,
        y: -((bottom - top) / 100) * humidity + bottom,
        text: `${humidity}%`,
      });
    });
  } else if (info === 'windlevel') {
    let maxY = 0;
    if (max * 1.5 < 5) {
      maxY = 5;
    } else if (max * 1.5 >= 5 && max * 1.5 < 12) {
      maxY = max * 1.5;
    } else {
      maxY = 12;
    }

    const perHeight = maxY - 0 !== 0 ? 64 / (maxY - 0) : 0;
    svgInfo.forEach(({ hour, windlevel, windDegrees, windInfo }, i) => {
      tempPointArr.push({
        xAxis: i === 0 ? '现在' : `${hour}:00`,
        x: (i + 0.5) * perWidth,
        y: bottom - windlevel * perHeight,
        text: `${windlevel}级`,
        windDegrees,
        windInfo,
      });
    });
  } else if (info === 'precipitationRate') {
    const getPrecipitationY = per =>
      -((bottom - top) / 20) * (per > 20 ? 20 : per) + bottom;

    svgInfo.forEach(({ hour, qpf }, i) => {
      // y 间隔取值
      tempPointArr.push({
        xAxis: i === 0 ? '现在' : `${hour}:00`,
        x: (i + 0.5) * perWidth,
        text: `${qpf}mm`,
      });

      rainPoint.push({
        x: (i + 1) * perWidth,
        y: getPrecipitationY(qpf),
      });

      rainTextXaxis.push({
        x: (i + 0.5) * perWidth,
        y: getPrecipitationY(qpf),
        text: `${qpf}mm`,
      });
    });

    const { length } = rainPoint;

    rainPointPro.push({
      x: 0,
      y: rainPoint[0]?.y,
    });
    rainPointPro.push({
      x: perWidth,
      y: rainPoint[0]?.y,
      show: true,
    });
    rainPoint.forEach(({ x, y }, i) => {
      const nextY =
        i < length - 2 ? rainPoint[i + 1].y : rainPoint[length - 1].y;

      rainPointPro.push({
        x,
        y,
        show: true,
      });

      if (y !== nextY) {
        rainPointPro.push({
          x,
          y: nextY,
          show: true,
        });
      }
    });
  }

  // 向前顺延一个单位
  const tempArr = [
    {
      x: -30,
      y: tempPointArr[0]?.y,
      text: '',
      xAxis: '11',
      icon: 0,
      airQualityLevel: tempPointArr[0]?.airQualityLevel,
      precipitationRate: tempPointArr[0]?.precipitationRate,
    },
    ...tempPointArr,
  ];

  return {
    tempPointArr: tempArr,
    rainPointPro,
    rainTextXaxis: rainTextXaxis.slice(0, rainTextXaxis.length - 1),
    sunPoint,
    bottom,
  };
}

export { getPoint };
