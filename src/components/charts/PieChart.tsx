import ReactEcharts from 'echarts-for-react';
import { FieldDataType } from '../../sharedTypes';

type ChartPropsType = {
  data: FieldDataType;
};

function PieChart({ data }: ChartPropsType) {
  const options = {
    title: {
      text: data.config?.titles?.join('\n') || 'PIE CHART',
      left: 'center',
      top: 'center',
    },
    color: data.config.colors,
    series: data.dataSource.series,
    textStyle: {
      fontWeight: '600',
      fontSize: 14,
    },
    tooltip: {
      show: data.config.tooltip,
    },
    legend: {
      left: 'center',
      top: 'top',
      show: data.config.legend,
    },
    // toolbox: {
    //   show: data.config.toolbox,
    //   left: 'right',
    //   top: 'top',
    //   feature: {
    //     // dataView: {},
    //     // restore: {},
    //     saveAsImage: {},
    //   },
    // },
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

export default PieChart;
