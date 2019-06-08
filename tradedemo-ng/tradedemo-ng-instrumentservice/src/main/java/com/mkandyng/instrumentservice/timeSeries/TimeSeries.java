package com.mkandyng.instrumentservice.timeSeries;

import java.util.Objects;

/**
 * Time Series value object
 */

public class TimeSeries {

    private final String dateTime;
    private final Double open;
    private final Double high;
    private final Double low;
    private final Double close;
    private final Long volume;

    public TimeSeries(String dateTime,
                      Double open,
                      Double high,
                      Double low,
                      Double close,
                      Long volume) {
        this.dateTime = dateTime;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }

    public String getDateTime() {
        return dateTime;
    }

    public Double getOpen() {
        return open;
    }

    public Double getHigh() {
        return high;
    }

    public Double getLow() {
        return low;
    }

    public Double getClose() {
        return close;
    }

    public Long getVolume() {
        return volume;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TimeSeries that = (TimeSeries) o;
        return Objects.equals(dateTime, that.dateTime) &&
                Objects.equals(open, that.open) &&
                Objects.equals(high, that.high) &&
                Objects.equals(low, that.low) &&
                Objects.equals(close, that.close) &&
                Objects.equals(volume, that.volume);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dateTime, open, high, low, close, volume);
    }

    @Override
    public String toString() {
        return "TimeSeries{" +
                "dateTime='" + getDateTime() + '\'' +
                ", open=" + getOpen() +
                ", high=" + getHigh() +
                ", low=" + getLow() +
                ", close=" + getClose() +
                ", volume=" + getVolume() +
                '}';
    }
}

