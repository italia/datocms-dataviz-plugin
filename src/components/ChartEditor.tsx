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
// import { useMachine } from "@xstate/react";
// import stateMachine from "../lib/stateMachine";
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

  // const [state, send] = useMachine(stateMachine);
  const config: any = useStoreState((state) => state.config);
  const setConfig = useStoreState((state) => state.setConfig);
  const chart = useStoreState((state) => state.chart);
  const setChart = useStoreState((state) => state.setChart);
  const data = useStoreState<MatrixType>(
    (state) => (state.data as unknown) as MatrixType
  );
  const setAll = useStoreState((state) => state.setAll);
  const setData = useStoreState((state) => state.setData);

  const [isUploadOpen, setUploadOpen] = useState<boolean>(data ? false : true);
  const [isChooseOpen, setChooseOpen] = useState<boolean>(chart ? false : true);
  const [isConfigOpen, setConfigOpen] = useState<boolean>(false);

  function str(obj) {
    return JSON.stringify(obj);
  }

  useEffect(() => {
    if (!data && currentValue.data) {
      console.log("INIT", currentValue);
      console.log("--------");
      setAll(currentValue);
      // setTableOpen(true);
      setUploadOpen(false);
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
    setChooseOpen(false);
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
      setUploadOpen(true);
      // setTableOpen(false);
    }, 1000);
  }

  function handleUploadData(data) {
    saveData(str({ config: {}, chart: "" }));
    setTimeout(() => {
      setData(data);
      // // setTableOpen(true);
      // send("CHOOSE");
      setUploadOpen(false);
    }, 500);
  }

  function transpose() {
    // setData(null);
    const transposed = transposeData(data);
    setData(transposed);
    setChart("");
    // send("CHOOSE");
  }
  const hasData = data != null && data[0] ? true : false;
  return (
    <Canvas ctx={ctx}>
      <>
        <Section
          title="Upload"
          collapsible={{
            isOpen: isUploadOpen,
            onToggle: () => setUploadOpen((v) => !v),
          }}
        >
          <div style={{ margin: "0 20px 20px" }}>
            <CSVUpload setData={(d) => handleUploadData(d)} />
          </div>
        </Section>

        {hasData && (
          <Section
            title="Choose type"
            collapsible={{
              isOpen: isChooseOpen,
              onToggle: () => setChooseOpen((v) => !v),
            }}
          >
            <div style={{ margin: "0 20px 20px" }}>
              <SelectChart chart={chart} setChart={setChart} />
            </div>
          </Section>
        )}

        {hasData && chart && (
          <Section
            title="Config chart"
            collapsible={{
              isOpen: isConfigOpen,
              onToggle: () => setConfigOpen((v) => !v),
            }}
          >
            <div style={{ margin: "0 20px 20px" }}>
              <ChartOptions
                config={config}
                setConfig={setConfig}
                chart={chart}
                numSeries={data?.length - 1 || 0}
              />
            </div>
          </Section>
        )}

        {currentValue && currentValue.data != null && currentValue.data[0] && (
          <div style={{ marginTop: 20 }}>
            <center>
              <RenderChart ds={currentValue} />
            </center>
          </div>
        )}

        {hasData && (
          <div style={{ margin: "20px auto" }}>
            <div>
              <DataTable data={data} reset={doReset} transpose={transpose} />
            </div>
          </div>
        )}
      </>
    </Canvas>
  );
}
