package com.secure.firservices.dto;

public class UserDTO {

    private Long id;
    private String fullName;
    private String role;
    private String stationId;
	public UserDTO(Long id, String fullName, String role, String stationId) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.role = role;
		this.stationId = stationId;
	}
	public UserDTO() {
		super();
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
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getStationId() {
		return stationId;
	}
	public void setStationId(String stationId) {
		this.stationId = stationId;
	}

   
}

