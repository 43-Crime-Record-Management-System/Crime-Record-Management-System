package com.secure.dutyservices.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "investigation_entries")
public class InvestigationEntry {

    @Id
    private String id;

    private String firId;
    private String officerId;

    private LocalDate date;
    private String entryType; 
    private String description;

    private String status;

	public InvestigationEntry() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFirId() {
		return firId;
	}

	public void setFirId(String firId) {
		this.firId = firId;
	}

	public String getOfficerId() {
		return officerId;
	}

	public void setOfficerId(String officerId) {
		this.officerId = officerId;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getEntryType() {
		return entryType;
	}

	public void setEntryType(String entryType) {
		this.entryType = entryType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public InvestigationEntry(String id, String firId, String officerId, LocalDate date, String entryType,
			String description, String status) {
		super();
		this.id = id;
		this.firId = firId;
		this.officerId = officerId;
		this.date = date;
		this.entryType = entryType;
		this.description = description;
		this.status = status;
	}

}
