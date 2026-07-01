package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.CaseDiaryEntry;
import java.util.List;

public interface CaseDiaryService {
    CaseDiaryEntry addEntry(CaseDiaryEntry entry);
    List<CaseDiaryEntry> getByCaseId(String caseId);
}
