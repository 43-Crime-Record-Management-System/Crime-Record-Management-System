package com.secure.evidenceservices.controller;

import com.secure.evidenceservices.entity.CaseDiaryEntry;
import com.secure.evidenceservices.service.CaseDiaryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/case-diary")
@CrossOrigin(origins = "http://localhost:5173")
public class CaseDiaryController {

    private final CaseDiaryService service;

    public CaseDiaryController(CaseDiaryService service) {
        this.service = service;
    }

    @PostMapping
    public CaseDiaryEntry addEntry(@RequestBody CaseDiaryEntry entry) {
        return service.addEntry(entry);
    }

    @GetMapping("/{caseId}")
    public List<CaseDiaryEntry> getByCase(@PathVariable String caseId) {
        return service.getByCaseId(caseId);
    }
}
