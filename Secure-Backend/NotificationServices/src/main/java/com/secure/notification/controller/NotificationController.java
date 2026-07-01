package com.secure.notification.controller;

import com.secure.notification.entity.Notification;
import com.secure.notification.repository.NotificationRepository;
import com.secure.notification.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(
            @PathVariable Long userId) {

        return notificationRepository.findByUserId(userId);
    }
    @PutMapping("/read/{id}")
    public Notification markAsRead(@PathVariable String id) {

        Notification notification = 
                notificationRepository.findById(id).get();

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

}
