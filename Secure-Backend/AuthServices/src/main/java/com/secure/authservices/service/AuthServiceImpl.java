package com.secure.authservices.service;

import com.secure.authservices.dto.LoginRequest;
import com.secure.authservices.dto.NotificationSettingsRequest;
import com.secure.authservices.dto.PasswordChangeRequest;
import com.secure.authservices.dto.ProfileResponse;
import com.secure.authservices.dto.ProfileUpdateRequest;
import com.secure.authservices.entity.User;
import com.secure.authservices.repository.UserRepository;
import com.secure.authservices.util.UserNotFoundException;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthServiceImpl(UserRepository repo,
                           PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public User register(User user) {

        if (!user.getEmail().endsWith("@police.gov")) {
            throw new RuntimeException("Email must be @police.gov");
        }

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setStatus("ACTIVE");

        return repo.save(user);
    }

    @Override
    public User login(LoginRequest req) {

        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found!"));

        if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User account is blocked!");
        }

        boolean isMatch = passwordEncoder.matches(
                req.getPassword(),
                user.getPassword()
        );


        if (!isMatch) {
            return null;
        }

        return user;
    }

    @Override
    public List<User> getByRole(String role) {
        return repo.findByRoleIgnoreCase(role);
    }
    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }
    @Override
    public User updateRole(Long id, String role) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role.toUpperCase());

        return repo.save(user);
    }

    @Override
    public User toggleStatus(Long id) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ACTIVE".equalsIgnoreCase(user.getStatus())) {
            user.setStatus("BLOCKED");
        } else {
            user.setStatus("ACTIVE");
        }

        return repo.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }
    

    public ProfileResponse getProfile(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getFullName(),
                user.getEmail(),
                user.getBadgeNumber(),
                user.getStation(),
                user.isEmailAlerts(),
                user.isSmsAlerts(),
                user.isDarkMode(),
                user.getRole(),
                user.getStatus()
        );
    }


    @Override
    public User updateProfile(String email, ProfileUpdateRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setBadgeNumber(request.getBadgeNumber());
        user.setStation(request.getStation());

        return repo.save(user);
    }


    @Override
    public void changePassword(String email, PasswordChangeRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("Entered current password: " + request.getCurrentPassword());
        System.out.println("Stored password hash: " + user.getPassword());

        boolean isMatch = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        );

        System.out.println("Password match result: " + isMatch);

        if (!isMatch) {
            throw new RuntimeException("Current password incorrect");
        }

        String newPassword = request.getNewPassword();

        if (!newPassword.matches(
                "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$"
        )) {
            throw new RuntimeException(
                    "Password must contain 8+ characters, uppercase, lowercase, number and special character"
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        repo.save(user);
    }



    @Override
    public void updateNotificationSettings(String email,
                                           NotificationSettingsRequest request) {

    	User user = repo.findByEmail(email)
    	        .orElseThrow(() -> new RuntimeException("User not found"));


        user.setEmailAlerts(request.isEmailAlerts());
        user.setSmsAlerts(request.isSmsAlerts());
        user.setDarkMode(request.isDarkMode());

        repo.save(user);
    }
    @Override
    public User getShoByStation(String stationId) {
    	return repo.findByRoleAndStation("SHO", stationId);

    }
    @Override
    public User getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
   

}
