package com.secure.dutyservices.repository;

import com.secure.dutyservices.entity.InvestigationEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface InvestigationRepository extends MongoRepository<InvestigationEntry, String> {

    List<InvestigationEntry> findByFirId(String firId);

}

