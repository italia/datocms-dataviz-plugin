export type MatrixType = [[string | number]];

export type SerieType = {
  name: string;
  data: number[];
  type: string;
};

export type FieldDataType = {
  // config: {
  //   palette: string;
  //   colors: string[];
  //   direction: string;
  //   h: number;
  //   w: number;
  //   // kind: string;
  //   // serieKind: string;
  //   titles: string[];
  //   smooth: boolean;
  //   tooltip: boolean;
  //   legend: boolean;
  //   toolbox: boolean;
  //   zoom: string;
  //   axisPointer: string;
  // };
  config: object;
  dataSource: {
    categories: string[];
    series: SerieType[];
  };
  chart: string;
  data: MatrixType;
};
