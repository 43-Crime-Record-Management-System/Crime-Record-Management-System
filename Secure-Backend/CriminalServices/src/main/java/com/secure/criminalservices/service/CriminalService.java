package com.secure.criminalservices.service;

import com.secure.criminalservices.entity.Criminal;

import java.util.List;

public interface CriminalService {

    Criminal createCriminal(Criminal criminal);

    List<Criminal> getAllCriminals();

    Criminal getCriminalById(String id);

    Criminal updateCriminal(String id, Criminal criminal);

    Criminal updateStatus(String id, String status);

    void deleteCriminal(String id);

    List<Criminal> getByStatus(String status);
}
