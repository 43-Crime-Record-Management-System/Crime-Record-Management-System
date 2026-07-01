package com.secure.evidenceservices.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "court_hearings")
public class CourtHearing {

    @Id
    private String id;

    private String caseId;
    private String date;
    private String court;
    private String purpose;
    private String status;  


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getCourt() { return court; }
    public void setCourt(String court) { this.court = court; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
