import { useEffect, useState } from 'react';
import BasicChart from './charts/BasicChart';
import PieChart from './charts/PieChart';
import GeoMapChart from './charts/GeoMapChart';
import { sampleData } from '../lib/constants';
import {
  toDataSource,
  getPieValues,
  getBasicValues,
  getMapValues,
} from '../lib/utils';

function RenderChart({ chart, data, config, saveData, prevData }) {
  // function transformData(d, cfg, c) {
  //   if (!d) return null;
  //   return toDataSource(d, cfg, c);
  // }

  // const [currentValue, setCurrentValue] = useState(
  //   transformData(data, config, chart)
  // );

  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    console.log('CHANGE');
    if (chart && data && config) {
      // let value = transformData(data, config, chart);
      
      const value = { config: { ...sampleData, ...config }, data, chart };
      const valueString = JSON.stringify(value);
      const prevValue = JSON.stringify(prevData);

      if (valueString !== prevValue) {
        setCurrentValue(value);
        saveData(valueString);
      }
    }
  }, [chart, data, config, prevData]);

  const ds = data ? toDataSource(data, config, chart) : null;

  return (
    <div className="w-full min-height-[800px]">
      {ds && (
        <>
          {chart === 'bar' && <BasicChart data={getBasicValues(ds)} />}
          {chart === 'line' && <BasicChart data={getBasicValues(ds)} />}
          {chart === 'pie' && <PieChart data={getPieValues(ds)} />}
          {chart === 'map' && (
            <GeoMapChart data={getMapValues(ds)} id="sample" />
          )}
        </>
      )}
    </div>
  );
}

export default RenderChart;
