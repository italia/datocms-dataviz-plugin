import { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  Button,
  SwitchField,
  Toolbar,
  ToolbarTitle,
  ToolbarStack,
  ButtonGroup,
  ButtonGroupButton,
  Section,
} from "datocms-react-ui";
import { useMachine } from "@xstate/react";

import stateMachine from "../lib/stateMachine";
import useStoreState from "../lib/store";
import {
  getAvailablePalettes,
  getPalette,
  transposeData,
  withDefaults,
} from "../lib/utils";

import DataTable from "../components/DataTable";
import RenderChart from "../components/RenderChart";
import CSVUpload from "../components/CSVUpload";
import ChartOptions from "../components/ChartOptions";
import SelectChart from "../components/SelectChart";

import { MatrixType } from "../sharedTypes";
import { useState, useEffect, useCallback } from "react";

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function ChartEditor({ ctx }: PropTypes) {
  const currentValue = JSON.parse(ctx.formValues[ctx.fieldPath] as string);
  const saveData = (data: string | null) => {
    console.log("???");
    if (JSON.stringify(currentValue) !== data) {
      ctx.setFieldValue(ctx.fieldPath, data);
      // ctx.notice(`${ctx.fieldPath} Saved`);
      console.log(`${ctx.fieldPath} SAVED`);
    }
  };
  const [isTableOpen, setTableOpen] = useState<boolean>(false);
  const [isConfigOpen, setConfigOpen] = useState<boolean>(false);
  // const [isUploadOpen, setUploadOpen] = useState<boolean>(false);
  // const [isChooseOpen, setChooseOpen] = useState<boolean>(false);
  // const [isPreviewOpen, setPreviewOpen] = useState<boolean>(true);

  const [state, send] = useMachine(stateMachine);
  const config: any = useStoreState((state) => state.config);
  const setConfig = useStoreState((state) => state.setConfig);
  const chart = useStoreState((state) => state.chart);
  const setChart = useStoreState((state) => state.setChart);
  const data = useStoreState<MatrixType>(
    (state) => (state.data as unknown) as MatrixType
  );
  const setAll = useStoreState((state) => state.setAll);
  const setData = useStoreState((state) => state.setData);

  // useEffect(() => {
  //   console.log("CHANGE");
  //   if (chart && data && config) {
  //     const value = withDefaults(data, config, chart);
  //     const valueString = JSON.stringify(value);
  //     const prevValue = JSON.stringify(currentValue);
  //     if (valueString !== prevValue) {
  //       console.dir(value);
  //       saveData(valueString);
  //     }
  //   } else if (currentValue.data && !data) {
  //     setData(currentValue.data);
  //     setConfig(currentValue.config);
  //     setChart(currentValue.chart);
  //     send("SETTINGS");
  //     // saveData(null);
  //   }
  // }, [chart, data, config, currentValue]);

  function str(obj) {
    return JSON.stringify(obj);
  }

  useEffect(() => {
    if (!data && currentValue.data) {
      console.log("INIT", currentValue);
      console.log("--------");
      setAll(currentValue);
    } else if (data) {
      console.log("SET DATA");
      const valueString = JSON.stringify(data);
      const prevValue = JSON.stringify(currentValue?.data || "");
      if (valueString !== prevValue) {
        saveData(str({ chart: "", config: {}, data }));
        setChart("");
        setConfig({});
      }
    }
  }, [data]);

  useEffect(() => {
    if (chart && chart !== currentValue?.chart) {
      saveData(str({ chart, config: {}, data }));
      setConfig({});
    }
  }, [chart]);

  useEffect(() => {
    if (config && data) {
      console.log("SET CONFIG");
      saveData(str({ chart, config, data }));
    }
  }, [config, data]);

  function doReset() {
    saveData(str({ config: {}, chart: "" }));
    setTimeout(() => {
      setData(null);
      send("UPLOAD");
    }, 500);
  }

  function handleUploadData(data) {
    saveData(str({ config: {}, chart: "" }));
    setTimeout(() => {
      setData(data);
      setTableOpen(true);
      send("CHOOSE");
    }, 500);
  }

  function transpose() {
    // setData(null);
    const transposed = transposeData(data);
    setData(transposed);
    setChart("");
    send("CHOOSE");
  }

  // function handleChangeData(d) {
  //   if (!config.palette) {
  //     const numSeries = d.length - 1;
  //     let palette = getAvailablePalettes(numSeries)[0];
  //     config.palette = palette;
  //     config.colors = getPalette(palette);
  //     setConfig(config);
  //   }
  //   setChart("");
  //   setData(d);
  //   send("CHOOSE");
  // }
  // const stateValue = state.value as string;

  return (
    <Canvas ctx={ctx}>
      <>
        {data != null && data[0] && (
          <Section
            title="Data Table"
            collapsible={{
              isOpen: isTableOpen,
              onToggle: () => setTableOpen((v) => !v),
            }}
          >
            <div>
              <DataTable data={data} reset={doReset} transpose={transpose} />
            </div>
          </Section>
        )}
        <Section
          title="Configure Chart"
          collapsible={{
            isOpen: isConfigOpen,
            onToggle: () => setConfigOpen((v) => !v),
          }}
        >
          <Toolbar>
            <ToolbarStack stackSize="l">
              <ToolbarTitle>Setup Chart</ToolbarTitle>
              <div style={{ flex: "1" }} />
              <ButtonGroup>
                <ButtonGroupButton
                  selected={state.matches("upload")}
                  onClick={() => send("UPLOAD")}
                >
                  Upload
                </ButtonGroupButton>
                <ButtonGroupButton
                  selected={state.matches("choose")}
                  onClick={() => send("CHOOSE")}
                >
                  Choose
                </ButtonGroupButton>
                <ButtonGroupButton
                  selected={state.matches("settings")}
                  onClick={() => send("SETTINGS")}
                >
                  Configure
                </ButtonGroupButton>
              </ButtonGroup>
            </ToolbarStack>
          </Toolbar>
          <div
            style={{
              flex: "1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff", //'var(--light-bg-color)',
              padding: "10px",
            }}
          >
            <div>
              {state.matches("upload") && (
                <div style={{ margin: "0 20px 40px" }}>
                  <CSVUpload setData={(d) => handleUploadData(d)} />
                </div>
              )}
              {state.matches("choose") && (
                <div style={{ margin: "0 20px 40px" }}>
                  <SelectChart chart={chart} setChart={setChart} />
                </div>
              )}
              {state.matches("settings") && (
                <div style={{ margin: "0 20px 40px" }}>
                  <ChartOptions
                    config={config}
                    setConfig={setConfig}
                    chart={chart}
                    numSeries={data?.length - 1 || 0}
                  />
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* <Section
          title="Upload file"
          collapsible={{
            isOpen: isUploadOpen,
            onToggle: () => setUploadOpen((v) => !v),
          }}
        >
          <div style={{ margin: "0 20px 40px" }}>
            <CSVUpload setData={(d) => handleUploadData(d)} />
          </div>
        </Section>

        <Section
          title="Choose type"
          collapsible={{
            isOpen: isChooseOpen,
            onToggle: () => setChooseOpen((v) => !v),
          }}
        >
          <div style={{ margin: "0 20px 40px" }}>
            <SelectChart chart={chart} setChart={setChart} />
          </div>
        </Section>

        <Section
          title="Config chart"
          collapsible={{
            isOpen: isConfigOpen,
            onToggle: () => setConfigOpen((v) => !v),
          }}
        >
          <div style={{ margin: "0 20px 40px" }}>
            <ChartOptions
              config={config}
              setConfig={setConfig}
              chart={chart}
              numSeries={data?.length - 1 || 0}
            />
          </div>
        </Section> */}

        {currentValue && currentValue.data != null && currentValue.data[0] && (
          // <Section
          //   title="Preview"
          //   collapsible={{
          //     isOpen: isPreviewOpen,
          //     onToggle: () => setPreviewOpen((v) => !v),
          //   }}
          // >
          <div style={{ marginTop: 20 }}>
            <center>
              <RenderChart ds={currentValue} />
            </center>
          </div>
          // </Section>
        )}
      </>
    </Canvas>
  );
}
