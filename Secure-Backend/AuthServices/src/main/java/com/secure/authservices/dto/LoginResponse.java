package com.secure.authservices.dto;
public class LoginResponse {

    private Long userId;   
    private String token;
    private String email;
    private String role;
    private String fullName;
    private String station;

    public LoginResponse(Long userId,
                         String token,
                         String email,
                         String role,
                         String fullName,
                         String station) {

        this.userId = userId;
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.station = station;
    }

    public Long getUserId() { return userId; }
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getFullName() { return fullName; }
    public String getStation() { return station; }
}
