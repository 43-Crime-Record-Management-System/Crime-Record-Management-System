package com.secure.authservices.service;

import java.util.List;

import com.secure.authservices.dto.LoginRequest;
import com.secure.authservices.dto.NotificationSettingsRequest;
import com.secure.authservices.dto.PasswordChangeRequest;
import com.secure.authservices.dto.ProfileResponse;
import com.secure.authservices.dto.ProfileUpdateRequest;
import com.secure.authservices.entity.User;

public interface AuthService {

    User register(User user);

    User login(LoginRequest request);

    List<User> getByRole(String role);

    User findByEmail(String email);

    List<User> getAllUsers();

    User updateRole(Long id, String role);   

    User toggleStatus(Long id);           
    ProfileResponse getProfile(String email);
    User updateProfile(String email, ProfileUpdateRequest request);
    void changePassword(String email, PasswordChangeRequest request);
    void updateNotificationSettings(String email, NotificationSettingsRequest request);
    User getShoByStation(String stationId);
    User getUserById(Long id);
    void deleteUser(Long id);
   


}
