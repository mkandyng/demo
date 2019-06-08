package com.mkandyng.instrumentservice.quote;

import com.mkandyng.instrumentservice.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import java.util.Optional;

/**
 *
 * Rest API to retrieve Quote
 *
 */

@RestController
public class QuoteRequestController {

    private final QuoteRetrieverService quoteRetrieverService;

    public QuoteRequestController(
            QuoteRetrieverService quoteRetrieverService) {
        this.quoteRetrieverService = quoteRetrieverService;
    }

    @GetMapping(value = "/instrumentQuote/{symbol}")
    public Quote instrumentQuote(@PathVariable String symbol) {
        return Optional.ofNullable(quoteRetrieverService.getQuote(symbol))
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("No quote found for given symbol [%s]", symbol)));
    }

}