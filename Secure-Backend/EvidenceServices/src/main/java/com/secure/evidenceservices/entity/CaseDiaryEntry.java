package com.secure.evidenceservices.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "case_diary")
public class CaseDiaryEntry {

    @Id
    private String id;

    private String caseId;
    private String date;
    private String type;
    private String description;

    public CaseDiaryEntry() {}

    public CaseDiaryEntry(String caseId, String date, String type, String description) {
        this.caseId = caseId;
        this.date = date;
        this.type = type;
        this.description = description;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCaseId() {
		return caseId;
	}

	public void setCaseId(String caseId) {
		this.caseId = caseId;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

    
}
