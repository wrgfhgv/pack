/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import { newAjax } from '@tt-search/tools';
import { isEmptyObj } from '@lego/utils';
import threeConfig from './component/weather-bg/config';

const windMap = {
  N: '北风',
  NNE: '东北风',
  NE: '东北风',
  ENE: '东北风',
  E: '东风',
  ESE: '东南风',
  SE: '东南风',
  SSE: '东南风',
  S: '南风',
  SSW: '西南风',
  SW: '西南风',
  WSW: '西南风',
  W: '西风',
  WNW: '西北风',
  NW: '西北风',
  NNW: '西北风',
  Calm: '微风',
  Whirlwind: '旋转风',
};

const sizeMap = {
  s: 0.9,
  m: 1,
  l: 1.15,
  xl: 1.3,
  xxl: 1.3,
};

const uviMap = {
  '0,1,2': '最弱',
  '3,4': '弱',
  '5,6': '中等',
  '7,8,9': '强',
  '10': '很强',
};

// 异步获取城市数据
function getCityList() {
  return newAjax({
    method: 'get',
    url: '/2/wap/search/extra/house_price/options',
    crossOrigin: true,
  });
}
function getQualityColor(level) {
  const airColors = [
    { color: '#2DA822', airLevel: '优' },
    { color: '#FFBA12', airLevel: '良' },
    { color: '#FF7528', airLevel: '轻度' },
    { color: '#F04142', airLevel: '中度' },
    { color: '#87176D', airLevel: '重度' },
    { color: '#701843', airLevel: '严重' },
    { color: '#701843', airLevel: '爆表' },
  ];

  const colorShow = airColors.filter(({ airLevel }) => airLevel === level)?.[0]
    ?.color;
  return colorShow;
}

function getWindLevel(windLevel) {
  const windMap = {
    0: '无风',
    1: '软风',
    2: '轻风',
    3: '微风',
    4: '和风',
    5: '轻劲风',
    6: '强风',
    7: '疾风',
    8: '大风',
    9: '烈风',
    10: '狂风',
    11: '暴风',
    12: '台风',
    13: '飓风',
  };
  const temp = windLevel?.split('-') || 0;
  const level = temp[temp?.length - 1] > 13 ? 13 : temp[temp?.length - 1];
  return windMap[level];
}

// 获取 一周天气基础数据
function formatDaysInfo({ forecast, aqiForecast, curTs }) {
  const degreeMap = {
    北风: 0,
    东北风: 45,
    东风: 90,
    东南风: 135,
    南风: 180,
    西南风: 225,
    西风: 270,
    西北风: 315,
  };

  const weatherInfo = forecast.map((item, index) => {
    const {
      weather_day: conditionDay,
      weather_id_day: conditionIdDay,
      weather_night: conditionNight,
      weather_id_night: conditionIdNight,
      sun_down: sunset,
      sun_rise: sunrise,
      wind_dir_day: windDirDay,
      wind_dir_night: windDirNight,
      wind_level_day: windLevelDay,
      wind_level_night: windLevelNight,
      update_time: updatetime,
      pop,
      qpf,
      humidity,
      icon_day,
      icon_night,
    } = item;
    let { temp_high: tempDay, temp_low: tempNight } = item;

    tempDay = `${Number(tempDay)}`;
    tempNight = `${Number(tempNight)}`;

    const isBefore = dayjs(curTs).isBefore(dayjs(sunset));
    const { quality_level: qualityLevel, aqi: qualityValue } =
      aqiForecast[index] || {};

    let tempInterval;

    if (Number(tempDay) < Number(tempNight)) {
      tempInterval = `${tempDay}~${tempNight}`;
    } else if (Number(tempDay) === Number(tempNight)) {
      tempInterval = tempNight;
    } else {
      tempInterval = `${tempNight}~${tempDay}`;
    }
    let conditionInterval;
    if (conditionDay === conditionNight) {
      conditionInterval = conditionDay;
    } else {
      conditionInterval = `${conditionDay}转${conditionNight}`;
    }

    let windInterval;
    if (
      Math.max(...windLevelDay.split('-')) >
      Math.max(...windLevelNight.split('-'))
    ) {
      windInterval = `${windDirDay} ${windLevelDay}级`;
    } else {
      windInterval = `${windDirNight} ${windLevelNight}级`;
    }

    return {
      isBefore,
      conditionDay,
      conditionIdDay,
      conditionNight,
      conditionInterval,
      conditionIdNight,
      windDirDay,
      windDirNight,
      windLevelDay,
      windLevelNight,
      windInterval,
      windDayDegree: degreeMap[windDirDay],
      windDayNightDegree: degreeMap[windDirNight],
      tempDay,
      tempNight,
      tempInterval: tempInterval.split('~'),
      sunset,
      sunrise,
      qualityValue,
      qualityLevel,
      qualityColor: getQualityColor(qualityLevel),
      updatetime: `${dayjs(updatetime).format('HH:mm')}更新`,
      windLevelDayInfo: getWindLevel(`${windLevelDay}`),
      windLevelNightInfo: getWindLevel(`${windLevelNight}`),
      pop,
      qpf,
      humidity,
      icon_day: `${icon_day}`,
      icon_night: `${icon_night}`,
    };
  });
  return weatherInfo;
}

function formatTipArr({
  liveIndex,
  limit = [] as any,
  toLocalWeb,
  city,
  diff,
  wishDay,
  pc_live_url, // 为flow替换链接新加的字段，线上不会找回该字段
}) {
  const formatIndexArray = [] as any;

  if (!liveIndex) {
    return [];
  }

  // 尾号限行第一个是昨天时把它过滤掉
  if (limit?.[0]?.date === dayjs().subtract(1, 'day').format('YYYY-MM-DD')) {
    limit.shift();
  }

  liveIndex.forEach(item => {
    if (!formatIndexArray[item.predict_date]) {
      formatIndexArray[item.predict_date] = [item];
    } else {
      formatIndexArray[item.predict_date].push(item);
    }
  });

  const LifeTip = formatIndexArray[wishDay] || {};
  const cityId = city?.id || 2;

  if (isEmptyObj(LifeTip)) {
    return null;
  }

  const promptMap = {
    W: '不限行',
    S: '单号',
    D: '双号',
  };

  function getTipItem(id, item) {
    const { index_level_desc, index_type } =
      item.find(subItem => Number(subItem.index_type_id) === Number(id)) || {};

    // 修改指数名称
    const indexTypeMap = {
      息斯敏过敏指数: '过敏指数',
      空气污染扩散指数: '空气污染扩散',
    };

    const urlMap = {
      穿衣指数: 'clothespoint',
      洗车指数: 'washcarpoint',
      运动指数: '',
      雨伞指数: '',
      紫外线指数: '',
      化妆指数: '',
      钓鱼指数: '',
      过敏指数: 'allergypoint',
      感冒指数: 'influenzapoint',
      空气污染扩散: '',
      交通指数: '',
      旅游指数: '',
      空调指数: '',
      蓝天指数: '',
    };

    const title = indexTypeMap[index_type] || index_type;

    const url =
      pc_live_url ||
      `https://html5.moji.com/tpd/index/index.html#/${
        urlMap[title]
      }?platform=jinritoutiao&cityid=${cityId}&ad=2&tab=${diff + 1}`;

    const Icon = require('./component/weather-tip/assets');

    return {
      desc: title,
      info: index_level_desc,
      url: urlMap[title] ? toLocalWeb(url, { use_offline: 0 }) : undefined,
      Icon: Icon[`Icon${id}`],
    };
  }

  let tipList = Object.values(formatIndexArray)?.map(item =>
    [20, 17, 26, 30, 21, 7, 28, 32, 12, 18, 5, 14, 19, 36].map(subItem =>
      getTipItem(subItem, item),
    ),
  );

  tipList = tipList.map((item, index) => {
    const limitInfo = limit?.[index]?.prompt;

    return [
      {
        desc: '尾号限行',
        info: promptMap[limitInfo] || limitInfo,
        url: toLocalWeb(
          pc_live_url ||
            `https://html5.moji.com/tpd/index/index.html#/trafficrestriction?platform=jinritoutiao&cityid=${cityId}&ad=2&tab=${
              diff + 1
            }`,
          { use_offline: 0 },
        ),
        Icon: require('./component/weather-tip/assets').Icon0,
        pos: 'liveindex_0',
      },
      ...item,
    ].filter(i => i.info && i.desc);
  });

  return tipList;
}

function formatSvgInfo({ hourly, aqiForecastHourly, forecast, conditionInfo }) {
  dayjs.extend(isBetween);

  const svgInfo = hourly.map(
    (
      {
        pop: precipitationRate,
        wind_level: windlevel,
        wind_degrees: windDegrees,
        real_feel: realFeel,
        predict_hour: hour,
        predict_date: date,
        temp,
        day: iconDay,
        icon,
        wind_dir: windDir,
        qpf,
        uvi,
        humidity,
      },
      idx,
    ) => {
      const { value: airQuality, quality_level: airQualityLevel } =
        aqiForecastHourly?.[idx] || {};
      const time = `${date} ${hour}:00`;
      const { sunrise: rise1, sunset: set1 } = forecast?.[1] || {};
      const { sunrise: rise2, sunset: set2 } = forecast?.[2] || {};
      const windInfo = windDir.match(/^[A-Za-z]+$/)
        ? windMap[windDir]
        : windDir || '暂无';

      const uviText = Object.entries(uviMap).find(item =>
        item[0].split(',').includes(uvi),
      )?.[1];

      return {
        hour,
        airQuality,
        realFeel,
        temp: `${Number(temp)}`,
        windDegrees,
        windlevel,
        precipitationRate,
        time,
        rise1,
        set1,
        rise2,
        set2,
        icon: `${icon}` || `${iconDay}`,
        windInfo,
        airQualityLevel,
        qpf: `${Number(qpf)}`,
        uvi: `${Number(uvi)}`,
        uviText,
        humidity: `${Number(humidity)}`,
      };
    },
  );

  let isDiff = false;
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const svgTime1 = svgInfo[0].time;
  const svgTime2 = svgInfo[1].time;
  if (dayjs(now).isBetween(svgTime1, svgTime2, 'second')) {
    isDiff = true;
  }

  const svgInfoUpdate = isDiff ? svgInfo : svgInfo.slice(1, svgInfo.length);

  svgInfoUpdate[0].airQuality = conditionInfo.airQuality;
  svgInfoUpdate[0].icon = conditionInfo.icon;
  svgInfoUpdate[0].airQualityLevel = conditionInfo.qualityLevel;
  svgInfoUpdate[0].windlevel = conditionInfo.windLevel;
  svgInfoUpdate[0].temp = conditionInfo.temp;
  svgInfoUpdate[0].windDir = conditionInfo.windDir;
  svgInfoUpdate[0].windInfo = conditionInfo.windDir;
  svgInfoUpdate[0].uvi = Number(conditionInfo.uvi);
  svgInfoUpdate[0].humidity = Number(conditionInfo.humidity);

  return isDiff ? svgInfo : svgInfo.slice(1, svgInfo.length);
}

function getKey({ conditionId, type, option = 2 }) {
  // 晴天 多云 分 早 中 晚 夜 4种动效
  // option 1 早  2 中 3 晚 4 夜
  const spArr = ['0', '30', '1', '31'];
  if (spArr.includes(conditionId)) {
    const sunAndCloudMap = {
      0: {
        1: 's01',
        2: 's02',
        3: 's03',
        4: 's04',
      },
      30: {
        1: 's01',
        2: 's02',
        3: 's03',
        4: 's04',
      },
      1: {
        1: 's05',
        2: 's06',
        3: 's07',
        4: 's08',
      },
      31: {
        1: 's05',
        2: 's06',
        3: 's07',
        4: 's08',
      },
    };

    return sunAndCloudMap[conditionId][option];
  }

  // type - id - three
  // 注意天气状况 是区分早晚 还是 不分早晚
  const ThreeMap = {
    day: {
      0: 's02',
      1: 's06',
      2: 's30',
      6: 's32',
      13: 's09',
      14: 's09',
      15: 's10',
      16: 's11',
      17: 's11',
      19: 's34',

      3: 's17',
      7: 's18',
      8: 's19',
      9: 's20',
      10: 's21',
      4: 's22',

      45: 's36',
      46: 's36',
      18: 's29',
      32: 's29',
      29: 's15',
      35: 's15',
      20: 's16',
      36: 's16',
    },
    night: {
      30: 's04',
      2: 's31',
      6: 's33',
      31: 's08',
      34: 's12',
      14: 's12',
      15: 's13',
      16: 's14',
      17: 's14',
      19: 's35',

      33: 's23',
      7: 's24',
      8: 's25',
      9: 's26',
      10: 's27',
      4: 's28',
      5: 's28',

      45: 's36',
      46: 's36',
      18: 's29',
      32: 's29',
      29: 's15',
      35: 's15',
      20: 's16',
      36: 's16',
    },
  };

  return (
    ThreeMap?.[type]?.[conditionId] ||
    ThreeMap?.night?.[conditionId] ||
    ThreeMap?.day?.[conditionId] ||
    's16'
  );
}

// 根据 ID 和 时间段 -> 动效对应的 key
function getThreeKey(daysInfo, conditionInfo, diff) {
  const now = dayjs();
  dayjs.extend(isSameOrBefore);
  let option = 2;
  if (diff === 0) {
    // 晴天 多云 分 早 中 晚 夜 4种动效
    // option 1 早  2 中 3 晚 4 夜
    const { sunRise: sunrise, sunSet: sunset, icon } = conditionInfo;
    const sunrise1 = dayjs(sunrise).subtract(1, 'hour');
    const sunrise2 = dayjs(sunrise).add(1, 'hour');
    const sunset1 = dayjs(sunset);
    const sunset2 = dayjs(sunset).add(2, 'hour');

    let type = 'day';

    if (now.isSameOrBefore(sunrise1)) {
      type = 'night';
      option = 4;
    } else if (now.isAfter(sunrise1) && now.isSameOrBefore(sunrise2)) {
      option = 1;
    } else if (now.isAfter(sunrise2) && now.isSameOrBefore(sunset1)) {
      option = 2;
    } else if (now.isAfter(sunset1) && now.isSameOrBefore(sunset2)) {
      option = 3;
    } else if (now.isAfter(sunset2)) {
      type = 'night';
      option = 4;
    }

    return getKey({ conditionId: icon, type, option });
  } else {
    const { conditionIdDay, conditionIdNight } = daysInfo?.[diff + 1] || {};

    // 背景动画，显示天气中较严重的一项。【沙尘>雨雪>雾霾>晴多云】
    // 如：明天天气是【多云转暴雨】，背景动画显示【暴雨】
    const weatherLevel = {
      29: 4,
      35: 4,
      20: 4,
      36: 4,

      4: 3.5,
      5: 3.5,
      10: 3.5,
      9: 3.5,
      15: 3.5,
      16: 3.5,
      17: 3.5,

      8: 3,
      7: 3,
      33: 3,
      3: 3,
      13: 3,
      14: 3,
      6: 3,
      19: 3,
      18: 2,
      32: 2,
      2: 2,
      45: 2,
      46: 3,

      0: 1,
      30: 1,
      1: 1,
      31: 1,
    };

    const dayWeatherLevel = weatherLevel[conditionIdDay];
    const nightWeatherLevel = weatherLevel[conditionIdNight];

    if (dayWeatherLevel >= nightWeatherLevel) {
      return getKey({ conditionId: conditionIdDay, type: 'day', option });
    } else {
      return getKey({ conditionId: conditionIdNight, type: 'night', option });
    }
  }
}

function getQuarter(month = new Date().getMonth()) {
  // 冬季：0
  // 春季：1
  // 夏季：2
  // 秋季：3
  let quarter: number;

  if (month === 12 || month === 11) {
    quarter = 0;
  } else {
    quarter = Math.floor((month + 1) / 3);
  }
  return quarter;
}

// 获取实时数据
function formatConditionInfo(nowInfo, aqi, customMonth) {
  const {
    real_feel: realFeel,
    sun_rise: sunRise,
    sun_down: sunSet,
    icon,
    obs_time: updatetime,
    wind_dir: windDir,
    wind_degrees: windDegrees,
    wind_level: windLevel,
    weather: condition,
    uvi,
    vis,
    humidity,
  } = nowInfo;

  let { temp } = nowInfo;
  temp = `${Number(temp)}`;

  const quarter = getQuarter(customMonth);
  const formatedVis =
    vis >= 1000 ? `${Number((vis / 1000).toFixed(1))}km` : `${vis}m`;

  const { aqi: airQuality, quality_level: qualityLevel } = aqi;

  const windLevelInfo = getWindLevel(`${windLevel}`);
  const conditionList = [
    `${windDir}${windLevel}级`,
    `体感${Number(realFeel)}℃`,
    !quarter
      ? `能见度${formatedVis}`
      : quarter === 2
      ? `紫外线${Number(uvi)}级`
      : `湿度${Number(humidity)}°`,
  ];

  return {
    realFeel,
    airQuality,
    temp,
    sunRise,
    sunSet,
    icon,
    updatetime: `${dayjs(updatetime).format('HH:mm')}更新`,
    windDir,
    windLevel,
    condition,
    windLevelInfo,
    qualityLevel,
    qualityColor: getQualityColor(qualityLevel),
    conditionList,
    uvi,
    humidity,
    windDegrees,
  };
}

// 处理天气预警信息
// 优先展示 短时预报 在 展示预警信息
function formatWeatherAlert({ alert, toLocalWeb, warningUrl }) {
  if (!alert) {
    return [];
  }
  const weatherAlert = alert.map(
    (
      {
        infoid,
        name,
        level,
        pub_time,
        href,
        text,
        // 新数据结构对应字段
        info_id,
        alert_name,
        alert_level,
        ...rest
      },
      idx,
    ) => {
      const suffix = `(${idx + 1}/${alert.length})`;
      const time = dayjs(pub_time).format('D日HH:mm');
      return {
        href: toLocalWeb(`${warningUrl}&infoid=${infoid || info_id}`),
        suffix,
        text: `${name || alert_name}${level || alert_level}预警, ${time}发布`,
        level: level || alert_level,
        idx,
        ...rest,
      };
    },
  );

  return weatherAlert.sort((a, b) => a.idx - b.idx);
}

function checkShowLiteWidget({ appId, searchJson, isAndroid }) {
  // 判断是否要展示头极的组件tips
  const toutiaoLiteAppid = 35;
  const oneMonthSecond = 30 * 24 * 60 * 60;
  const showWidgetIcon =
    isAndroid &&
    appId === toutiaoLiteAppid &&
    searchJson &&
    typeof searchJson.has_widget !== 'undefined' &&
    searchJson.has_widget !== '1';
  const showWidgetIconTips =
    showWidgetIcon &&
    new Date().getTime() / 1000 - searchJson.weather_tips_show_ts >
      oneMonthSecond;
  return { showWidgetIcon, showWidgetIconTips };
}

function format(props) {
  const { data, toLocalWeb, log, extraData } = props;
  const {
    isToutiao,
    fontSize,
    isWuKong,
    isAweme,
    isWuKongSearch,
    isDarkMode,
    isIOS,
    fullscreen,
    appId,
    searchJson,
    isAndroid,
  } = extraData || {};

  const { offsetY } = fullscreen;

  const { abFields } = extraData;
  const { card_through, customMonth } = abFields || {};
  const isOldUI = card_through === 1 || isAweme || isWuKongSearch;
  const { display } = data;
  const {
    city_data,
    time_feature: timeFeature,
    aqi_url: aqiUrl,
    weather_url: weatherUrl,
    warning_url: warningUrl,
    gps,
    aqi_data,
    live_weather_data,
    life_weather_data,
    day_weather_data,
    seven_forecast_data,
    condition_url,
    future_url, //为了给flow替换成pc链接而加的字段 线上不会召回该字段
    history_ts, //为了解决flow会用老数据+当前时间而产生读不到数据的问题加的字段 取值为发起搜索的时间
    pc_live_url, // 为了给flow替换成pc链接而加的字段 线上不会召回该字段
  } = display || {};

  const curTs = history_ts || extraData.curTs;

  const { aqi = [] } = aqi_data;

  const { city } = city_data;

  const {
    hourly,
    aqi_forecast_hourly: aqiForecastHourly = [],
    aqi_forecast: aqiForecast = [],
  } = day_weather_data;

  let { daily } = day_weather_data || {};

  // 国外城市没有daily字段 因此取seven_forecast_data字段作为daily字段展示
  if (!daily) {
    daily = seven_forecast_data?.daily;
  } else if (
    seven_forecast_data?.daily?.[0]?.predict_date !== daily?.[0]?.predict_date
  ) {
    daily = [seven_forecast_data?.daily?.[0], ...daily].filter(item => item);
  }

  const { alerts, current: nowInfo } = live_weather_data;

  const forecast = daily.slice(0, 16);

  const { index: liveIndex, limit } = life_weather_data;

  const diff = dayjs(timeFeature?.[0] || history_ts || curTs).diff(
    dayjs(history_ts || curTs).format('YYYY-MM-DD'),
    'day',
  );
  // 用户意图 搜索日期
  const wishDay = dayjs(timeFeature?.[0] || curTs).format('YYYY-MM-DD');

  const tipInfo =
    formatTipArr({
      liveIndex,
      limit,
      toLocalWeb,
      wishDay,
      city,
      diff,
      pc_live_url,
    }) || [];

  const daysInfo = formatDaysInfo({ forecast, aqiForecast, curTs });
  const conditionInfo = formatConditionInfo(nowInfo, aqi, customMonth);
  const svgInfo = formatSvgInfo({
    hourly,
    aqiForecastHourly,
    forecast,
    conditionInfo,
  });

  const curCity =
    city.name.indexOf(city.parent_names) !== -1 ||
    city.name?.length + city.parent_names?.length > 10
      ? city.name
      : city.parent_names + city.name;

  const threeKey = getThreeKey(daysInfo, conditionInfo, diff);
  const config = threeConfig[threeKey];
  const tabsBottom = config?.['tabBackground.bottom'];
  const tabsTop = config?.['tabBackground.top'];
  const date = dayjs(timeFeature?.[0] || curTs).format('M月D日');

  const showHref =
    diff !== 0
      ? future_url ||
        `https://html5.moji.com/tpd/mojiweather_h5/index.html#/weatherday?cityid=${
          city?.id || 2
        }&checkindex=${diff + 1}&platform=jnritoutiao&ad=2`
      : condition_url ||
        `https://html5.moji.com/tpd/mojiweatheraggr/index.html#/home?ad=2&platform=jinritoutiao&cityid=${
          city?.id || 2
        }`;

  const weatherAlert = formatWeatherAlert({
    alert: alerts,
    toLocalWeb,
    warningUrl,
  });

  const baseWidth = extraData?.baseWidth || 375;

  log['data-log-extra'] = JSON.stringify({
    ...JSON.parse(log['data-log-extra']),
    if_shorttime: Boolean(gps?.nowcast?.percent),
  });

  return {
    isShowSVG: diff === 0,
    date,
    diff,
    alert: weatherAlert,
    daysInfo,
    conditionInfo,
    svgInfo,
    tipInfo,
    toLocalWeb,
    city: curCity,
    aqiUrl: toLocalWeb(aqiUrl),
    warningUrl: toLocalWeb(warningUrl),
    weatherUrl: toLocalWeb(`${weatherUrl}&tab=1`, { swipe_mode: 2 }),
    showHref: toLocalWeb(showHref, { swipe_mode: 2 }),
    isSummer: getQuarter(customMonth) === 2,
    threeKey,
    tabsBottom,
    tabsTop,
    gps: gps?.nowcast?.percent ? gps : undefined,
    baseWidth: isOldUI ? baseWidth : baseWidth - 16,
    appId: extraData?.appId,
    isWuKong,
    log,
    isToutiao,
    isDarkMode,
    offsetY,
    isIOS,
    fontSize,
    fontSizeRatio: sizeMap[fontSize],
    extraData,
    curTs,
    isFlow: Boolean(history_ts), // 近似判断如果有history_ts则本卡召回环境为flow，隐藏城市转换功能
    ...checkShowLiteWidget({ appId, searchJson, isAndroid }),
  };
}

export { format, getCityList, checkShowLiteWidget };
