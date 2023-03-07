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
        min: 0,
        max: 500,
        text: ['Max', 'Min'],
        realtime: false,
        calculable: true,
        inRange: {
          color: [config.colors[0], config.colors[config.colors.length - 1]],
        },
        show: config.visualMap || false,
      },
      series: data.dataSource.series.map((serie) => {
        return {
          name: serie.name || 'GEO MAP',
          type: 'map',
          map: id,
          label: {
            show: true,
          },
          select: { disabled: true },
          emphasis: {
            // focus: "self",
            itemStyle: {
              areaColor: config.background ? config.background : '#F2F7FC',
              borderWidth: 0.5,
              color: '#fff',
            },
          },
          zoom: 1.2,
          roam: 'scale',
          nameProperty: config.nameProperty ? config.nameProperty : 'NAME',
          data: serie.data,
        };
      }),
    };
    return options;
  }

  async function getGeoData() {
    const url =
      'https://www.datocms-assets.com/88680/1678208188-europe-geojson.json';
    const response = await fetch(url);
    console.log('response', response.status);
    const raw: any = await response.json();
    // console.log('length', raw.features.length);
    setGeoData(raw);
  }

  useEffect(() => {
    getGeoData();
  }, []);

  if (!data || !geoData) return <div>Loading...</div>;

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
