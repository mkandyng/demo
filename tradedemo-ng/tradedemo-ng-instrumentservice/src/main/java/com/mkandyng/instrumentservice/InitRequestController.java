package com.mkandyng.instrumentservice;

import com.mkandyng.instrumentservice.instrument.Instrument;
import com.mkandyng.instrumentservice.instrument.InstrumentRetrieverService;
import com.mkandyng.instrumentservice.quote.QuoteRetrieverService;
import com.mkandyng.instrumentservice.timeSeries.dailyPrice.DailyPriceTimeSeriesRetrieverService;
import com.mkandyng.instrumentservice.timeSeries.intradayPrice.IntradayPriceTimeSeriesRetrieverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RestController;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * This controller init the marketdata by calling the services so that data is cache
 * in advance of demo usage. Each of the API call cached data for 2 hours, so this scheduler
 * is run after every 125 minutes
 *
 */

@RestController
public class InitRequestController {

    private static final Logger logger = LoggerFactory.getLogger(InitRequestController.class);

    private final InstrumentRetrieverService instrumentsRetrieverService;
    private final QuoteRetrieverService quoteRetrieverService;
    private final DailyPriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService;
    private final IntradayPriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService;
    private final ScheduledExecutorService executorService;

    public InitRequestController(
            InstrumentRetrieverService instrumentsRetrieverService,
            QuoteRetrieverService quoteRetrieverService,
            DailyPriceTimeSeriesRetrieverService dailyPriceTimeSeriesRetrieverService,
            IntradayPriceTimeSeriesRetrieverService intradayPriceTimeSeriesRetrieverService) {
        this.instrumentsRetrieverService = instrumentsRetrieverService;
        this.quoteRetrieverService = quoteRetrieverService;
        this.dailyPriceTimeSeriesRetrieverService = dailyPriceTimeSeriesRetrieverService;
        this.intradayPriceTimeSeriesRetrieverService = intradayPriceTimeSeriesRetrieverService;

        executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> initMarketfeed(), 0, 125, TimeUnit.MINUTES);
    }

    private void initMarketfeed() {
        logger.info("Starting to cache marketfeed, this will take a while due to Marketfeed rate limiter");
        Set<Instrument> instruments = instrumentsRetrieverService.getInstruments();
        for(Instrument instrument: instruments) {
            try {
                quoteRetrieverService.getQuote(instrument.getSymbol());
                dailyPriceTimeSeriesRetrieverService.getTimeSeries(instrument.getSymbol());
                intradayPriceTimeSeriesRetrieverService.getTimeSeries(instrument.getSymbol());
                TimeUnit.MINUTES.sleep(1);
            } catch (Exception e) {
                logger.error("Error initialise market data", e);
            }
        }
        logger.info("Complete caching marketfeed");
    }

}