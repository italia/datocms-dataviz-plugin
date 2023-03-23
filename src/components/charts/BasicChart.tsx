import ReactEcharts from "echarts-for-react";
import { FieldDataType } from "../../sharedTypes";
import { useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import { Button } from "datocms-react-ui";
import { log } from "../../lib/utils";

type ChartPropsType = {
  data: FieldDataType;
};

function BasicChart({ data }: ChartPropsType, id: string) {
  // const [forceReload, setForceReload] = useState(0);
  const refCanvas = useRef<ReactEcharts>();

  function getOptions(data: FieldDataType) {
    const config: any = data.config;
    let grid = {
      left: config.gridLeft || "10%",
      right: config.gridRight || "10%",
      height: config.gridHeight || "auto",
      width: config.gridWidth || "auto",
      bottom: config.gridBottom || 60,
      top: config.gridTop || 60,
    };
    log("grid", grid);
    const zoom = config.zoom || "none";
    let dataZoom = [];
    if (zoom !== "none") {
      const x = [
        {
          show: true,
          start: 1,
          end: 100,
          xAxisIndex: [0],
          type: "inside",
        },
        {
          show: true,
          start: 1,
          end: 100,
          xAxisIndex: [0],
          type: "slider",
        },
      ];
      const y = [
        {
          show: true,
          start: 1,
          end: 100,
          yAxisIndex: [0],
          type: "inside",
        },
        {
          show: true,
          start: 1,
          end: 100,
          yAxisIndex: [0],
          type: "slider",
        },
      ];

      if (zoom === "both_axis") {
        dataZoom = [...x, ...y];
      } else if (zoom === "x_axis") {
        dataZoom = [...x];
      } else if (zoom === "y_axis") {
        dataZoom = [...y];
      }
    }

    let dataZoomOpt = ["both_axis", "x_axis", "y_axis"].includes(zoom)
      ? { dataZoom }
      : {};

    log("dataZoomOpt", dataZoomOpt);

    let xName = config.xLabel
      ? {
          name: config.xLabel,
          nameLocation: "middle",
          nameGap: 50,
        }
      : {};
    let yName = config.yLabel
      ? {
          name: config.yLabel,
          nameLocation: "middle",
          nameGap: 50,
        }
      : {};

    const axis =
      config.direction === "vertical"
        ? {
            xAxis: {
              ...xName,
              type: "category",
              data: data.dataSource.categories,
              axisTick: { show: false },
              // axisLabel: {
              //   rotate: 30,
              //   inside: false,
              //   // margin: 8,
              // },
            },
            yAxis: {
              ...yName,
              nameRotate: 90,
              type: "value",
              axisTick: { show: false },
            },
          }
        : {
            yAxis: {
              ...xName,
              nameRotate: 90,
              type: "category",
              data: data.dataSource.categories,
              axisTick: { show: false },
            },
            xAxis: {
              ...yName,
              type: "value",
              axisTick: { show: false },
              // axisLabel: {
              //   rotate: 90,
              //   inside: true,
              //   margin: 0,
              // },
            },
          };

    const tooltip = {
      trigger: config.tooltipTrigger || "item",
      axisPointer: {
        type: "shadow",
      },
      valueFormatter: (value) => {
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
      },
      show: config.tooltip,
      // formatter: (params: any) => {},
    };

    let options = {
      backgroundColor: config.background ? config.background : "#F2F7FC",
      color: config.colors || null,
      ...axis,
      grid,
      series: data.dataSource.series.map((serie) => {
        let rest = { stack: false, smooth: false };
        if (config.stack) {
          let stack: any = config.stack
            ? config.direction === "vertical"
              ? "x"
              : "y"
            : false;
          rest = { ...rest, stack };
        }
        if (serie.type === "line" && config.smooth) {
          let smooth: any = config.smooth ? parseFloat(config.smooth) : false;
          rest = { ...rest, smooth };
        }
        // log('rest', rest);
        return {
          ...serie,
          ...rest,
        };
      }),
      textStyle: {
        fontFamily: "Titillium Web",
        fontSize: 12,
      },
      tooltip,
      legend: {
        type: "scroll",
        left: "center",
        top: "bottom",
        show: config.legend,
      },
      ...dataZoomOpt,
    };

    return options;
  }

  useEffect(() => {
    if (data && refCanvas.current) {
      const options: any = getOptions(data);
      log("UPDATE", options);
      refCanvas.current?.getEchartsInstance().setOption(options);
    }
  }, [data, refCanvas]);

  // useEffect(() => {
  //   if (forceReload) {
  //     refCanvas.current?.getEchartsInstance().setOption(getOptions(data));
  //   }
  // }, [forceReload]);

  async function downLoadImage(element: any, id: string) {
    const echartInstance = element.getEchartsInstance();
    // // log('echartInstance', echartInstance);
    const base64DataUrl = echartInstance.getDataURL();

    try {
      const blob = await fetch(base64DataUrl).then((res) => res.blob());
      // // log('blob', blob);
      saveAs(blob, `chart-${"" + Date.now()}.png`);
    } catch (error) {
      log("error", error);
    }
  }

  const config: any = data.config || null;
  const height = config?.h || 500;
  return (
    <>
      <ReactEcharts
        // option={getOptions(data)}
        option={{}}
        ref={refCanvas}
        style={{
          width: "100%", //data.config?.w,
          height: height,
          maxWidth: "100%",
          marginBottom: "30px",
        }}
      />
      <Button
        type="submit"
        buttonSize="xxs"
        onClick={() => downLoadImage(refCanvas.current, id)}
      >
        Download
      </Button>
    </>
  );
}

export default BasicChart;
