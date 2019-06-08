package com.mkandyng.instrumentservice.instrument;

import java.util.Objects;

/**
 * Instrument Domain object
 */

public class Instrument {

    private final String symbol;
    private final String name;
    private final String currency;

    public Instrument(String symbol, String name, String currency) {
        this.symbol = symbol;
        this.name = name;
        this.currency = currency;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public String getCurrency() {
        return currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Instrument that = (Instrument) o;
        return Objects.equals(symbol, that.symbol) &&
                Objects.equals(name, that.name) &&
                Objects.equals(currency, that.currency);
    }

    @Override
    public int hashCode() {
        return Objects.hash(symbol, name, currency);
    }

    @Override
    public String toString() {
        return "Instrument{" +
                "symbol='" + getSymbol() + '\'' +
                ", name='" + getName() + '\'' +
                ", currency='" + getCurrency() + '\'' +
                '}';
    }
}
