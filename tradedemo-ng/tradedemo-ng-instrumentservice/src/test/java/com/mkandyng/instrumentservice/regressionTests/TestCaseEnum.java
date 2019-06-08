package com.mkandyng.instrumentservice.regressionTests;

import org.springframework.http.HttpStatus;

/**
 *
 * Regression Test cases, both happy and error path
 *
 */
public enum TestCaseEnum {
    INSTRUMENTS("/instruments", "/static/output/success/instruments_output.json", HttpStatus.OK),
    INSTRUMENT("/instruments/BABA", "/static/output/success/instruments_BABA_output.json", HttpStatus.OK),
    INSTRUMENT_QUOTE("/instrumentQuote/BABA", "/static/output/success/quote_BABA_output.json", HttpStatus.OK),
    DAILY_TIMESERIES("/dailyPrices/BABA", "/static/output/success/dailyTimeSeries_BABA_output.json", HttpStatus.OK),
    INTRADAY_TIMESERIES("/intradayPrices/BABA", "/static/output/success/intradayTimeSeries_BABA_output.json", HttpStatus.OK),
    ACTUACTOR_HEALTH_REQUEST("/actuator/health", "/static/output/success/actuator_health_output.json", HttpStatus.OK),
    ACTUACTOR_INFO_REQUEST("/actuator/info", "/static/output/success/actuator_info_output.json", HttpStatus.OK),
    ACTUACTOR_METRICS_REQUEST_REDIRECT("/actuator/metrics", "/static/output/success/actuator_info_output.json", HttpStatus.OK),
    INSTRUMENTS_INVALID_SYMBOL("/instruments/INVALID", "/static/output/failure/instruments_INVALID_output.json", HttpStatus.NOT_FOUND),
    INSTRUMENT_QUOTE_INVALID_SYMBOL("/instrumentQuote/INVALID", "/static/output/failure/quote_INVALID_output.json", HttpStatus.NOT_FOUND),
    DAILY_TIMESERIES_INVALID("/dailyPrices/INVALID", "/static/output/failure/timeSeries_INVALID_output.json", HttpStatus.NOT_FOUND),
    INTRADAY_TIMESERIES_INVALID("/intradayPrices/INVALID", "/static/output/failure/timeSeries_INVALID_output.json", HttpStatus.NOT_FOUND),
    ERROR_REQUEST("/error", "/static/output/failure/error_request_output.json", HttpStatus.NOT_FOUND),
    INVALIDURL_REQUEST("/invalidURL", "/static/output/failure/invalid_request_output.json", HttpStatus.NOT_FOUND);


    private final String restEndpoint;
    private final String expectedOutput;
    private final HttpStatus httpStatus;

    TestCaseEnum(String restEndpoint, String expectedOutput, HttpStatus httpStatus) {
        this.restEndpoint = restEndpoint;
        this.expectedOutput = expectedOutput;
        this.httpStatus = httpStatus;
    }

    public String getRestEndpoint() {
        return restEndpoint;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
