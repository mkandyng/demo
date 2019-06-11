import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getRandomInt } from "../../common/libs/utils";
import { generateMarketDataMovement } from "../../common/libs/marketfeed";
import Ticket from "./TicketView";
import InstrumentSearch from "./InstrumentSearchView";
import MarketDataView from "./MarketDataView";
import { fetchInstruments } from "../../store/actions/fetchInstruments";
import { addInstrumentToMarketfeed } from "../../store/actions/addInstrumentToMarketfeed";
import { selectInstrumentToMarketfeed } from "../../store/actions/selectInstrumentToMarketfeed";
import { updateInstrumentToMarketfeed } from "../../store/actions/updateInstrumentToMarketfeed";
import { deleteInstrumentToMarketfeed } from "../../store/actions/deleteInstrumentToMarketfeed";
import { fetchInstrumentIntradayTimeSeries} from "../../store/actions/fetchInstrumentIntradayTimeSeries";
import { fetchInstrumentDailyTimeSeries} from "../../store/actions/fetchInstrumentDailyTimeSeries";

/**
 * TopLayout root container component
 */
class TopLayoutContainer extends React.Component {
    constructor(props) {
    	super(props)
      this.flashPriceUpdate = this.flashPriceUpdate.bind(this);
    }

    componentDidMount() {
         this.props.fetchInstruments();
         setInterval(() => {
             this.flashPriceUpdate();
         }, 1000);
    }

    flashPriceUpdate(){
        const flashCount = 2;
        const instrumentIndex = getRandomInt(0, this.props.marketfeed.instruments.length);
        const randomInstrument = this.props.marketfeed.instruments[instrumentIndex];
        if(randomInstrument !== undefined) {
            const generatedInstrument = generateMarketDataMovement(randomInstrument);
            if(generatedInstrument.open !== undefined) {
                let counter = 0;
                const flashInterval = setInterval(() => {
                    counter++;
                    let instrumentPrice = generatedInstrument;
                    if(counter === flashCount) {
                        clearInterval(flashInterval);
                    } else {
                        if((counter % flashCount) !== 0) {
                            instrumentPrice = {...instrumentPrice, bid:"", ask:"" };
                        }
                    }
                    this.props.updateInstrumentToMarketfeed(instrumentPrice);
                }, 500);
            }
        }
    };

    render() {
      const { instruments,
              marketfeed,
              addInstrumentToMarketfeed,
              deleteInstrumentToMarketfeed,
              selectInstrumentToMarketfeed} = this.props;
        return (
            <div id="topLayout">
                <Ticket/>
                <div id="marketdata">
                  <InstrumentSearch
                    instruments={instruments}
                    marketfeed={marketfeed}
                    addInstrumentToMarketfeed={addInstrumentToMarketfeed}/>
                  <MarketDataView
                    instruments={instruments}
                    marketfeed={marketfeed}
                    selectInstrumentToMarketfeed={selectInstrumentToMarketfeed}
                    deleteInstrumentToMarketfeed={deleteInstrumentToMarketfeed} />
                </div>
            </div>
        )
    }
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
)(TopLayoutContainer);
