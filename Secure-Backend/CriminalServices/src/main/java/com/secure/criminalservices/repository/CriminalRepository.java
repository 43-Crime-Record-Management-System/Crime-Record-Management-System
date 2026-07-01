package com.secure.criminalservices.repository;

import com.secure.criminalservices.entity.Criminal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CriminalRepository extends MongoRepository<Criminal, String> {

    List<Criminal> findByStatus(String status);
}
