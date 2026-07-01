package com.secure.firservices.repository;

import com.secure.firservices.entity.FIR;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FIRRepository extends MongoRepository<FIR, String> {

    List<FIR> findByStatus(String status);

    List<FIR> findByAssignedOfficerId(String assignedOfficerId);

    List<FIR> findByIncidentLocationContainingIgnoreCase(String incidentLocation);

    List<FIR> findByFullNameContainingIgnoreCase(String fullName);

    long countByAssignedOfficerId(String assignedOfficerId);

    long countByAssignedOfficerIdAndStatus(String assignedOfficerId, String status);

    List<FIR> findByAssignedOfficerIdAndCreatedAtBetween(
            String assignedOfficerId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<FIR> findByAssignedOfficerIdAndStatus(String officerId, String status);
}