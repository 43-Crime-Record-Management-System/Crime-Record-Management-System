package com.secure.firservices.repository;

import com.secure.firservices.document.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository
        extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByRole(String role);

    long countByUserIdAndReadFalse(Long userId);

    long countByRoleAndReadFalse(String role);
}
