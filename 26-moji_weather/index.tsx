/*
天气 2.0
FE: wangsimiao.tjpu
PM: linyingting
需求文档: https://bytedance.feishu.cn/docs/doccn6JUPQhZNfFc0b20swg0d3d
UI 图: https://www.figma.com/file/TdAySnlxezeiSjQIoTayYU/%E6%B0%91%E7%94%9F%E5%B7%A5%E5%85%B7%E7%B1%BB%E9%A6%96%E5%8D%A1%E6%94%B9%E7%89%88?node-id=8231%3A4
埋点文档: https://bytedance.feishu.cn/docs/doccneW9ztnUjdToyT5sDCqYo0d
切换城市异步接口: https://i.snssdk.com/2/wap/search/extra/open_api/?from=open_api&source=open_api&alasrc=moji_weather&keyword=%E9%BD%90%E9%BD%90%E5%93%88%E5%B0%94%E5%A4%A9%E6%B0%94
*/
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CommonBox } from '@tt-search/hoc';

import { newAjax } from '@tt-search/tools';
import {
  Text,
  View,
  Flex,
  Button,
  Card,
  Tooltips as ToolTips,
} from '@lego/lego_core';
import { invoke } from '@tt-search/jsb2';

import classNames from 'classnames';
import { ExchangeFilled, ArrowFilled } from '@lego/lego_icons';
import { CityList, TravelModal as TrainModal } from '../../AladdinBase/Travel';
import { format } from './format';
import { WeatherBg } from './component/weather-bg';
import { WeatherInfo } from './component/weather-info';
import { WeatherTabs } from './component/weather-tabs';
import { WeatherAlert } from './component/weather-alert';
import { WeatherTip } from './component/weather-tip';
import { Props } from './type';

import { Survey } from './component/survey';

import styles from './index.module.less';

const weatherContext = React.createContext({});

function Weather(props: Props) {
  const {
    log,
    daysInfo,
    isShowSVG,
    svgInfo,
    tipInfo,
    tabsBottom,
    tabsTop,
    showHref,
    city,
    threeKey,
    diff,
    aqiUrl,
    weatherUrl,
    baseWidth,
    toLocalWeb,
    date,
    alert,
    isSummer,
    isWuKong,
    conditionInfo,
    isToutiao,
    isDarkMode,
    isIOS,
    offsetY,
    fontSize,
    fontSizeRatio,
    extraData,
    gps,
    showWidgetIconTips,
    showWidgetIcon,
    curTs,
    isFlow
  } = useMemo(() => format(props), []);

  const [camera, setCamera] = useState('');
  const [cityPicker, setCityPicker] = useState(false);
  const [cityList, setCityList] = useState([]);

  const [mainInfo, setMainInfo] = useState({
    curCity: city,
    curHref: showHref,
    infos: daysInfo,
    airQualityUrl: aqiUrl,
    weatherDaysUrl: weatherUrl,
    tipInfo,
    svgInfo,
    gps,
    topColors: tabsTop,
    bottomColors: tabsBottom,
    weatherAlert: alert,
    conditionInfo,
    threeKey,
  });

  const {
    temp,
    condition,
    airQuality: todayQualityValue,
    updatetime,
    qualityLevel: todayQualityLevel,
    qualityColor: todayQualityColor,
    conditionList,
  } = mainInfo.conditionInfo;

  const {
    qualityLevel,
    qualityColor,
    qualityValue,
    tempInterval,
    conditionInterval,
    windInterval,
  } = mainInfo.infos?.[diff + 1] || {};

  const compState = [] as any;
  if (isShowSVG) {
    compState.push('hasSvg');
  }
  if (mainInfo.weatherAlert) {
    compState.push('hasAlert');
  }
  if (mainInfo.gps) {
    compState.push('hasGps');
  }

  const fetchCityList = () => {
    newAjax({
      method: 'get',
      url: '/2/wap/search/extra/future_weather/options',
      crossOrigin: true,
    }).then(res => {
      if (res?.data?.list) {
        const { data } = res;
        const { list = [] } = data || {};
        setCityList(list);
      }
    });
  };

  const fetchData = name => {
    let text;
    if (diff === 0) {
      text = `${name}天气`;
    } else if (diff === 1) {
      text = `${name}明天天气`;
    } else if (diff === 2) {
      text = `${name}后天天气`;
    } else {
      text = `${date}${name}天气`;
    }

    newAjax({
      method: 'get',
      url: `/2/wap/search/extra/open_api/?from=open_api&source=open_api&alasrc=moji_weather&keyword=${text}`,
    }).then(res => {
      const { msg, data } = res;

      if (msg === 'success') {
        const display = data?.[0];
        const {
          daysInfo,
          svgInfo,
          tipInfo,
          city,
          threeKey,
          aqiUrl,
          weatherUrl,
          showHref,
          tabsBottom,
          tabsTop,
          alert,
          conditionInfo,
          gps,
        } = format({
          data: display,
          toLocalWeb,
          extraData,
          log,
        });

        setMainInfo({
          curCity: city,
          curHref: showHref,
          infos: daysInfo,
          airQualityUrl: aqiUrl,
          weatherDaysUrl: weatherUrl,
          tipInfo,
          svgInfo,
          gps,
          topColors: tabsTop,
          bottomColors: tabsBottom,
          weatherAlert: alert,
          conditionInfo,
          threeKey,
        });
      }
    });
  };

  const selectCity = cityInfo => {
    const { name } = cityInfo;
    if (mainInfo.curCity.indexOf(name) !== 0) {
      fetchData(name);
    }

    setCityPicker(false);
  };

  const renderCityList = () => {
    if (cityPicker) {
      return (
        <TrainModal
          component={CityList}
          onClose={() => {
            setTimeout(() => {
              setCityPicker(false);
            }, 300);
          }}
          cityList={cityList}
          offsetHeight={offsetY}
          selectCity={selectCity}
          extraData={extraData}
        />
      );
    }
    return null;
  };

  const handlerCityPickerOpen = useCallback(
    e => {
      if(isFlow) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState('选择城市', {} as any);
      setCityPicker(true);
    },
    [cityPicker],
  );

  useEffect(() => {
    fetchCityList();
    if (isWuKong) {
      // wukong搜热榜得金币
      invoke('onWeatherGoldCardShow', {});
    }

    if (showWidgetIconTips) {
      // 已经展示过了，要设置一下展示的时间
      window.ToutiaoJSBridgeNew?.invoke('app.setWidgetTipsShowTime', {
        key: 'weather_tips_show_ts',
        timestamp: Math.round(new Date().getTime() / 1000),
      });
    }
  }, []);

  return (
    <weatherContext.Provider
      value={{
        width: baseWidth,
        fontSize,
        fontSizeRatio,
        toLocalWeb,
        isDarkMode,
        isIOS,
        curTs,
      }}>
      <Card {...log} className="overflow-hidden" feedback={true} cr-params="">
        <WeatherBg
          threeKey={mainInfo.threeKey}
          compState={compState}
          setCamera={setCamera}>
          <View className={classNames(styles.h100)}>
            {/* 头部城市切换 */}
            <Flex justify="between" align="start" className="mx-16 mt-16">
              <View
                onClick={handlerCityPickerOpen}
                data-log-click={JSON.stringify({ pos: 'change_city' })}>
                <Text
                  size="t2"
                  color="white-darker"
                  display="block"
                  suffix={
                    !isFlow && <ExchangeFilled
                      size="s"
                      color="white-darker"
                      className={`${styles.icon} -ml-2`}
                    />
                  }>
                  {mainInfo.curCity}
                </Text>
                <Text color="white-default" size="t3">
                  {updatetime}
                </Text>
              </View>
              <Flex
                className={
                  ['l', 'xl'].includes(extraData.fontSize) ? styles.big : ''
                }>
                {showWidgetIcon ? (
                  <ToolTips
                    placement="bottom"
                    content="添加至桌面，一键查天气"
                    visible={showWidgetIconTips}
                    onClick={e => {
                      e.preventDefault();
                    }}>
                    <Button
                      type="default"
                      block={false}
                      size="xs"
                      className={styles['widget-button']}
                      color="light"
                      onClick={e => {
                        window.ToutiaoJSBridgeNew?.invoke(
                          'app.showSearchWidgetAddDialog',
                          {
                            from: 'weather',
                          },
                        );
                        e.preventDefault();
                      }}
                      prefix={<View className={styles['nail-icon']} />}>
                      桌面
                    </Button>
                  </ToolTips>
                ) : (
                  <></>
                )}

                {diff === 0 && todayQualityColor ? (
                  <Button
                    size="xs"
                    radius="m"
                    weight="medium"
                    style={{ backgroundColor: todayQualityColor }}
                    className={`${styles.button} color-white-darker`}
                    href={mainInfo.airQualityUrl}
                    data-log-click={JSON.stringify({ pos: 'air_quality' })}
                    suffix={<ArrowFilled size="xs" color="white-darker" />}>
                    {todayQualityLevel} {todayQualityValue}{' '}
                  </Button>
                ) : null}

                {diff === 0 && !todayQualityColor && qualityColor ? (
                  <Button
                    size="xs"
                    radius="m"
                    weight="medium"
                    style={{ backgroundColor: qualityColor }}
                    href={mainInfo.airQualityUrl}
                    className={`${styles.button} color-white-darker`}>
                    {qualityLevel} {qualityValue}{' '}
                  </Button>
                ) : null}
                {/* 合作方仅有今天的落地页 其他时间不进行跳转 */}
                {diff !== 0 && qualityColor ? (
                  <Button
                    size="xs"
                    radius="m"
                    weight="medium"
                    style={{ backgroundColor: qualityColor }}
                    className={`${styles.button} color-white-darker`}
                    suffix={<ArrowFilled size="xs" color="white-darker" />}>
                    {qualityLevel} {qualityValue}{' '}
                  </Button>
                ) : null}
              </Flex>
            </Flex>

            {/* 中间大数字 */}
            <View style={{ marginTop: diff === 0 ? 32 : 24 }}>
              {diff !== 0 && (
                <Flex>
                  <Text
                    size="t3"
                    color="white-darker"
                    weight="medium"
                    className="bg-white-lighter ml-16 mb-16"
                    style={{ padding: '1px 4px', borderRadius: 5 }}>
                    {diff === 1 ? '明天' : diff === 2 ? '后天' : ''} {date}
                  </Text>
                </Flex>
              )}

              <Flex
                align="center"
                href={mainInfo.curHref}
                className="mx-16 mb-8"
                data-log-click={JSON.stringify({ pos: 'condition_detail' })}>
                {Number(diff) === 0 ? (
                  <Flex
                    justify="center"
                    align="start"
                    className="flex-shrink-0">
                    <Text className={styles.todayNum} color="white-darker">
                      {temp}
                    </Text>
                    <Text className={styles.temp} color="white-darker">
                      °
                    </Text>
                  </Flex>
                ) : tempInterval.length === 1 ? (
                  <Flex
                    justify="center"
                    align="start"
                    className="flex-shrink-0">
                    <View className={styles.num} color="white-darker">
                      {tempInterval}
                    </View>
                    <Text className={styles.temp} color="white-darker">
                      °
                    </Text>
                  </Flex>
                ) : (
                  <Flex
                    justify="center"
                    align="start"
                    className="flex-shrink-0">
                    <Flex justify="center" align="center">
                      <Text className={styles.num} color="white-darker">
                        {tempInterval[0]}
                      </Text>

                      <svg
                        width="34"
                        height="12"
                        viewBox="0 0 34 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.54586 0.57143C7.21114 0.333334 7.8289 0.190475 8.39914 0.142857C8.96938 0.0476182 9.53961 0 10.1099 0C11.9631 0 13.6026 0.452381 15.0282 1.35714C16.5013 2.26191 17.8556 3.47619 19.0911 5C19.8989 6 20.7068 6.78572 21.5146 7.35714C22.37 7.88095 23.2729 8.14286 24.2233 8.14286C24.7935 8.14286 25.435 8.02381 26.1478 7.78571C27.4784 7.35714 28.4763 6.52381 29.1416 5.28571C29.8068 4 30.092 2.47619 29.9969 0.714285H33.9886C34.0836 3.33333 33.5847 5.59524 32.4917 7.5C31.4463 9.40476 29.7831 10.7381 27.5021 11.5C26.5517 11.8333 25.4825 12 24.2945 12C22.6313 12 21.1345 11.619 19.8039 10.8571C18.4734 10.0952 17.119 8.88095 15.741 7.21429C14.9331 6.26191 14.0778 5.45238 13.1749 4.78571C12.272 4.11905 11.2028 3.78572 9.96729 3.78572C9.20698 3.78572 8.49418 3.90476 7.8289 4.14286C6.54586 4.57143 5.5717 5.38095 4.90643 6.57143C4.24115 7.76191 3.95603 9.19048 4.05107 10.8571H0.0593998C-0.1782 8.2381 0.296999 6.04762 1.485 4.28571C2.72051 2.47619 4.40747 1.2381 6.54586 0.57143Z"
                          fill="white"
                          data-tt-darkmode-disable={true}
                        />
                      </svg>

                      <Text className={styles.num} color="white-darker">
                        {tempInterval[1]}
                      </Text>
                    </Flex>

                    <Text className={styles.temp} color="white-darker">
                      °
                    </Text>
                  </Flex>
                )}

                {/* 大数字 + 右侧结构化字段居中对齐。为平衡左右文字基线，右侧结构化div底部有4px预留间距 */}
                <View className="mb-8 ml-12">
                  {diff === 0 ? (
                    <Flex
                      align="center"
                      className="mb-4 overflow-hidden"
                      wrap="wrap"
                      style={{
                        height: 28 * fontSizeRatio,
                        lineHeight: `${28 * fontSizeRatio}px`,
                      }}>
                      <Text
                        style={{
                          height: 28 * fontSizeRatio,
                          lineHeight: `${28 * fontSizeRatio}px`,
                        }}
                        size="h2"
                        color="white-darker"
                        weight="medium"
                        className="mr-12 flex-shrink-0">
                        {condition}
                      </Text>
                      <Text
                        style={{
                          height: 28 * fontSizeRatio,
                          lineHeight: `${28 * fontSizeRatio}px`,
                        }}
                        size="h2"
                        weight="medium"
                        color="white-darker"
                        className="flex-shrink-0">
                        {tempInterval.join('~')}℃
                      </Text>
                    </Flex>
                  ) : (
                    <View>
                      <Text
                        size="t2"
                        color="white-darker"
                        weight="medium"
                        className="mr-12">
                        {conditionInterval}
                      </Text>
                      <Text size="t2" weight="medium" color="white-darker">
                        {windInterval.replace(' ', '')}
                      </Text>
                    </View>
                  )}
                  <Flex justify="center" align="center">
                    {Number(diff) === 0 && (
                      <Flex
                        wrap="wrap"
                        align="center"
                        className="overflow-hidden"
                        style={{
                          height: 18 * fontSizeRatio,
                          lineHeight: `${18 * fontSizeRatio}px`,
                        }}>
                        {conditionList.map((item, index) => (
                          <Flex
                            align="center"
                            key={index}
                            style={{
                              height: 18 * fontSizeRatio,
                              lineHeight: `${18 * fontSizeRatio}px`,
                            }}>
                            <Text
                              className={classNames(
                                {
                                  'border-white-light border-solid border-l':
                                    index,
                                  'pl-12': index,
                                  'pr-12': index !== 2,
                                },
                                'flex-shrink-0',
                              )}
                              style={{ lineHeight: '12px' }}
                              size="t3"
                              color="white-darker">
                              {item}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    )}
                  </Flex>
                </View>
              </Flex>
            </View>
            {(mainInfo.weatherAlert?.length && diff === 0) || mainInfo.gps ? (
              <WeatherAlert
                alert={mainInfo.weatherAlert}
                popupContent={mainInfo.weatherAlert.slice()}
                color={mainInfo.topColors}
                gps={mainInfo.gps}
              />
            ) : null}
          </View>

          {isShowSVG && (
            <View className={'visible'}>
              <WeatherTabs
                isSummer={isSummer}
                svgInfo={mainInfo.svgInfo}
                topColors={mainInfo.topColors}
                bottomColors={mainInfo.bottomColors}
                camera={camera}
              />
            </View>
          )}
          <WeatherInfo
            arr={mainInfo.infos}
            url={mainInfo.weatherDaysUrl}
            diff={diff}
            weatherContext={weatherContext}
          />
        </WeatherBg>

        <Card.Footer space={12} data-log-click={JSON.stringify({ pos: 'cp' })}>
          本查询服务由墨迹天气提供
        </Card.Footer>

        {renderCityList()}
      </Card>
      {Boolean(mainInfo.tipInfo) && Boolean(mainInfo.tipInfo?.length) && (
        <WeatherTip log={log} tips={mainInfo.tipInfo} diff={diff} />
      )}
      {/* 添加 feelgood */}
      {isToutiao ? <Survey {...props} /> : null}
    </weatherContext.Provider>
  );
}

export default CommonBox(Weather);

export { weatherContext };
