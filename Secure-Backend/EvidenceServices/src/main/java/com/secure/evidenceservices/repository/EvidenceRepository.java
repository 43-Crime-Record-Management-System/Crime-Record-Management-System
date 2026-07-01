package com.secure.evidenceservices.repository;

import com.secure.evidenceservices.entity.Evidence;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EvidenceRepository extends MongoRepository<Evidence, String> {
    List<Evidence> findByCaseId(String caseId);
}

