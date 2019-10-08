import { primaryColor } from '../src/defaultSettings';

export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dll: true,
        hardSource: false,
        targets: {
          ie: 11,
        },
        locale: {
          enable: false, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: true,
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [{ path: '/user', component: './Welcome' }],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/welcome' },
        {
          path: '/welcome',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          name: 'mapControl',
          icon: 'block',
          path: '/mapControl',
          routes: [
            { path: '/mapControl', redirect: '/mapControl/navigator' },
            { path: '/mapControl/navigator', name: 'navigator', component: './mapControl/navigator/index' },
            { path: '/mapControl/operation', name: 'operation', component: './mapControl/operation/index' },
            { path: '/mapControl/layers', name: 'layers', component: './mapControl/layers/index' },
            { path: '/mapControl/mouse', name: 'mouse', component: './mapControl/mouse/index' },
            { path: '/mapControl/scaleLine', name: 'ScaleLine', component: './mapControl/scaleLine/index' },
            { path: '/mapControl/overviewMap', name: 'OverviewMap', component: './mapControl/overviewMap/index' },
            { path: '/mapControl/fullScreen', name: 'FullScreen', component: './mapControl/fullScreen/index' },
            { path: '/mapControl/gride', name: 'Gride', component: './mapControl/gride/index' },
            { path: '/mapControl/measure', name: 'measure', component: './mapControl/measure/index' },
          ]
        },
        {
          name: 'interaction',
          icon: 'interation',
          path: '/interaction',
          routes: [
            { path: '/interaction', redirect: '/interaction/selectMove' },
            { path: '/interaction/selectMove', name: 'selectMove', component: './interaction/selectMove/index' },
          ]
        },
        {
          name: 'draw',
          icon: 'highlight',
          path: '/draw',
          routes: [
            { path: '/draw', redirect: '/draw/bezierLine' },
            { path: '/draw/bezierLine', name: 'bezierLine', component: './draw/bezierLine/index' },
            { path: '/draw/wind', name: 'windlizi', component: './draw/wind/index' },
            { path: '/draw/animation', name: 'animation', component: './draw/animation/index' },
          ]
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};
