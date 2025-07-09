import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#react',
    activeRule: '/react',
  },
  {
    name: 'vue-app',
    entry: '//localhost:3002',
    container: '#vue',
    activeRule: '/vue',
  },
]);

start();
