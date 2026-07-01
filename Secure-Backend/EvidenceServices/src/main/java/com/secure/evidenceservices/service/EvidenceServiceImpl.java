package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.Evidence;
import com.secure.evidenceservices.repository.EvidenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class EvidenceServiceImpl implements EvidenceService {

    private final EvidenceRepository repo;

    private final String uploadDir =
            System.getProperty("user.dir") + File.separator + "uploads";

    public EvidenceServiceImpl(EvidenceRepository repo) {
        this.repo = repo;
    }

    @Override
    public Evidence uploadEvidence(String caseId,
                                   String title,
                                   String type,
                                   String description,
                                   MultipartFile file) throws IOException {

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File destinationFile = new File(uploadDir + File.separator + fileName);

        file.transferTo(destinationFile);

        Evidence evidence = new Evidence();
        evidence.setCaseId(caseId);
        evidence.setTitle(title);
        evidence.setType(type);
        evidence.setDescription(description);
        evidence.setFileName(fileName);

        return repo.save(evidence);
    }

    @Override
    public List<Evidence> getByCaseId(String caseId) {
        return repo.findByCaseId(caseId);
    }
}
