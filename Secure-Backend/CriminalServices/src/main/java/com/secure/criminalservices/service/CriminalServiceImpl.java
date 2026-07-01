package com.secure.criminalservices.service;

import com.secure.criminalservices.entity.Criminal;
import com.secure.criminalservices.util.CriminalNotFoundException;
import com.secure.criminalservices.repository.CriminalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CriminalServiceImpl implements CriminalService {

    @Autowired
    private CriminalRepository repository;

    @Override
    public Criminal createCriminal(Criminal criminal) {
        if (criminal.getStatus() == null) {
            criminal.setStatus("WANTED");
        }
        return repository.save(criminal);
    }

    @Override
    public List<Criminal> getAllCriminals() {
        return repository.findAll();
    }

    @Override
    public Criminal getCriminalById(String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new CriminalNotFoundException("Criminal not found with id " + id));
    }

    @Override
    public Criminal updateCriminal(String id, Criminal updated) {

        Criminal criminal = getCriminalById(id);

        criminal.setFullName(updated.getFullName());
        criminal.setAliases(updated.getAliases());
        criminal.setGender(updated.getGender());
        criminal.setDateOfBirth(updated.getDateOfBirth());
        criminal.setMugshot(updated.getMugshot());
        criminal.setFingerprint(updated.getFingerprint());
        criminal.setPhysicalDescription(updated.getPhysicalDescription());
        criminal.setCrimeTypes(updated.getCrimeTypes());

        return repository.save(criminal);
    }

    @Override
    public Criminal updateStatus(String id, String status) {

        Criminal criminal = getCriminalById(id);
        criminal.setStatus(status);

        if (status.equalsIgnoreCase("ARRESTED")) {
            criminal.setArrestCount(criminal.getArrestCount() + 1);
        }

        return repository.save(criminal);
    }

    @Override
    public void deleteCriminal(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<Criminal> getByStatus(String status) {
        return repository.findByStatus(status);
    }
}
