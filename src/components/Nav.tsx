import { Button } from 'datocms-react-ui';
import CSVUpload from './CSVUpload';
import SelectChart from './SelectChart';
import GenerateRandomData from './GenerateRandomData';
import ChartOptions from './ChartOptions';
import LoadSource from './LoadSource';

function Nav({
  data,
  send,
  setData,
  state,
  chart,
  setChart,
  setRawData,
  config,
  setConfig,
}) {
  const navItem =
    'py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover: bg-blue-700  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75';

  const navItemActive = 'py-2 px-4 bg-white text-black font-semibold shadow-md';

  const value = state.value as string;
  return (
    <div className="flex-col bg-gray-50 items-start justify-start">
      <div className={value === 'generate' ? navItemActive : navItem}>
        <Button onClick={() => send('GEN')}>1 - GENERATE DATA</Button>
        {state.matches('generate') && (
          <div>
            <GenerateRandomData setData={setData} />
          </div>
        )}
      </div>
      <div className={value === 'transform' ? navItemActive : navItem}>
        <Button onClick={() => send('TRANSFORM')}>1 - TRANSFORM SOURCE</Button>
        {state.matches('transform') && (
          <div>
            <LoadSource setRawData={setRawData} />
          </div>
        )}
      </div>
      <div className={value === 'upload' ? navItemActive : navItem}>
        <Button onClick={() => send('UPLOAD')}>1 - UPLOAD DATA</Button>
        {state.matches('upload') && (
          <div>
            <CSVUpload setData={(d) => setData(d)} />
          </div>
        )}
      </div>
      <div className={value === 'choose' ? navItemActive : navItem}>
        <Button onClick={() => send('CHOOSE')}>2 - CHOOSE CHART</Button>
        {state.matches('choose') && (
          <div>
            <SelectChart setChart={setChart} chart={chart} />
          </div>
        )}
      </div>
      <div className={value === 'settings' ? navItemActive : navItem}>
        <Button onClick={() => send('SETTINGS')}>3 - CHART OPTIONS</Button>
        {state.matches('settings') && (
          <div>
            <ChartOptions
              config={config}
              setConfig={setConfig}
              chart={chart}
              numSeries={data?.length - 1 || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
