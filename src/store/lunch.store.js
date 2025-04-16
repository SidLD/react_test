
// for me zustand is the smoothest state management library, so I use it, instead of other state management 
const createLunchSlice = (set) => ({
  launches: [],
  selectedLaunch: null,
  launchpadData: null,
  failedImages: {},
  loading: false,
  searchLoading: false,
  viewLoading: false,
  hasMore: true,
  page: 1,
  searchTerm: "",
  setLaunches: (launches) => set({ launches }),
  addLaunches: (newLaunches) =>
    set((state) => ({
      launches: [...state.launches, ...newLaunches],
    })),
  setSelectedLaunch: (launch) => set({ selectedLaunch: launch }),
  setLaunchpadData: (data) => set({ launchpadData: data }),
  setLoading: (loading) => set({ loading }),
  setSearchLoading: (searchLoading) => set({ searchLoading }),
  setViewLoading: (viewLoading) => set({ viewLoading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setPage: (page) => set({ page }),
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  markImageAsFailed: (flightNumber) =>
    set((state) => ({
      failedImages: {
        ...state.failedImages,
        [flightNumber]: true,
      },
    })),
  resetState: () =>
    set({
      launches: [],
      selectedLaunch: null,
      launchpadData: null,
      loading: false,
      searchLoading: false,
      viewLoading: false,
      hasMore: true,
      page: 1,
      searchTerm: "",
    }),
})

export { createLunchSlice }
