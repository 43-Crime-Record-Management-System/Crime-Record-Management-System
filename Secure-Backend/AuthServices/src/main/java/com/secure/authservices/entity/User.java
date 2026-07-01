package com.secure.authservices.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String badgeNumber;

    private String station;

    private boolean emailAlerts;

    private boolean smsAlerts;

    private boolean darkMode = true;

    private String password;

    private String role;

    private String status;   

    public User() {
        this.role = "CITIZEN";
        this.status = "ACTIVE";
    }

  



	public User(Long id, String fullName, String email, String badgeNumber, String station, boolean emailAlerts,
			boolean smsAlerts, boolean darkMode, String password, String role, String status) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.badgeNumber = badgeNumber;
		this.station = station;
		this.emailAlerts = emailAlerts;
		this.smsAlerts = smsAlerts;
		this.darkMode = darkMode;
		this.password = password;
		this.role = role;
		this.status = status;
	}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

	public String getBadgeNumber() {
		return badgeNumber;
	}

	public void setBadgeNumber(String badgeNumber) {
		this.badgeNumber = badgeNumber;
	}

	public String getStation() {
		return station;
	}

	public void setStation(String station) {
		this.station = station;
	}

	public boolean isEmailAlerts() {
		return emailAlerts;
	}

	public void setEmailAlerts(boolean emailAlerts) {
		this.emailAlerts = emailAlerts;
	}

	public boolean isSmsAlerts() {
		return smsAlerts;
	}

	public void setSmsAlerts(boolean smsAlerts) {
		this.smsAlerts = smsAlerts;
	}

	public boolean isDarkMode() {
		return darkMode;
	}

	public void setDarkMode(boolean darkMode) {
		this.darkMode = darkMode;
	}
    
}
