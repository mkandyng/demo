export const initialState = {
    instruments: [],
    maxMarketfeedInstruments: 5,
    marketfeedInstruments: [],
    selectedBottomLayoutTab: 0,
    intradayTimeSeries: {chartData: [],
			minValue: 0,
			maxValue: 0},
    dailyTimeSeries: {chartData: [],
		      minValue: 0,
		      maxValue: 0},
    orderbook: [],
    isLoading: false,
    selectedMarketfeedIndex: 0,
    error: null
}

