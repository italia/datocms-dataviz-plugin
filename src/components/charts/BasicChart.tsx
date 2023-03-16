import ReactEcharts from "echarts-for-react";
import { FieldDataType } from "../../sharedTypes";
import { useRef, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { Button } from "datocms-react-ui";

type ChartPropsType = {
  data: FieldDataType;
};

function BasicChart({ data }: ChartPropsType, id: string) {
  const [forceReload, setForceReload] = useState(0);
  const refCanvas = useRef<ReactEcharts>();

  function getOptions(data: FieldDataType) {
    const config: any = data.config;
    const zoom = config.zoom;
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
          yAxisIndex: [0],
          type: "inside",
        },
      ];
      const y = [
        {
          show: true,
          start: 1,
          end: 100,
          xAxisIndex: [0],
          type: "slider",
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

    let xName = config.xLabel
      ? {
          name: config.xLabel,
          nameLocation: "middle",
          nameGap: 30,
        }
      : {};
    let yName = config.yLabel
      ? {
          name: config.yLabel,
          nameLocation: "middle",
          nameGap: 30,
        }
      : {};

    const axis =
      config.direction === "vertical"
        ? {
            xAxis: {
              ...xName,
              type: "category",
              data: data.dataSource.categories,
              alignTicks: true,
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
              alignTicks: true,
            },
          }
        : {
            yAxis: {
              ...xName,
              nameRotate: 90,
              type: "category",
              data: data.dataSource.categories,
              alignTicks: true,
            },
            xAxis: {
              ...yName,
              type: "value",
              alignTicks: true,
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
        type: config.axisPointer,
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

    const options = {
      backgroundColor: config.background ? config.background : "#F2F7FC",
      color: config.colors || null,
      ...axis,
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

        // console.log('rest', rest);
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
        left: "center",
        top: "bottom",
        show: config.legend,
      },
      dataZoom,
    };
    return options;
  }

  useEffect(() => {
    if (data && refCanvas.current) {
      const options: any = getOptions(data);
      // console.log('basic chart options', options);
      refCanvas.current?.getEchartsInstance().setOption(options);
      setForceReload(forceReload + 1);
    }
  }, [data, refCanvas]);

  async function downLoadImage(element: any, id: string) {
    const echartInstance = element.getEchartsInstance();
    // // console.log('echartInstance', echartInstance);
    const base64DataUrl = echartInstance.getDataURL();

    try {
      const blob = await fetch(base64DataUrl).then((res) => res.blob());
      // // console.log('blob', blob);
      saveAs(blob, `chart-${"" + Date.now()}.png`);
    } catch (error) {
      console.log("error", error);
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
