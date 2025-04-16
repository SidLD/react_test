import { create } from "zustand"
import { createLunchSlice } from "./lunch.store.js"

// although i only use one slice (lunchSlice) I still use this for scaling habbit
const useStore = create((set, get) => ({
  ...createLunchSlice(set, get),
}))

export default useStore
