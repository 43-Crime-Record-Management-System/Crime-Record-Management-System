package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.Evidence;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface EvidenceService {

    Evidence uploadEvidence(String caseId,
                            String title,
                            String type,
                            String description,
                            MultipartFile file) throws IOException;

    List<Evidence> getByCaseId(String caseId);
}
