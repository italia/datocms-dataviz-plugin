import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useRef, useEffect, useState } from "react";
import { formatTooltip } from "../../lib/utils";
import { FieldDataType } from "../../sharedTypes";

type ChartPropsType = {
  data: FieldDataType;
  id: string;
  isMobile?: boolean;
};

function GeoMapChart({ data, id, isMobile = false }: ChartPropsType) {
  const [geoData, setGeoData] = useState<any>(null);
  const refCanvas = useRef<ReactEcharts>();

  function getOptions(data: FieldDataType, geoData: any) {
    echarts.registerMap(id, geoData);
    const config: any = data.config;

    const tooltip = {
      trigger: "item",
      // valueFormatter: (value) => {
      //   return formatTooltip(value, config);
      // },
      show: config.tooltip ?? true,
      formatter: (params: any) => {
        const value = params.value;
        const name = params.name;
        const serieName = params.seriesName;
        const formattedValue = formatTooltip(value, config);
        if (serieName) {
          return `${serieName}<br/>${name} <strong>${formattedValue}</strong>`;
        }
        return `${name} <strong>${formattedValue}</strong>`;
      },
    };

    const min = Math.min(...data.dataSource.series[0].data.map((d) => d.value));
    const max = Math.max(...data.dataSource.series[0].data.map((d) => d.value));

    const options = {
      backgroundColor: config.background ? config.background : "#F2F7FC",
      color: config.colors,
      textStyle: {
        fontFamily: "Titillium Web, sans-serif",
        fontSize: 12,
      },
      tooltip,
      visualMap: {
        left: config.visualMapLeft ?? "right",
        orient: config.visualMapOrient ?? "vertical",
        min,
        max,
        text: [formatTooltip(min, config), formatTooltip(max, config)],
        calculable: false,
        inRange: {
          color: config.colors,
        },
        show: config.visualMap || false,
      },
      series: data.dataSource.series.map((serie) => {
        let otherConfig: any = {};
        if (config.serieName) {
          otherConfig = {
            name: config.serieName,
          };
        }

        return {
          ...serie,
          ...otherConfig,
          label: {
            show: config.showMapLabels ? true : false,
            color: "auto",
          },
          zoom: 1.2, //"scale",
          roam: true,
          select: { disabled: true },
          emphasis: {
            label: {
              show: config.showMapLabels,
              color: "auto",
            },
            itemStyle: {
              areaColor: config.areaColor || "#F2F7FC",
            },
          },
          map: id,
          nameProperty: config.nameProperty ? config.nameProperty : "NAME",
        };
      }),
    };
    return options;
  }

  async function getGeoData() {
    if (data) {
      const config: any = data.config;
      const url: string = config?.geoJsonUrl || "";
      if (url) {
        const response = await fetch(url);
        const raw: any = await response.json();
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
    <div style={{ textAlign: "left" }}>
      <ReactEcharts
        option={getOptions(data, geoData)}
        ref={refCanvas}
        style={{
          width: "100%",
          height: height,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default GeoMapChart;
