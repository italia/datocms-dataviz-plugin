// export enum ChartKind {
//   XY = 'xy',
//   PIE = 'pie',
//   GEO = 'geo',
// }
// export enum SerieKind {
//   Line = 'line',
//   Bar = 'bar',
// }
// export enum Directions {
//   Horizontal = 'horizontal',
//   Vertical = 'vertical',
// }

export type SerieType = {
  name: string;
  data: number[];
  type: string;
};

export type FieldDataType = {
  config: {
    colors: string[];
    direction: string;
    h: number;
    w: number;
    kind: string;
    serieKind: string;
  };
  dataSource: {
    categories: string[];
    series: SerieType[];
  };
};
