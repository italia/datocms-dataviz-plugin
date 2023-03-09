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
      console.log(`${ctx.fieldPath} Saved`);
    }
  };
  const [isTableOpen, setTableOpen] = useState<boolean>(false);
  const [isConfigOpen, setConfigOpen] = useState<boolean>(true);

  const [state, send] = useMachine(stateMachine);
  const config: any = useStoreState((state) => state.config);
  const setConfig = useStoreState((state) => state.setConfig);
  const chart = useStoreState((state) => state.chart);
  const setChart = useStoreState((state) => state.setChart);
  const data = useStoreState<MatrixType>(
    (state) => (state.data as unknown) as MatrixType
  );
  const setData = useStoreState((state) => state.setData);

  // useEffect(() => {
  //   if (currentValue.data && !data) {
  //     setData(currentValue.data);
  //     setConfig(currentValue.config);
  //     setChart(currentValue.chart);
  //     send("SETTINGS");
  //     // saveData(null);
  //   }
  // }, []);

  // useCallback(() => {
  //   if (data) {
  //     saveData(JSON.stringify({ data, config, chart }));
  //   }
  // }, [data, config, chart]);

  useEffect(() => {
    console.log("CHANGE");
    if (chart && data && config) {
      // let value = transformData(data, config, chart);
      // const value = { config: { ...sampleData, ...config }, data, chart };
      const value = withDefaults(data, config, chart);
      const valueString = JSON.stringify(value);
      const prevValue = JSON.stringify(currentValue);
      if (valueString !== prevValue) {
        console.dir(value);
        saveData(valueString);
      }
    } else if (currentValue.data && !data) {
      setData(currentValue.data);
      setConfig(currentValue.config);
      setChart(currentValue.chart);
      send("SETTINGS");
      // saveData(null);
    }
  }, [chart, data, config, currentValue]);

  function reset() {
    setData(null);
    // saveData(null);
  }

  function handleUploadData(data) {
    reset();
    setData(data);
    setTableOpen(true);
    send("CHOOSE");
  }

  function transpose() {
    setData(null);
    const transposed = transposeData(data);
    setChart("");
    setTimeout(() => {
      handleChangeData(transposed);
    }, 300);
  }

  function handleChangeData(d) {
    if (!config.palette) {
      const numSeries = d.length - 1;
      let palette = getAvailablePalettes(numSeries)[0];
      config.palette = palette;
      config.colors = getPalette(palette);
      setConfig(config);
    }
    setChart("");
    setData(d);
    send("CHOOSE");
  }
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
            <center>
              <DataTable data={data} reset={reset} transpose={transpose} />
            </center>
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
                <CSVUpload setData={(d) => handleUploadData(d)} />
              )}
              {state.matches("choose") && (
                <SelectChart chart={chart} setChart={setChart} />
              )}
              {state.matches("settings") && (
                <ChartOptions
                  config={config}
                  setConfig={setConfig}
                  chart={chart}
                  numSeries={data?.length - 1 || 0}
                />
              )}
            </div>
          </div>
        </Section>
        <hr style={{ marginBottom: 10 }} />
        {data != null && data[0] && (
          <div style={{ marginTop: 10 }}>
            <center>
              <RenderChart ds={currentValue} />
            </center>
          </div>
        )}
      </>
    </Canvas>
  );
}
