import { useEffect, useState } from 'react';
import BasicChart from './charts/BasicChart';
import PieChart from './charts/PieChart';
import GeoMapChart from './charts/GeoMapChart';
import {
  toDataSource,
  getPieValues,
  getLineValues,
  getBarValues,
  getMapValues,
} from '../lib/utils';

function RenderChart({ chart, data, config, saveData, prevData }) {
  function transformData(d, cfg, c) {
    if (!d) return null;
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
          {chart === 'map' && (
            <GeoMapChart data={getMapValues(currentValue)} id="sample" />
          )}
        </>
      )}
    </div>
  );
}

export default RenderChart;
