import { useState } from 'react';
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, SwitchField } from 'datocms-react-ui';
import { FieldDataType } from '../../sharedTypes';
import XYChart from './charts/BasicChart';
import PieChart from './charts/PieChart';
import { sampleData } from '../constants';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function ChartEditor({ ctx }: PropTypes) {
  let currentValue = JSON.parse(ctx.formValues[ctx.fieldPath] as string);
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
    console.log(file);
    if (file) {
      let formData = new FormData();
      formData.append('file', file);
      console.log(formData);
      // format file
    }
  }

  return (
    <Canvas ctx={ctx}>
      <div>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={(e) => uploadFile(e)}
        />
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
                  <Button
                    type="button"
                    onClick={() => saveData(JSON.stringify(sampleData))}
                    buttonSize="xxs"
                  >
                    Set Sample data
                  </Button>
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
