package com.secure.evidenceservices.repository;

import com.secure.evidenceservices.entity.CourtHearing;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CourtHearingRepository extends MongoRepository<CourtHearing, String> {

    List<CourtHearing> findByCaseId(String caseId);
}
