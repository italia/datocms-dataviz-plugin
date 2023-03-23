import ReactEcharts from "echarts-for-react";
import { FieldDataType } from "../../sharedTypes";
import { log } from "../../lib/utils";

type ChartPropsType = {
  data: FieldDataType;
};

function getTotal(data: any) {
  return data.reduce((acc, v) => {
    return acc + Number(v.value);
  }, 0);
}
function format(value, config) {
  const formatter = config.tooltipFormatter;
  const valueFormatter = config.valueFormatter;
  let valueFormatted = value;
  if (formatter) {
    if (formatter === "percentage") {
      valueFormatted = `${value}%`;
    } else if (formatter === "currency") {
      valueFormatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    } else if (formatter === "number") {
      valueFormatted = new Intl.NumberFormat("it-IT", {
        style: "decimal",
      }).format(value);
    }
  }
  return `${valueFormatted} ${valueFormatter ? valueFormatter : ""}`;
}
function PieChart({ data }: ChartPropsType) {
  const { dataSource } = data;
  const config: any = data.config;

  const tooltip = {
    trigger: config.tooltipTrigger || "item",
    axisPointer: {
      type: config.axisPointer,
    },
    valueFormatter: (value) => {
      return format(value, config);
    },
    show: config.tooltip,
    // formatter: (params: any) => {},
  };

  log("dataSource", dataSource);
  let total = "";
  try {
    const serie: any = dataSource.series;
    let serieData: any;
    if (typeof serie === "object" && !Array.isArray(serie)) {
      serieData = serie.data;
    } else if (Array.isArray(serie)) {
      serieData = serie[0].data;
    }
    const totale = getTotal(serieData);
    total = format(totale, config);
  } catch (error) {}

  let options = {
    backgroundColor: config.background ? config.background : "#F2F7FC",
    title: {
      text: `${config?.totalLabel || "Totale"}\n${total ? total : "0"}`,
      left: "center",
      top: "center",
    },
    color: config.colors || [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
    series: {
      ...dataSource.series,
      labelLine: {
        show: config.labeLine,
      },
      label: {
        show: true,
        position: config.labeLine ? "outside" : "inside",
      },
    },
    textStyle: {
      fontFamily: "Titillium Web, sans-serif",
      fontSize: 12,
    },
    tooltip,

    legend: {
      type: "scroll",
      left: "center",
      top: "bottom",
      show: config.legend,
    },
  };

  const height = config?.h || 500;
  return (
    <ReactEcharts
      option={options}
      style={{
        height: height,
        width: "100%",
        maxWidth: "100%",
      }}
    />
  );
}

export default PieChart;
