import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import InstrumentSearch from "./InstrumentSearch";
import MarketDataGrid from "./MarketDataGrid";
import { fetchInstruments } from "../../../store/actions/fetchInstruments";
import { addInstrumentToMarketfeed } from "../../../store/actions/addInstrumentToMarketfeed";
import { selectInstrumentToMarketfeed } from "../../../store/actions/selectInstrumentToMarketfeed";
import { updateInstrumentToMarketfeed } from "../../../store/actions/updateInstrumentToMarketfeed";
import { deleteInstrumentToMarketfeed } from "../../../store/actions/deleteInstrumentToMarketfeed";
import { fetchInstrumentIntradayTimeSeries} from "../../../store/actions/fetchInstrumentIntradayTimeSeries";
import { fetchInstrumentDailyTimeSeries} from "../../../store/actions/fetchInstrumentDailyTimeSeries";

const MarketData = function(props) {
  return (
    <div id="marketdata">
      <InstrumentSearch
        instruments={props.instruments}
        maxMarketfeedInstruments={props.maxMarketfeedInstruments}
        marketfeedInstruments={props.marketfeedInstruments}
        addInstrumentToMarketfeed={props.addInstrumentToMarketfeed}
        updateInstrumentToMarketfeed={props.updateInstrumentToMarketfeed}
        selectInstrumentToMarketfeed={props.selectInstrumentToMarketfeed}
        fetchInstruments={props.fetchInstruments}
        fetchInstrumentIntradayTimeSeries={props.fetchInstrumentIntradayTimeSeries}
        fetchInstrumentDailyTimeSeries={props.fetchInstrumentDailyTimeSeries} />
      <MarketDataGrid
        instruments={props.instruments}
        maxMarketfeedInstruments={props.maxMarketfeedInstruments}
        marketfeedInstruments={props.marketfeedInstruments}
        selectedMarketfeedIndex={props.selectedMarketfeedIndex}
        selectInstrumentToMarketfeed={props.selectInstrumentToMarketfeed}
        fetchInstrumentIntradayTimeSeries={props.fetchInstrumentIntradayTimeSeries}
        fetchInstrumentDailyTimeSeries={props.fetchInstrumentDailyTimeSeries}
        deleteInstrumentToMarketfeed={props.deleteInstrumentToMarketfeed} />
    </div>
  )
}

const mapStateToProps = state => ({ ...state });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
       addInstrumentToMarketfeed,
       fetchInstruments,
       fetchInstrumentIntradayTimeSeries,
       fetchInstrumentDailyTimeSeries,
       selectInstrumentToMarketfeed,
       updateInstrumentToMarketfeed,
       deleteInstrumentToMarketfeed
    }, dispatch);

// The HOC
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketData);
