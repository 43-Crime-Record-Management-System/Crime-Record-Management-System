package com.secure.firservices.service;

import com.secure.firservices.entity.FIR;
import java.util.List;
import java.util.Map;

public interface FIRService {

    FIR createFIR(FIR fir);

    List<FIR> getAllFIR();
    FIR getById(String id);

    FIR updateStatus(String id, String status);
    FIR assignOfficer(String id, String officerId);

    List<FIR> getByStatus(String status);
    List<FIR> getByOfficer(String officerId);
    List<FIR> searchByComplainantName(String name);
    List<FIR> getByLocation(String location);

    void deleteFIR(String id);

    public Map<String, Object> getOfficerPerformanceByEmail(String officerId, String month);

    public FIR updateStatus(String id, String status, String reason);
 
    long countByOfficer(String officerId);

    long countByOfficerAndStatus(String officerId, String status);

    List<FIR> getByOfficerAndStatus(String officerId, String status);
}
