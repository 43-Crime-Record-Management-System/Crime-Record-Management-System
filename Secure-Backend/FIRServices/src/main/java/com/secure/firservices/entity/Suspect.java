package com.secure.firservices.entity;
import java.util.List;

public class Suspect {

    private String suspectName;
    private String physicalDescription;
    private List<String> suspectPhotos;

    public Suspect() {}

    public String getSuspectName() { return suspectName; }
    public void setSuspectName(String suspectName) { this.suspectName = suspectName; }

    public String getPhysicalDescription() { return physicalDescription; }
    public void setPhysicalDescription(String physicalDescription) { this.physicalDescription = physicalDescription; }

    public List<String> getSuspectPhotos() { return suspectPhotos; }
    public void setSuspectPhotos(List<String> suspectPhotos) { this.suspectPhotos = suspectPhotos; }
}

