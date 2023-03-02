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
  prevData,
  // saveFormatted,
  // formattedData,
}) {
  function transformData(d, cfg, c) {
    if (!d) return null;
    // console.log('add config');
    return toDataSource(d, cfg, c);
  }

  const [currentValue, setCurrentValue] = useState(
    transformData(data, config, chart)
  );

  useEffect(() => {
    console.log('CHANGE');
    if (chart && data && config) {
      let value = transformData(data, config, chart);
      const valueString = JSON.stringify(value);
      const prevValue = JSON.stringify(prevData);

      if (valueString !== prevValue) {
        setCurrentValue(value);
        saveData(valueString);
      }

      // const formatted =
      //   chart === 'bar'
      //     ? getBarValues(currentValue)
      //     : chart === 'line'
      //     ? getLineValues(currentValue)
      //     : chart === 'pie'
      //     ? getPieValues(currentValue)
      //     : null;
      // console.log('DATA', formatted);
      // saveFormatted(JSON.stringify(formatted));
      // } else {
      //   saveData(null);
      // saveFormatted(null);
    }
  }, [chart, data, config, prevData]);

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
