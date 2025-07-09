export interface Props {
  data: Data;
  extraData: any;
  [propName: string]: any;
}
export interface Data {
  keyinfo: Keyinfo;
  disable_ua: boolean;
  ala_src: string;
  vendor: number;
  preload_tma: PreloadTmaItem[];
  app_info: AppInfo;
  id_str: string;
  tokens: string[];
  empha: Empha;
  display: Display;
  id: number;
  highlight: Highlight;
  cell_type: number;
  [propName: string]: any;
}
interface Keyinfo {
  keyword: string;
  keyword_matched: string;
  ala_src: string;
  desc: string;
  intent: string;
  source: string;
  switch_route: string;
  aladdin_control_tags: string;
  data_search_type: string;
  transparam_offset: string;
  recall_engine: string;
  recall_info: string;
  filter_list: string;
  kv_pairs: string;
  name: string;
  need_retrieve_display: string;
  nlp_intent_list: string;
  transparam_count: string;
  asc: string;
  filter_ctx: string;
  [propName: string]: any;
}
interface PreloadTmaItem {
  app_id: string;
  app_type: number;
  [propName: string]: any;
}
interface AppInfo {
  query_type: string;
  [propName: string]: any;
}
interface Empha {
  [propName: string]: any;
}
interface Display {
  liveIndex: LiveIndex;
  weather_url: string;
  aqi: Aqi;
  aqiForecast: AqiForecastItem[];
  pc_aqi_url: string;
  city: City;
  forecast: ForecastItem[];
  condition: Condition;
  hourly: HourlyItem[];
  warning_url: string;
  aqiForecastHourly: AqiForecastHourlyItem[];
  aqi_url: string;
  limit: LimitItem[];
  pc_weather_url: string;
  alert: AlertItem[];
  condition_url: string;
  [propName: string]: any;
}
interface LiveIndex {
  [propName: string]: any;
}
interface Aqi {
  co: string;
  o3: string;
  o3C: string;
  pm10: string;
  pm10C: string;
  so2C: string;
  quality_level: string;
  rank: string;
  so2: string;
  value: string;
  cityName: string;
  no2: string;
  no2C: string;
  pm25: string;
  pm25C: string;
  pubtime: string;
  coC: string;
  [propName: string]: any;
}
interface AqiForecastItem {
  date: string;
  publishTime: string;
  quality_level: string;
  value: number;
  [propName: string]: any;
}
interface City {
  cityId: number;
  counname: string;
  ianatimezone: string;
  name: string;
  pname: string;
  secondaryname: string;
  timezone: string;
  [propName: string]: any;
}
interface ForecastItem {
  windDegreesDay: string;
  windDirNight: string;
  pop: string;
  tempNight: string;
  moonrise: string;
  moonset: string;
  sunset: string;
  uvi: string;
  windLevelNight: string;
  windSpeedDay: string;
  conditionNight: string;
  humidity: string;
  windDirDay: string;
  windLevelDay: string;
  windSpeedNight: string;
  qpf: string;
  windDegreesNight: string;
  conditionIdNight: string;
  moonphase: string;
  predictDate: string;
  sunrise: string;
  tempDay: string;
  updatetime: string;
  conditionDay: string;
  conditionIdDay: string;
  [propName: string]: any;
}
interface Condition {
  sunSet: string;
  tips: string;
  icon: string;
  uvi: string;
  vis: string;
  windDegrees: string;
  windLevel: string;
  updatetime: string;
  pressure: string;
  realFeel: string;
  sunRise: string;
  windDir: string;
  conditionId: string;
  humidity: string;
  temp: string;
  windSpeed: string;
  condition: string;
  [propName: string]: any;
}
interface HourlyItem {
  pressure: string;
  realFeel: string;
  temp: string;
  windDegrees: string;
  windSpeed: string;
  pop: string;
  hour: string;
  iconDay: string;
  iconNight: string;
  snow: string;
  windlevel: string;
  condition: string;
  humidity: string;
  qpf: string;
  windDir: string;
  conditionId: string;
  updatetime: string;
  uvi: string;
  date: string;
  [propName: string]: any;
}
interface AqiForecastHourlyItem {
  forecastTime: string;
  publishTime: string;
  quality_level: string;
  value: number;
  [propName: string]: any;
}
interface LimitItem {
  date: string;
  prompt: string;
  [propName: string]: any;
}
interface AlertItem {
  level: string;
  name: string;
  title: string;
  type: string;
  update_time: string;
  infoid: number;
  land_defense_id: string;
  pub_time: string;
  content: string;
  port_defense_id: string;
  [propName: string]: any;
}
interface Highlight {
  [propName: string]: any;
}
