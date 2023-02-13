import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { sampleData } from './constants';
import { MatrixType } from '../sharedTypes';

let store = (set: any) => ({
  data: 0,
  chart: null,
  config: sampleData.config,
  rawData: null,
  setConfig: (value: object) => set(() => ({ config: value })),
  setChart: (value: string) => set(() => ({ chart: value })),
  setRawData: (value: any) => set(() => ({ rawData: value })),
  setData: (value: MatrixType) => set(() => ({ data: value })),
});

const useStoreState = create(devtools(store));
export default useStoreState;
