package com.stream.entitytype.logMessage;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 *
 * logMessage Entity
 *
 */

@Entity
public class LogMessage implements Serializable {
    @Id
    private String id;
    private String state;
    private String type;
    private String host;
    private long timestamp;
    private long startTime;
    private long endTime;
    private long duration;
    private boolean alert;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public long getDuration() {
        return endTime - startTime;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public boolean isAlert() {
        return alert;
    }

    public void setAlert(boolean alert) {
        this.alert = alert;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LogMessage logEntry = (LogMessage) o;
        return Objects.equals(id, logEntry.id) &&
                Objects.equals(state, logEntry.state);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, state);
    }

    @Override
    public String toString() {
        return "logMessageStreamer{" +
                "id='" + id + '\'' +
                ", state='" + state + '\'' +
                ", type='" + type + '\'' +
                ", host='" + host + '\'' +
                ", timestamp=" + timestamp +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", duration=" + duration +
                ", alert=" + alert +
                '}';
    }
}
