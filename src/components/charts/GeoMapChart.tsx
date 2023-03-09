import ReactEcharts from 'echarts-for-react';
import { FieldDataType } from '../../sharedTypes';
import { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';

type ChartPropsType = {
  data: FieldDataType;
  id: string;
};

function GeoMapChart({ data, id }: ChartPropsType) {
  const [geoData, setGeoData] = useState<any>(null);
  const refCanvas = useRef<ReactEcharts>();

  function getOptions(data: FieldDataType, geoData: any) {
    echarts.registerMap(id, geoData);
    const config: any = data.config;

    const tooltip = {
      trigger: 'item',
      valueFormatter: (value) => {
        const formatter = config.tooltipFormatter;
        const valueFormatter = config.valueFormatter;
        let valueFormatted = value;
        if (formatter) {
          if (formatter === 'percentage') {
            valueFormatted = `${value}%`;
          } else if (formatter === 'currency') {
            valueFormatted = new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR',
            }).format(value);
          } else if (formatter === 'number') {
            valueFormatted = new Intl.NumberFormat('it-IT', {
              style: 'decimal',
            }).format(value);
          }
        }
        return `${valueFormatted} ${valueFormatter ? valueFormatter : ''}`;
      },
      show: config.tooltip,
      // formatter: (params: any) => {},
    };

    const min = Math.min(...data.dataSource.series[0].data.map((d) => d.value));
    const max = Math.max(...data.dataSource.series[0].data.map((d) => d.value));

    console.log('min', min);
    console.log('max', max);
    const options = {
      backgroundColor: config.background ? config.background : '#F2F7FC',
      color: config.colors,
      textStyle: {
        fontFamily: 'Titillium Web, sans-serif',
        fontWeight: 'semibold',
        fontSize: 12,
      },
      tooltip,
      visualMap: {
        left: 'right',
        min,
        max,
        text: ['Max', 'Min'],
        calculable: true,
        inRange: {
          color: config.colors,
        },
        show: config.visualMap || false,
      },
      series: data.dataSource.series.map((serie) => {
        return {
          ...serie,
          roam: true,
          emphasis: {
            // focus: "self",
            itemStyle: {
              areaColor: '#D3D3D3',
              borderWidth: 1,
            },
          },
          name: config.serieName || '',
          map: id,
          nameProperty: config.nameProperty ? config.nameProperty : 'NAME',
          // data: serie.data,
        };
      }),
    };
    return options;
  }

  async function getGeoData() {
    if (data) {
      const config: any = data.config;
      const url: string = config?.geoJsonUrl || '';
      if (url) {
        const response = await fetch(url);
        console.log('response', response.status);
        const raw: any = await response.json();
        // console.log('length', raw.features.length);
        setGeoData(raw);
      }
    }
  }

  useEffect(() => {
    getGeoData();
  }, [data]);

  if (!data) return <div>Caricamento...</div>;
  if (!geoData) return <div>In attesa dei dati geo...</div>;

  const config: any = data.config || null;
  const height = config?.h || 500;

  return (
    <>
      <ReactEcharts
        option={getOptions(data, geoData)}
        ref={refCanvas}
        style={{
          width: '100%', //data.config?.w,
          height: height,
          maxWidth: '100%',
        }}
      />
    </>
  );
}

export default GeoMapChart;
