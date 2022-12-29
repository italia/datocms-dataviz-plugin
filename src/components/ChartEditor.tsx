import { useState } from 'react';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, SwitchField } from 'datocms-react-ui';
// import { FieldDataType } from '../../sharedTypes';
import XYChart from './charts/BasicChart';
import PieChart from './charts/PieChart';
import { sampleData } from '../constants';
import Papa from 'papaparse';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function ChartEditor({ ctx }: PropTypes) {
  let currentValue = JSON.parse(ctx.formValues[ctx.fieldPath] as string);
  const [loadedData, setLoadedData] = useState(null);
  const [chartKind, setChartKind] = useState(
    currentValue?.config?.kind || null
  );
  const saveData = (data: string | null) => {
    ctx.setFieldValue(ctx.fieldPath, data);
    ctx.notice(`${ctx.fieldPath} Saved`);
  };

  function handleChangeChartKind(kind) {
    console.log('kind', kind);
    setChartKind(kind);
    currentValue.config.kind = kind;
    saveData(JSON.stringify(currentValue));
  }

  function uploadFile(event) {
    let file = event.target.files[0];

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('RESULTS DATA', results.data);
        setLoadedData(results.data);
        const data = toDataSource(results.data);
        saveData(JSON.stringify(data));
      },
    });
  }
  function transpose() {
    const transposed = loadedData[0].map((_, colIndex) =>
      loadedData.map((row) => row[colIndex])
    );
    setLoadedData(transposed);
    const data = toDataSource(transposed);
    saveData(JSON.stringify(data));
  }

  function toDataSource(parsed) {
    const categories = parsed[0].slice(1);
    const series = parsed.slice(1).map((row) => {
      const [name, ...data] = row;
      return {
        type: 'bar',
        name,
        data,
      };
    });
    const dataSource = {
      categories,
      series,
    };
    console.log('dataSource', dataSource);

    return { ...sampleData, dataSource };
  }

  return (
    <Canvas ctx={ctx}>
      <div>
        <table style={{ border: '1px solid lightgray' }}>
          {loadedData &&
            loadedData.map((row, index) => {
              return (
                <tr key={index}>
                  {row.map((cell, ii) => (
                    <td
                      key={cell}
                      style={{
                        borderLeft: ii ? '1px solid black' : '',
                        borderBottom: '1px solid black',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
        </table>
        {loadedData && <button onClick={() => transpose()}>transpose</button>}
        <div style={{ margin: '10px 0', display: 'block' }}>
          <input
            type="file"
            name="file"
            accept=".csv"
            onChange={(e) => uploadFile(e)}
          />
        </div>
        <select
          value={chartKind}
          onChange={(e) => handleChangeChartKind(e.target.value)}
        >
          <option>choose a chart type</option>
          <option value="xy">XY Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
        {chartKind && (
          <>
            {chartKind === 'pie' && <PieChart />}
            {chartKind === 'xy' && (
              <>
                <div>
                  <Button
                    type="button"
                    onClick={() => saveData(null)}
                    buttonSize="xxs"
                  >
                    Reset
                  </Button>
                  {/* <Button
                    type="button"
                    onClick={() => saveData(JSON.stringify(sampleData))}
                    buttonSize="xxs"
                  >
                    Set Sample data
                  </Button> */}
                </div>
                {currentValue?.config && (
                  <div>
                    <SwitchField
                      id="01"
                      name="Direction"
                      label="Switch direction?"
                      hint="off = horizontal, on = vertical"
                      value={
                        currentValue.config.direction
                          ? currentValue.config.direction === 'vertical'
                          : false
                      }
                      onChange={(newValue) => {
                        currentValue.config.direction = newValue
                          ? 'vertical'
                          : 'horizontal';

                        saveData(JSON.stringify(currentValue));
                      }}
                    />
                    <SwitchField
                      id="02"
                      name="SerieKind"
                      label="Bars or Lines"
                      hint="off = bars, on = lines"
                      value={
                        currentValue.config.serieKind
                          ? currentValue.config.serieKind === 'line'
                          : false
                      }
                      onChange={(newValue) => {
                        const selection = newValue ? 'line' : 'bar';
                        currentValue.config.serieKind = selection;
                        currentValue.dataSource.series = currentValue.dataSource.series.map(
                          (s) => {
                            s.type = selection;
                            return s;
                          }
                        );
                        saveData(JSON.stringify(currentValue));
                      }}
                    />
                  </div>
                )}
                {currentValue?.dataSource && <XYChart data={currentValue} />}
              </>
            )}
          </>
        )}
      </div>
    </Canvas>
  );
}
