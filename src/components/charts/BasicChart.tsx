import ReactEcharts from 'echarts-for-react';
import { FieldDataType } from '../../../sharedTypes';

type ChartPropsType = {
  data: FieldDataType;
};

function BasicChart({ data }: ChartPropsType) {
  const axis =
    data.config.direction === 'vertical'
      ? {
          xAxis: {
            type: 'category',
            data: data.dataSource.categories,
          },
          yAxis: {
            type: 'value',
          },
        }
      : {
          yAxis: {
            type: 'category',
            data: data.dataSource.categories,
          },
          xAxis: {
            type: 'value',
          },
        };

  const options = {
    color: data.config.colors,
    ...axis,
    series: data.dataSource.series.map((serie) => {
      return {
        ...serie,
        smooth: true,
      };
    }),
    textStyle: {
      //  fontFamily: 'Roboto Mono',
      fontWeight: 'bold',
      fontSize: 12,
    },
    tooltip: {
      // trigger: 'axis',
      // axisPointer: {
      //   type: 'cross',
      // },
    },
    legend: {
      left: 'center',
      top: 'top',
    },
    toolbox: {
      show: true,
      left: 'right',
      top: 'top',
      feature: {
        // dataView: {},
        // restore: {},
        saveAsImage: {},
      },
    },
  };

  return (
    <ReactEcharts
      option={options}
      style={{
        width: data.config.w,
        height: data.config.h,
        maxWidth: '100%',
      }}
    />
  );
}

export default BasicChart;
