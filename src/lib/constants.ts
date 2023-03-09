import type { FieldDataType } from '../sharedTypes';
/*
sample: ['#5c6f82', '#BFDFFF', '#207BD6', '#004D99', '#6AAAEB'],
blue: ['#4392E0', '#207AD5', '#0066CC', '#004D99', '#004080', '#003366'],
*/
export const palettes = {
  divergente: [
    '#003366',
    '#004D99',
    '#0066CC',
    '#207AD5',
    '#4392E0',
    '#D65C70',
    '#CC334D',
    '#B32D43',
    '#992639',
    '#7A1F2E',
  ],
  divergente_b: [
    '#003366',
    '#004D99',
    '#0066CC',
    '#207AD5',
    '#4392E0',
    '#D48D22',
    '#CC7A00',
    '#B36B00',
    '#995C00',
    '#804D00',
  ],
  categorica: [
    '#0066CC',
    '#CC7A00',
    '#05615E',
    '#992639',
    '#4392E0',
    '#661A26',
    '#09AFA9',
    '#2F475E',
    '#B32D43',
    '#737373',
  ],

  _1_a: ['#0066CC'],
  _1_b: ['#004080'],
  _1_c: ['#2F475E'],

  _2_a: ['#0066CC', '#CC7A00'],
  _2_b: ['#0066CC', '#B32D43'],
  _2_c: ['#05615E', '#CC7A00'],
  _2_d: ['#05615E', '#B32D43'],
  _2_e: ['#CC7A00', '#09AFA9'],

  _3_a: ['#0066CC', '#B32D43', '#CC7A00'],
  _3_b: ['#09AFA9', '#4392E0', '#CC7A00'],
  _3_c: ['#2F475E', '#4392E0', '#CC7A00'],

  _4_a: ['#0066CC', '#4392E0', '#CC7A00', '#B32D43'],
  _4_b: ['#2F475E', '#737373', '#B32D43', '#CC7A00'],
  _4_c: ['#2F475E', '#09AFA9', '#4392E0', '#B32D43'],

  _5_a: ['#0066CC', '#4392E0', '#CC7A00', '#B32D43', '#737373'],
  _5_b: ['#05615E', '#09AFA9', '4392E0', '#CC7A00', '#B32D43'],
};

export const fixedSettings = {
  axis: '#768594',
  grids: '#768594',
  backgroundColor: '#F2F7FC',
  text: {
    dark: '#1A1A1A',
    light: '#5C6F82',
    accent: '#0066CC',
  },
};

export const defaultConfig = {
  palette: '',
  colors: [],
  h: 500,
  direction: 'vertical',
  smooth: 0,
  tooltip: 1,
  legend: 1,
  stacked: false,
};

export const sampleData: FieldDataType = {
  config: defaultConfig,
  data: null,
  chart: 'bar',
  dataSource: {
    categories: [],
    series: [],
  },
};
