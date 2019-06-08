package com.mkandyng.instrumentservice.instrument;

import com.mkandyng.instrumentservice.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.Set;

/**
 *
 * Rest API to retrieve instruments
 *
 */

@RestController
public class InstrumentRequestController {

    private final InstrumentRetrieverService instrumentsRetrieverService;

    public InstrumentRequestController(
            InstrumentRetrieverService instrumentsRetrieverService) {
        this.instrumentsRetrieverService = instrumentsRetrieverService;
    }

    @GetMapping(value = "/instruments")
    public Set<Instrument> instruments() {
        Set<Instrument> instruments = instrumentsRetrieverService.getInstruments();
        if(instruments.isEmpty()) {
            throw new ResourceNotFoundException("Currently no instrument available for trading");
        }
        return instruments;
    }

    @GetMapping(value = "/instruments/{symbol}")
    public Instrument instrument(@PathVariable String symbol) {
        return instruments().stream()
                .filter(instrument -> instrument.getSymbol().equals(symbol))
                .findAny().orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Instrument not found for symbol [%s]", symbol)));
    }

}