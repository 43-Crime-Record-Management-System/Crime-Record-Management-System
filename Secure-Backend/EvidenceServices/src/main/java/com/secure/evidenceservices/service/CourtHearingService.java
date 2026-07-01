package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.CourtHearing;

import java.util.List;

public interface CourtHearingService {

    CourtHearing addHearing(CourtHearing hearing);

    List<CourtHearing> getByCaseId(String caseId);
    CourtHearing updateStatus(String id, String status);

    void deleteHearing(String id);

}
