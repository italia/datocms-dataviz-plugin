import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { sampleData } from './constants';

let store = (set) => ({
  data: 0,
  chart: null,
  config: sampleData.config,
  rawData: null,
  setConfig: (value) => set(() => ({ config: value })),
  setChart: (value) => set(() => ({ chart: value })),
  setRawData: (value) => set(() => ({ rawData: value })),
  setData: (value) => set(() => ({ data: value })),
});

const useStoreState = create(devtools(store));
export default useStoreState;
