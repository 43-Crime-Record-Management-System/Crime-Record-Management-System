package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.CaseDiaryEntry;
import com.secure.evidenceservices.repository.CaseDiaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseDiaryServiceImpl implements CaseDiaryService {

    private final CaseDiaryRepository repo;

    public CaseDiaryServiceImpl(CaseDiaryRepository repo) {
        this.repo = repo;
    }

    @Override
    public CaseDiaryEntry addEntry(CaseDiaryEntry entry) {
        return repo.save(entry);
    }

    @Override
    public List<CaseDiaryEntry> getByCaseId(String caseId) {
        return repo.findByCaseId(caseId);
    }
}
