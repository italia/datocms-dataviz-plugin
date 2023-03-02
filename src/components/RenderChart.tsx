import { useCallback, useEffect, useState } from 'react';
import BasicChart from './charts/BasicChart';
import PieChart from './charts/PieChart';
import {
  toDataSource,
  getPieValues,
  getLineValues,
  getBarValues,
  getAvailablePalettes,
  getPalette,
} from '../lib/utils';

function RenderChart({
  chart,
  data,
  config,
  saveData,
  saveFormatted,
  formattedData,
}) {
  function transformData(d, cfg, c) {
    if (!d) return null;
    // console.log('add config');
    return toDataSource(d, cfg, c);
  }

  const [currentValue, setCurrentValue] = useState(
    transformData(data, config, chart)
  );

  useCallback(() => {
    // console.log('CHANGE');
    if (chart && data && config) {
      let value = transformData(data, config, chart);
      setCurrentValue(value);
      saveData(JSON.stringify(value));

      const formatted =
        chart === 'bar'
          ? formattedData
          : chart === 'line'
          ? getLineValues(currentValue)
          : chart === 'pie'
          ? getPieValues(currentValue)
          : null;

      console.log('DATA', formatted);
      // saveFormatted(JSON.stringify(formatted));
      // } else {
      //   saveData(null);
      // saveFormatted(null);
    }
  }, [chart, data, config]);

  return (
    <div className="w-full min-height-[800px]">
      {currentValue?.dataSource && (
        <>
          {chart === 'bar' && <BasicChart data={getBarValues(currentValue)} />}
          {chart === 'line' && (
            <BasicChart data={getLineValues(currentValue)} />
          )}
          {chart === 'pie' && <PieChart data={getPieValues(currentValue)} />}
        </>
      )}
    </div>
  );
}

export default RenderChart;
