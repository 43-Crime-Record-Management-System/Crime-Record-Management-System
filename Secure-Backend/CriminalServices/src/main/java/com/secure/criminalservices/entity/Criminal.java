package com.secure.criminalservices.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "criminals")
public class Criminal {

    @Id
    private String id;

    private String fullName;

    private List<String> aliases; 

    private String gender;

    private LocalDate dateOfBirth;

    private String status;  

    private String mugshot;      
    private String fingerprint;  

    private String physicalDescription;

    private List<String> crimeTypes;

    private int arrestCount = 0;

    public Criminal() {}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public List<String> getAliases() {
		return aliases;
	}

	public void setAliases(List<String> aliases) {
		this.aliases = aliases;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMugshot() {
		return mugshot;
	}

	public void setMugshot(String mugshot) {
		this.mugshot = mugshot;
	}

	public String getFingerprint() {
		return fingerprint;
	}

	public void setFingerprint(String fingerprint) {
		this.fingerprint = fingerprint;
	}

	public String getPhysicalDescription() {
		return physicalDescription;
	}

	public void setPhysicalDescription(String physicalDescription) {
		this.physicalDescription = physicalDescription;
	}

	public List<String> getCrimeTypes() {
		return crimeTypes;
	}

	public void setCrimeTypes(List<String> crimeTypes) {
		this.crimeTypes = crimeTypes;
	}

	public int getArrestCount() {
		return arrestCount;
	}

	public void setArrestCount(int arrestCount) {
		this.arrestCount = arrestCount;
	}

    
}
