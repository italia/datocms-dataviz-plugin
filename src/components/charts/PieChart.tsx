import ReactEcharts from "echarts-for-react";
import { FieldDataType } from "../../sharedTypes";
import { formatTooltip } from "../../lib/utils";

type ChartPropsType = {
  data: FieldDataType;
};

function getTotal(data: any) {
  return data.reduce((acc, v) => {
    return acc + Number(v.value);
  }, 0);
}

function PieChart({ data }: ChartPropsType) {
  const { dataSource } = data;
  const config: any = data.config;

  const tooltip = {
    trigger: "item",
    valueFormatter: (value) => {
      return formatTooltip(value, config);
    },
    show: config.tooltip ?? true,
  };

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
    total = formatTooltip(totale, config);
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
      top: config?.legendPosition || "bottom",
      show: config.legend ?? true,
    },
  };

  const height = config?.h || 500;
  return (
    <div style={{ textAlign: "left" }}>
      <ReactEcharts
        option={options}
        style={{
          height: height,
          width: "100%",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

export default PieChart;
