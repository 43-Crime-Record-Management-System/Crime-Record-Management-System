package com.secure.authservices.dto;

public class ProfileUpdateRequest {
    private String fullName;
    private String badgeNumber;
    private String station;
	public String getFullName() {
		return fullName;
	}
	public String getBadgeNumber() {
		return badgeNumber;
	}
	public String getStation() {
		return station;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public void setBadgeNumber(String badgeNumber) {
		this.badgeNumber = badgeNumber;
	}
	public void setStation(String station) {
		this.station = station;
	}
	
}

