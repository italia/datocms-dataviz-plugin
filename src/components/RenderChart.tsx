import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // console.log('CHANGE');
    if (chart && data && config) {
      let value = transformData(data, config, chart);
      setCurrentValue(value);
      saveData(JSON.stringify(value));
    }
  }, [chart, data, config]);

  if (currentValue) {
    const formatted =
      chart === 'bar'
        ? formattedData
        : chart === 'line'
        ? getLineValues(currentValue)
        : chart === 'pie'
        ? getPieValues(currentValue)
        : null;

    // console.log('DATA', formatted);
    if (formattedData != JSON.stringify(formatted)) {
      saveFormatted(JSON.stringify(formatted));
    }
  }
  return (
    <div className="w-full min-height-[800px]">
      {formattedData && (
        <>
          {chart === 'bar' && <BasicChart data={formattedData} />}
          {chart === 'line' && <BasicChart data={formattedData} />}
          {chart === 'pie' && <PieChart data={formattedData} />}
        </>
      )}
    </div>
  );
}

export default RenderChart;
