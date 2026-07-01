package com.secure.dutyservices.service;

import com.secure.dutyservices.entity.InvestigationEntry;
import com.secure.dutyservices.repository.InvestigationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvestigationServiceImpl implements InvestigationService {

    @Autowired
    private InvestigationRepository repository;

    @Override
    public InvestigationEntry addEntry(InvestigationEntry entry) {
        entry.setStatus("ONGOING");
        return repository.save(entry);
    }

    @Override
    public List<InvestigationEntry> getByFirId(String firId) {
        return repository.findByFirId(firId);
    }
    @Override
    public InvestigationEntry updateStatus(String id, String status) {

        InvestigationEntry entry = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entry not found"));

        entry.setStatus(status);
        return repository.save(entry);
    }

}

