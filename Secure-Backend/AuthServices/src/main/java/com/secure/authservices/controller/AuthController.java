package com.secure.authservices.controller;

import com.secure.authservices.config.JwtUtil;
import com.secure.authservices.dto.LoginRequest;
import com.secure.authservices.dto.LoginResponse;
import com.secure.authservices.dto.NotificationSettingsRequest;
import com.secure.authservices.dto.PasswordChangeRequest;
import com.secure.authservices.dto.ProfileUpdateRequest;
import com.secure.authservices.dto.AuditLogDTO;
import com.secure.authservices.entity.User;
import com.secure.authservices.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = authService.register(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req,
                                   HttpServletRequest httpRequest) {

        User user = authService.login(req);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        sendLoginAudit(user, httpRequest);

        LoginResponse response = new LoginResponse(
                user.getId(),          // 🔥 ADD THIS
                token,
                user.getEmail(),
                user.getRole(),
                user.getFullName(),
                user.getStation()
        );



        return ResponseEntity.ok(response);
    }
 
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String currentUserEmail = authentication.getName();

        User currentUser = authService.findByEmail(currentUserEmail);

        if (currentUser.getId().equals(id)) {
            return ResponseEntity
                    .badRequest()
                    .body("You cannot delete your own account");
        }

        User userToDelete = authService.getUserById(id);

        if (userToDelete == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        authService.deleteUser(id);

        return ResponseEntity.ok("User deleted successfully");
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestParam String email,
                                         HttpServletRequest httpRequest) {

        User user = authService.findByEmail(email);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email not registered in system");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        sendLoginAudit(user, httpRequest);

        LoginResponse response = new LoginResponse(
                user.getId(),         
                token,
                user.getEmail(),
                user.getRole(),
                user.getFullName(),
                user.getStation()
        );



        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = authService.getByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update-role/{id}")
    public ResponseEntity<User> updateRole(@PathVariable Long id,
                                           @RequestParam String role) {

        User updatedUser = authService.updateRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/toggle-status/{id}")
    public ResponseEntity<User> toggleStatus(@PathVariable Long id) {

        User updatedUser = authService.toggleStatus(id);
        return ResponseEntity.ok(updatedUser);
    }

    private void sendLoginAudit(User user, HttpServletRequest request) {

        try {
            AuditLogDTO audit = new AuditLogDTO();
            audit.setUser(user.getEmail());
            audit.setRole(user.getRole());
            audit.setAction("LOGIN");
            audit.setResource("System");
            audit.setStatus("Success");
            audit.setIp(request.getRemoteAddr());

            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForObject(
                    "http://localhost:9002/admin/audit/login",
                    audit,
                    Void.class
            );

        } catch (Exception e) {
            System.out.println("Audit logging failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(authService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request
    ) {

        System.out.println("Updating profile for: " + authentication.getName());

        return ResponseEntity.ok(
                authService.updateProfile(authentication.getName(), request)
        );
    }


    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody PasswordChangeRequest request
    ) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PutMapping("/notification-settings")
    public ResponseEntity<?> updateNotificationSettings(
            Authentication authentication,
            @RequestBody NotificationSettingsRequest request
    ) {
        authService.updateNotificationSettings(authentication.getName(), request);
        return ResponseEntity.ok("Preferences updated");
    }
    @GetMapping("/internal/sho/{stationId}")
    public ResponseEntity<User> getShoByStation(
            @PathVariable String stationId) {

        User sho = authService.getShoByStation(stationId);

        if (sho == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(sho);
    }
    

    

}
