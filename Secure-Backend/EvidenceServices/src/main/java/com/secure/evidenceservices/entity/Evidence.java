package com.secure.evidenceservices.entity;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "evidence")

public class Evidence {

    @Id
    private String id;

    private String caseId;

    private String title;
    private String type;
    private String description;

    private String fileName;
    private String filePath;

    private String uploadedDate;

	public Evidence(String id, String caseId, String title, String type, String description, String fileName,
			String filePath, String uploadedDate) {
		super();
		this.id = id;
		this.caseId = caseId;
		this.title = title;
		this.type = type;
		this.description = description;
		this.fileName = fileName;
		this.filePath = filePath;
		this.uploadedDate = uploadedDate;
	}

	public Evidence() {
		super();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCaseId() {
		return caseId;
	}

	public void setCaseId(String caseId) {
		this.caseId = caseId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getUploadedDate() {
		return uploadedDate;
	}

	public void setUploadedDate(String uploadedDate) {
		this.uploadedDate = uploadedDate;
	}
    
}
