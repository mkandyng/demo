package com.mkandyng.instrumentservice.quote;

import java.util.Objects;

/**
 * Marketdata Quotes domain object
 */

public class Quote {
    private final Double open;
    private final Double high;
    private final Double low;
    private final Double price;
    private final Long volume;
    private final Double close;

    public Quote(Double open,
                 Double high,
                 Double low,
                 Double price,
                 Long volume,
                 Double close) {
        this.open = open;
        this.high = high;
        this.low = low;
        this.price = price;
        this.volume = volume;
        this.close = close;
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

    public Double getPrice() {
        return price;
    }

    public Long getVolume() {
        return volume;
    }

    public Double getClose() {
        return close;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Quote quote = (Quote) o;
        return Objects.equals(open, quote.open) &&
                Objects.equals(high, quote.high) &&
                Objects.equals(low, quote.low) &&
                Objects.equals(price, quote.price) &&
                Objects.equals(volume, quote.volume) &&
                Objects.equals(close, quote.close);
    }

    @Override
    public int hashCode() {
        return Objects.hash(open, high, low, price, volume, close);
    }

    @Override
    public String toString() {
        return "Quote{" +
                "open=" + getOpen() +
                ", high=" + getHigh() +
                ", low=" + getLow() +
                ", price=" + getPrice() +
                ", volume=" + getVolume() +
                ", close=" + getClose() +
                '}';
    }
}
