package com.secure.analyticsservices.dto;
import java.util.Map;

public class AnalyticsResponse {

    private long totalFIR;
    private long totalCriminal;
    private Map<String, Long> firStatusCount;
    private Map<String, Long> criminalStatusCount;

    public AnalyticsResponse() {}

    public long getTotalFIR() { return totalFIR; }
    public void setTotalFIR(long totalFIR) { this.totalFIR = totalFIR; }

    public long getTotalCriminal() { return totalCriminal; }
    public void setTotalCriminal(long totalCriminal) { this.totalCriminal = totalCriminal; }

    public Map<String, Long> getFirStatusCount() { return firStatusCount; }
    public void setFirStatusCount(Map<String, Long> firStatusCount) {
        this.firStatusCount = firStatusCount;
    }

    public Map<String, Long> getCriminalStatusCount() { return criminalStatusCount; }
    public void setCriminalStatusCount(Map<String, Long> criminalStatusCount) {
        this.criminalStatusCount = criminalStatusCount;
    }
}
