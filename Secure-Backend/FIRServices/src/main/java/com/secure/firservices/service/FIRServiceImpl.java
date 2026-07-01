package com.secure.firservices.service;

import com.secure.firservices.entity.FIR;
import com.secure.firservices.repository.FIRRepository;
import com.secure.firservices.document.Notification;
import com.secure.firservices.dto.UserDTO;
import com.secure.firservices.repository.NotificationRepository;
import com.secure.firservices.util.FIRNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FIRServiceImpl implements FIRService {

    @Autowired
    private FIRRepository repository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public FIR createFIR(FIR fir) {

        // 1️⃣ Set initial values
        fir.setStatus("PENDING");
        fir.setCreatedAt(LocalDateTime.now());

        // 2️⃣ Save FIR
        FIR savedFir = repository.save(fir);

        try {

            /* ================= 🔔 Notify SHO ================= */

            String shoUrl = "http://localhost:9001/auth/internal/sho/"
                    + fir.getStationId();

            UserDTO shoUser =
                    restTemplate.getForObject(shoUrl, UserDTO.class);

            if (shoUser != null) {

                Notification shoNotification = new Notification();
                shoNotification.setUserId(shoUser.getId());
                shoNotification.setTitle("New FIR Created");
                shoNotification.setMessage(
                        "New FIR #" + savedFir.getId()
                                + " registered in your station."
                );
                shoNotification.setCreatedAt(LocalDateTime.now());
                shoNotification.setRead(false);

                notificationRepository.save(shoNotification);
            }

            /* ================= 🔔 Notify ADMIN (UserId Based) ================= */

            // Get all ADMIN users from auth service
            String adminUrl = "http://localhost:9001/auth/role/ADMIN";

            UserDTO[] admins =
                    restTemplate.getForObject(adminUrl, UserDTO[].class);

            if (admins != null) {

                for (UserDTO admin : admins) {

                    Notification adminNotification = new Notification();
                    adminNotification.setUserId(admin.getId());  // 🔥 IMPORTANT CHANGE
                    adminNotification.setTitle("New FIR Created");
                    adminNotification.setMessage(
                            "New FIR #" + savedFir.getId()
                                    + " has been created."
                    );
                    adminNotification.setCreatedAt(LocalDateTime.now());
                    adminNotification.setRead(false);

                    notificationRepository.save(adminNotification);
                }
            }

        } catch (Exception e) {

            // Notification failure should NOT stop FIR creation
            System.out.println("Notification error: " + e.getMessage());
        }

        return savedFir;
    }

    @Override
    public List<FIR> getAllFIR() {
        return repository.findAll();
    }
    @Override
    public FIR getById(String id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new FIRNotFoundException("FIR not found with id: " + id));
    }

    public FIR updateStatus(String id, String status, String reason) {

        FIR fir = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR not found"));

        fir.setStatus(status.toUpperCase());

        if ("REJECTED".equalsIgnoreCase(status)) {
            fir.setRejectReason(reason);
        } else {
            fir.setRejectReason(null);
        }

        return repository.save(fir);
    }

    @Override
    public FIR updateStatus(String id, String status) {

        FIR fir = repository.findById(id)
                .orElseThrow(() -> new FIRNotFoundException("FIR not found"));

        fir.setStatus(status.toUpperCase());

        FIR updatedFir = repository.save(fir);

        try {

            if (fir.getAssignedOfficerId() != null) {

                Notification notification = new Notification();
                notification.setUserId(
                        Long.parseLong(fir.getAssignedOfficerId())
                );

                notification.setTitle("FIR Status Updated");
                notification.setMessage(
                        "FIR #" + fir.getId() +
                        " status changed to " + status.toUpperCase()
                );

                notification.setCreatedAt(LocalDateTime.now());
                notification.setRead(false);

                notificationRepository.save(notification);
            }

        } catch (Exception e) {
            System.out.println("Failed to notify officer: " + e.getMessage());
        }

        return updatedFir;
    }



    @Override
    public FIR assignOfficer(String firId, String officerId) {

        FIR fir = repository.findById(firId)
                .orElseThrow(() -> new FIRNotFoundException("FIR not found"));

        fir.setAssignedOfficerId(officerId);
        fir.setStatus("ASSIGNED");

        FIR updatedFir = repository.save(fir);

        try {

            /* ================= 1️⃣ Notify Assigned Officer ================= */

            Notification officerNotification = new Notification();
            officerNotification.setUserId(Long.parseLong(officerId));
            officerNotification.setTitle("New FIR Assigned");
            officerNotification.setMessage(
                    "FIR #" + fir.getId() + " has been assigned to you."
            );
            officerNotification.setCreatedAt(LocalDateTime.now());
            officerNotification.setRead(false);

            notificationRepository.save(officerNotification);


            /* ================= 2️⃣ Notify ADMIN ================= */

            Notification adminNotification = new Notification();
            adminNotification.setRole("ADMIN");
            adminNotification.setTitle("FIR Assigned by SHO");
            adminNotification.setMessage(
                    "SHO assigned FIR #" + fir.getId() +
                    " to Officer ID: " + officerId
            );
            adminNotification.setCreatedAt(LocalDateTime.now());
            adminNotification.setRead(false);

            notificationRepository.save(adminNotification);


            /* ================= 3️⃣ Create Investigation Entry ================= */

            String investigationUrl = "http://localhost:9004/investigation/add";

            Map<String, Object> request = new HashMap<>();
            request.put("firId", fir.getId());
            request.put("officerId", officerId);
            request.put("date", java.time.LocalDate.now());
            request.put("entryType", "Initial Investigation");
            request.put("description", "Investigation started");

            restTemplate.postForObject(investigationUrl, request, Object.class);

        } catch (Exception e) {
            System.out.println("Notification error: " + e.getMessage());
        }

        return updatedFir;
    }

    @Override
    public List<FIR> getByStatus(String status) {
        return repository.findByStatus(status.toUpperCase());
    }

    @Override
    public List<FIR> getByOfficer(String officerId) {
        return repository.findByAssignedOfficerId(officerId);
    }

    @Override
    public List<FIR> searchByComplainantName(String name) {
        return repository.findByFullNameContainingIgnoreCase(name);
    }


    @Override
    public List<FIR> getByLocation(String location) {
    	return repository.findByIncidentLocationContainingIgnoreCase(location);

    }

    @Override
    public void deleteFIR(String id) {
        FIR fir = getById(id);
        repository.delete(fir);
    }

    @Override
    public Map<String, Object> getOfficerPerformanceByEmail(String officerId, String month) {

        List<FIR> firs;

        if (month != null && !month.equals("ALL")) {

            YearMonth ym = YearMonth.parse(month);
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

            firs = repository.findByAssignedOfficerIdAndCreatedAtBetween(
                    officerId, start, end
            );

        } else {

            firs = repository.findByAssignedOfficerId(officerId);
        }

        long totalAssigned = firs.size();

        long closed = firs.stream()
                .filter(f -> "CLOSED".equalsIgnoreCase(f.getStatus()))
                .count();

        long ongoing = totalAssigned - closed;

        Map<String, Object> result = new HashMap<>();
        result.put("totalAssigned", totalAssigned);
        result.put("closed", closed);
        result.put("ongoing", ongoing);

        return result;
    }

    @Override
    public long countByOfficer(String officerId) {
        return repository.countByAssignedOfficerId(officerId);
    }

    @Override
    public long countByOfficerAndStatus(String officerId, String status) {
        return repository.countByAssignedOfficerIdAndStatus(
                officerId, status.toUpperCase()
        );
    }
    @Override
    public List<FIR> getByOfficerAndStatus(String officerId, String status) {
        return repository.findByAssignedOfficerIdAndStatus(officerId, status);
    }

	
}
