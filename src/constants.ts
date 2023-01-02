import type { FieldDataType } from '../sharedTypes';

export const sampleData: FieldDataType = {
  config: {
    titles: [],
    colors: ['#5c6f82', '#BFDFFF', '#207BD6', '#004D99', '#6AAAEB'],
    direction: 'vertical',
    h: 300,
    w: 900,
    kind: 'xy',
    serieKind: 'bar',
  },
  dataSource: {
    categories: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
    series: [
      {
        type: 'bar',
        name: '2015',
        data: [89.3, 92.1, 24.4, 85.4],
      },
      {
        type: 'bar',
        name: '2016',
        data: [95.8, 89.4, 91.2, 76.9],
      },
      {
        type: 'bar',
        name: '2017',
        data: [32.7, 83.1, 42.5, 38.1],
      },
    ],
  },
};
