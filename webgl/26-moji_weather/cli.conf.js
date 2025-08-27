// 请勿随意改动
module.exports = {
  version: '0.0.1',
  base: {
    type: 'card',
    targetChannel: 'tt_search',
    templateKeyName: '26-moji_weather',
  },
  dev: {
    port: '7777',
    host: true,
    // mock_url: './mock.json',
    // default_url: {
    //   abparams: JSON.stringify({
    //     search: {
    //       api_search_content: {
    //         isWeatherNew: true,
    //         new_moji_weather: true,
    //       },
    //       deepqa_debug: 1,
    //       semantic_modeling_trace_level: 2,
    //       close_toutiao_mix_limit: 1,
    //       rank_timeout: 2000,
    //       goods_ies_recall_timeout: 5000,
    //       'toutiao.search.app_engine_ppe': 'ppe_sh_weather',
    //     },
    //   }),
    //   keyword: '北京天气',
    //   search_json: JSON.stringify({
    //     has_widget: '0',
    //     weather_tips_show_ts: 1489736108,
    //     lottery_tips_show_ts: 0,
    //   }),
    // },
    proxy: {
      '/2/wap/search': {
        // 参照http-proxy-middleware配置
        target: 'http://ic.snssdk.com',
        changeOrigin: true,
      },
    },

    // feRender: true
    // mock: {
    //     filepath: '' // 完整的搜索mock-data文件地址
    // }
  },
  // prod: {},
  // webpack: {},
  webpack_custom: {
    babelLoader: {
      includeModules: [
        'three',
        'three/examples/jsm/objects/Lensflare',
        'three/examples/jsm/WebGL',
      ],
    },
  },
};
