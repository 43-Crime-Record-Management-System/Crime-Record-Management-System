package com.secure.firservices.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "firs")
public class FIR {

    @Id
    private String id;

    private String fullName;
    private String contactNumber;
    private String address;

    private String incidentDate;
    private String incidentLocation;
    private String description;
    private List<String> ipcSections;

    private List<Witness> witnesses;

    private List<Suspect> suspects;
    private String rejectReason;
    private String status = "REGISTERED";
    private String assignedOfficerId;
    private String stationId;


    private LocalDateTime createdAt = LocalDateTime.now();

    public FIR() {}


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getIpcSections() { return ipcSections; }
    public void setIpcSections(List<String> ipcSections) { this.ipcSections = ipcSections; }

    public List<Witness> getWitnesses() { return witnesses; }
    public void setWitnesses(List<Witness> witnesses) { this.witnesses = witnesses; }

    public List<Suspect> getSuspects() { return suspects; }
    public void setSuspects(List<Suspect> suspects) { this.suspects = suspects; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(String assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public String getRejectReason() {
		return rejectReason;
	}

	public void setRejectReason(String rejectReason) {
		this.rejectReason = rejectReason;
	}

	public String getStationId() {
		return stationId;
	}

	public void setStationId(String stationId) {
		this.stationId = stationId;
	}

	
    
}
