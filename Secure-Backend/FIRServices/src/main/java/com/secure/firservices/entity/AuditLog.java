package com.secure.firservices.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    private LocalDateTime time;
    private String user;
    private String role;
    private String action;
    private String resource;
    private String status;
    private String ip;


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
}

