import dayjs from 'dayjs';

function getDestAryProperties(arr) {
  return { max: Math.max(...arr), min: Math.min(...arr) };
}

function getPoint({
  arr,
  max,
  min,
  width = 375,
  fontSize,
  fontSizeRatio,
  svgHeight,
}) {
  const top = 4 * 2 + 15 * 2 + (22 + 18 + 24 + 22 + 18) * fontSizeRatio;
  const bottom =
    svgHeight - 4 - 8 * 2 - 15 - 11 - (16 + 18 + 22 + 24 + 18) * fontSizeRatio;
  const perView = fontSize === 'xl' ? 4 : 5;
  const perWidth = width / perView;
  const perHeight = (bottom - top) / (max - min);
  const dayPoints = arr.map((item, i) => {
    const y = bottom - (item - min) * perHeight;
    const x = (i + 0.5) * perWidth;
    return {
      x,
      y,
      text: `${item}°`,
    };
  });

  return dayPoints;
}

function format({ arr, curTs }) {
  const tempDays = arr.map(({ tempDay }) => tempDay);

  const tempNights = arr.map(({ tempNight }) => tempNight);

  const { max, min } = getDestAryProperties([...tempDays, ...tempNights]);

  const infos = arr.map(
    ({
      sunrise,
      windLevelDay,
      windLevelNight,
      windDayDegree,
      windDayNightDegree,
      conditionDay,
      conditionNight,
      qualityLevel,
      qualityColor,
      icon_day,
      icon_night,
      pop,
    }) => {
      let date;
      const weekStr = ['日', '一', '二', '三', '四', '五', '六'];
      date = `周${weekStr[dayjs(sunrise).day()]}`;

      const diff = dayjs(sunrise.split(' ')[0]).diff(
        dayjs(curTs).format('YYYY-MM-DD'),
        'day',
      );

      if (diff === -2) {
        date = '前天';
      }

      if (diff === -1) {
        date = '昨天';
      }

      if (diff === 0) {
        date = '今天';
      }

      if (diff === 1) {
        date = '明天';
      }

      let windDegrees;
      let windLevel;
      if (
        Math.max(...windLevelDay.split('-')) >
        Math.max(...windLevelNight.split('-'))
      ) {
        windDegrees = windDayDegree;
        windLevel = windLevelDay;
      } else {
        windDegrees = windDayNightDegree;
        windLevel = windLevelNight;
      }

      const condition = conditionDay;

      return {
        date,
        time: dayjs(sunrise).format('MM/DD'),
        windLevel: `${windLevel}级`,
        windLevelDay: `${windLevelDay}级`,
        windDegrees,
        condition,
        qualityLevel,
        qualityColor,
        conditionDay,
        conditionNight,
        icon_day,
        icon_night,
        pop,
      };
    },
  );

  return { infos, tempDays, tempNights, max, min };
}

export { format, getPoint };
