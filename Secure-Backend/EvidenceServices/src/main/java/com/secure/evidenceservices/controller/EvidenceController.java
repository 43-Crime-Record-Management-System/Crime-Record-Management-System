package com.secure.evidenceservices.controller;

import com.secure.evidenceservices.entity.Evidence;
import com.secure.evidenceservices.service.EvidenceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "http://localhost:5173")
public class EvidenceController {

    private final EvidenceService service;

    public EvidenceController(EvidenceService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public Evidence upload(
            @RequestParam String caseId,
            @RequestParam String title,
            @RequestParam String type,
            @RequestParam String description,
            @RequestParam MultipartFile file
    ) throws IOException {

        return service.uploadEvidence(caseId, title, type, description, file);
    }

    @GetMapping("/{caseId}")
    public List<Evidence> getByCase(@PathVariable String caseId) {
        return service.getByCaseId(caseId);
    }
}
