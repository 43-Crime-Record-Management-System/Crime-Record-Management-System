package com.secure.notification.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.secure.notification.entity.Notification;

import java.util.List;

public interface NotificationRepository 
        extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(Long userId);

}
