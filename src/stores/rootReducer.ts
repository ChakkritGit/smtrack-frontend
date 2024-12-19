// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import deviceSlice from "./devicesSlices"
import logSlice from "./LogsSlice"
import utilsSlice from './utilsStateSlice'
import dataArraySlices from './dataArraySlices'
import userSlice from './userSlice'
import probeSlice from './probeSlice'
import tmsDeviceSlice from './tms.deviceSlice'
import tmsDeviceLogSlice from './tms.device.log'

const combinedReducer = combineReducers({
  devices: deviceSlice,
  logs: logSlice,
  utilsState: utilsSlice,
  arraySlice: dataArraySlices,
  user: userSlice,
  probe: probeSlice,
  tmsDevice: tmsDeviceSlice,
  tmsLog: tmsDeviceLogSlice
})

const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: { type: string }) => {
  if (action.type === 'RESET') {
    state = undefined
  }
  return combinedReducer(state, action)
}

export default rootReducer
