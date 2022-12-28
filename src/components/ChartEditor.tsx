import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, SwitchField } from 'datocms-react-ui';
import XYChart from './charts/BasicChart';
import { FieldDataType } from '../../sharedTypes';
import PieChart from './charts/PieChart';
type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function ChartEditor({ ctx }: PropTypes) {
  const saveData = (data: string | null) => {
    ctx.setFieldValue(ctx.fieldPath, data);
    ctx.notice(`${ctx.fieldPath} Saved`);
  };

  const sampleData: FieldDataType = {
    config: {
      colors: ['#5c6f82', '#BFDFFF', '#207BD6', '#004D99', '#6AAAEB'],
      direction: 'vertical',
      h: 300,
      w: 900,
      kind: 'xy',
      serieKind: 'bar',
    },
    dataSource: {
      categories: [
        'Matcha Latte',
        'Milk Tea',
        'Cheese Cocoa',
        'Walnut Brownie',
      ],
      series: [
        {
          type: 'bar',
          name: '2015',
          data: [89.3, 92.1, 24.4, 85.4],
        },
        {
          type: 'bar',
          name: '2016',
          data: [95.8, 89.4, 91.2, 76.9],
        },
        {
          type: 'bar',
          name: '2017',
          data: [32.7, 83.1, 42.5, 38.1],
        },
      ],
    },
  };

  let currentValue = JSON.parse(ctx.formValues[ctx.fieldPath] as string);

  return (
    <Canvas ctx={ctx}>
      <div>
        <Button type="button" onClick={() => saveData(null)} buttonSize="xxs">
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
      {currentValue?.dataSource && (
        <>
          {currentValue?.config.kind === 'xy' && (
            <XYChart data={currentValue} />
          )}
          {currentValue?.config.kind === 'pie' && (
            <PieChart data={currentValue} />
          )}
        </>
      )}
    </Canvas>
  );
}
