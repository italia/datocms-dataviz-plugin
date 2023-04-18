import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import { useRef, useEffect, useState } from "react";

import { log, formatTooltip } from "../../lib/utils";
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
      valueFormatter: (value) => {
        return formatTooltip(value, config);
      },
      show: config.tooltip ?? true,
    };

    const min = Math.min(...data.dataSource.series[0].data.map((d) => d.value));
    const max = Math.max(...data.dataSource.series[0].data.map((d) => d.value));

    // log("min", min);
    // log("max", max);

    const options = {
      backgroundColor: config.background ? config.background : "#F2F7FC",
      color: config.colors,
      textStyle: {
        fontFamily: "Titillium Web, sans-serif",
        fontSize: 12,
      },
      tooltip,
      visualMap: {
        left: "right",
        min,
        max,
        text: ["Max", "Min"],
        calculable: true,
        inRange: {
          color: config.colors,
        },
        show: config.visualMap || false,
      },
      series: data.dataSource.series.map((serie) => {
        return {
          ...serie,
          label: {
            show: config.showMapLabels ? true : false,
            color: "auto",
          },
          zoom: 1.2,
          // roam: "scale",
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
          name: config.serieName || "",
          map: id,
          nameProperty: config.nameProperty ? config.nameProperty : "NAME",
          // data: serie.data,
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
        log("response", response.status);
        const raw: any = await response.json();
        // log('length', raw.features.length);
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
          width: "100%", //data.config?.w,
          height: height,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default GeoMapChart;
