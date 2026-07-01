package com.secure.authservices.dto;
public class ProfileResponse {

    private String fullName;
    private String email;
    private String badgeNumber;
    private String station;
    private boolean emailAlerts;
    private boolean smsAlerts;
    private boolean darkMode;
    private String role;
    private String status;

    public ProfileResponse(String fullName,
                           String email,
                           String badgeNumber,
                           String station,
                           boolean emailAlerts,
                           boolean smsAlerts,
                           boolean darkMode,
                           String role,
                           String status) {
        this.fullName = fullName;
        this.email = email;
        this.badgeNumber = badgeNumber;
        this.station = station;
        this.emailAlerts = emailAlerts;
        this.smsAlerts = smsAlerts;
        this.darkMode = darkMode;
        this.role = role;
        this.status = status;
    }

	public String getFullName() {
		return fullName;
	}

	public String getEmail() {
		return email;
	}

	public String getBadgeNumber() {
		return badgeNumber;
	}

	public String getStation() {
		return station;
	}

	public boolean isEmailAlerts() {
		return emailAlerts;
	}

	public boolean isSmsAlerts() {
		return smsAlerts;
	}

	public boolean isDarkMode() {
		return darkMode;
	}

	public String getRole() {
		return role;
	}

	public String getStatus() {
		return status;
	}

    
}

