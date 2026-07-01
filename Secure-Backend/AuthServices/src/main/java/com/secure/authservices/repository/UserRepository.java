package com.secure.authservices.repository;

import com.secure.authservices.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleIgnoreCase(String role);
    List<User> findByStatus(String status);
    User findByRoleAndStation(String role, String station);
    boolean existsByEmail(String email);


}
