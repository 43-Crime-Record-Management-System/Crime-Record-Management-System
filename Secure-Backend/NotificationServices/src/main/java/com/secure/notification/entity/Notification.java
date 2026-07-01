package com.secure.notification.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private Long userId;   // SHO user id

    private String title;
    private String message;

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Notification() {
		super();
	}

	public Notification(String id, Long userId, String title, String message, boolean isRead, LocalDateTime createdAt) {
		super();
		this.id = id;
		this.userId = userId;
		this.title = title;
		this.message = message;
		this.isRead = isRead;
		this.createdAt = createdAt;
	}

    
}
