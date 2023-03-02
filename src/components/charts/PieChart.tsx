import ReactEcharts from 'echarts-for-react';
import { FieldDataType } from '../../sharedTypes';

type ChartPropsType = {
  data: FieldDataType;
};

function PieChart({ data }: ChartPropsType) {
  const { dataSource } = data;
  const config: any = data.config;
  const options = {
    title: {
      text: config?.titles?.join('\n') || 'PIE CHART',
      left: 'center',
      top: 'center',
    },
    color: config.colors,
    series: dataSource.series,
    textStyle: {
      fontWeight: '600',
      fontSize: 14,
    },
    tooltip: {
      show: config.tooltip,
    },
    legend: {
      left: 'center',
      top: 'bottom',
      show: config.legend,
    },
  };
  return (
    <ReactEcharts
      option={options}
      style={{
        width: config.w,
        height: config.h,
        maxWidth: '100%',
      }}
    />
  );
}

export default PieChart;
