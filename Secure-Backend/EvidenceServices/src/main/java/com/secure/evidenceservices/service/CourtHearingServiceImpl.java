package com.secure.evidenceservices.service;

import com.secure.evidenceservices.entity.CourtHearing;
import com.secure.evidenceservices.repository.CourtHearingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourtHearingServiceImpl implements CourtHearingService {

    private final CourtHearingRepository repo;

    public CourtHearingServiceImpl(CourtHearingRepository repo) {
        this.repo = repo;
    }

    @Override
    public CourtHearing addHearing(CourtHearing hearing) {
        hearing.setStatus("Scheduled");
        return repo.save(hearing);
    }

    @Override
    public List<CourtHearing> getByCaseId(String caseId) {
        return repo.findByCaseId(caseId);
    }
    @Override
    public CourtHearing updateStatus(String id, String status) {

        CourtHearing hearing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hearing not found"));

        hearing.setStatus(status);
        return repo.save(hearing);
    }

    @Override
    public void deleteHearing(String id) {
        repo.deleteById(id);
    }

}
