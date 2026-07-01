package com.secure.evidenceservices.repository;

import com.secure.evidenceservices.entity.CaseDiaryEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CaseDiaryRepository extends MongoRepository<CaseDiaryEntry, String> {
    List<CaseDiaryEntry> findByCaseId(String caseId);

}
