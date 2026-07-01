package com.secure.firservices.controller;

import com.secure.firservices.document.Notification;
import com.secure.firservices.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/user/{userId}")
    public List<Notification> getByUserId(@PathVariable Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @GetMapping("/role/{role}")
    public List<Notification> getByRole(@PathVariable String role) {
        return notificationRepository.findByRole(role.toUpperCase());
    }

    @GetMapping("/user/{userId}/unread-count")
    public long getUnreadCountByUser(@PathVariable Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @GetMapping("/role/{role}/unread-count")
    public long getUnreadCountByRole(@PathVariable String role) {
        return notificationRepository.countByRoleAndReadFalse(role.toUpperCase());
    }

    @PutMapping("/read/{id}")
    public Notification markAsRead(@PathVariable String id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    @DeleteMapping("/user/{userId}")
    public String deleteByUser(@PathVariable Long userId) {

        List<Notification> list =
                notificationRepository.findByUserId(userId);

        notificationRepository.deleteAll(list);

        return "All user notifications deleted";
    }

    @DeleteMapping("/role/{role}")
    public String deleteByRole(@PathVariable String role) {

        List<Notification> list =
                notificationRepository.findByRole(role.toUpperCase());

        notificationRepository.deleteAll(list);

        return "All role notifications deleted";
    }
}
