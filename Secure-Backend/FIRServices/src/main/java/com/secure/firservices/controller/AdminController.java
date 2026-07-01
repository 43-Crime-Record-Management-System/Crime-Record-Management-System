package com.secure.firservices.controller;

import com.secure.firservices.entity.FIR;
import com.secure.firservices.entity.AuditLog;
import com.secure.firservices.repository.FIRRepository;
import com.secure.firservices.repository.AuditLogRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    private final FIRRepository firRepository;
    private final AuditLogRepository auditRepository;

    public AdminController(FIRRepository firRepository,
                           AuditLogRepository auditRepository) {
        this.firRepository = firRepository;
        this.auditRepository = auditRepository;
    }

    @GetMapping("/firs")
    public List<FIR> getAllFirs() {
        return firRepository.findAll();
    }

    @PutMapping("/approve/{id}")
    public FIR approveFir(@PathVariable String id,
                          HttpServletRequest request) {

        FIR fir = firRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR Not Found"));

        fir.setStatus("APPROVED");
        FIR updated = firRepository.save(fir);

        saveAudit("APPROVE", id, request);

        return updated;
    }

    @PutMapping("/reject/{id}")
    public FIR rejectFir(@PathVariable String id,
                         HttpServletRequest request) {

        FIR fir = firRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FIR Not Found"));

        fir.setStatus("REJECTED");
        FIR updated = firRepository.save(fir);

        saveAudit("REJECT", id, request);

        return updated;
    }

    private void saveAudit(String action,
                           String firId,
                           HttpServletRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("UNKNOWN");

        String ip = request.getRemoteAddr();

        AuditLog log = new AuditLog();
        log.setTime(LocalDateTime.now());
        log.setUser(username);
        log.setRole(role);
        log.setAction(action);
        log.setResource("FIR ID: " + firId);
        log.setStatus("Success");
        log.setIp(ip);

        auditRepository.save(log);
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        Map<String, Long> stats = new HashMap<>();

        long total = firRepository.count();
        long pending = firRepository.findByStatus("PENDING").size();
        long approved = firRepository.findByStatus("APPROVED").size();
        long rejected = firRepository.findByStatus("REJECTED").size();

        stats.put("totalFirs", total);
        stats.put("activeCases", pending);
        stats.put("closedCases", approved);
        stats.put("rejectedCases", rejected);

        return stats;
    }

    @GetMapping("/crime-trends")
    public Map<String, Object> getCrimeTrends() {

        List<FIR> firs = firRepository.findAll();

        Map<String, Long> monthlyCount = new TreeMap<>();

        for (FIR fir : firs) {

            if (fir.getCreatedAt() != null) {

                String month =
                        fir.getCreatedAt().getMonth().toString();

                monthlyCount.put(
                        month,
                        monthlyCount.getOrDefault(month, 0L) + 1
                );
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("months",
                new ArrayList<>(monthlyCount.keySet()));
        response.put("counts",
                new ArrayList<>(monthlyCount.values()));

        return response;
    }

    @GetMapping("/station-performance")
    public List<Map<String, Object>> getStationPerformance() {

        List<FIR> firs = firRepository.findAll();

        Map<String, List<FIR>> grouped = new HashMap<>();

        for (FIR fir : firs) {

            if (fir.getIncidentLocation() != null) {

                grouped.computeIfAbsent(
                        fir.getIncidentLocation(),
                        k -> new ArrayList<>()
                ).add(fir);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<String, List<FIR>> entry :
                grouped.entrySet()) {

            long total = entry.getValue().size();

            long solved = entry.getValue()
                    .stream()
                    .filter(f -> "APPROVED"
                            .equalsIgnoreCase(f.getStatus()))
                    .count();

            Map<String, Object> station =
                    new HashMap<>();

            station.put("name", entry.getKey());
            station.put("firs", total);
            station.put("solved", solved);

            result.add(station);
        }

        return result;
    }

    @GetMapping("/audit")
    public List<AuditLog> getAllAuditLogs() {
        return auditRepository.findAll()
                .stream()
                .sorted((a, b) ->
                        b.getTime().compareTo(a.getTime()))
                .toList();
    }

    @PostMapping("/audit/login")
    public void logLogin(@RequestBody AuditLog log) {
        log.setTime(LocalDateTime.now());
        auditRepository.save(log);
    }
    @GetMapping("/crime-analytics")
    public Map<String, Object> getCrimeAnalytics() {

        Map<String, Object> response = new HashMap<>();

        List<FIR> allFirs = firRepository.findAll();

        Map<String, Long> monthlyData = allFirs.stream()
                .collect(Collectors.groupingBy(
                        fir -> fir.getCreatedAt().getMonth().toString(),
                        Collectors.counting()
                ));

        Map<String, Long> crimeTypes = new HashMap<>();

        crimeTypes.put("THEFT",
                allFirs.stream()
                        .filter(f -> f.getDescription() != null &&
                                f.getDescription().toLowerCase().contains("theft"))
                        .count());

        crimeTypes.put("ASSAULT",
                allFirs.stream()
                        .filter(f -> f.getDescription() != null &&
                                f.getDescription().toLowerCase().contains("assault"))
                        .count());

        crimeTypes.put("CYBERCRIME",
                allFirs.stream()
                        .filter(f -> f.getDescription() != null &&
                                f.getDescription().toLowerCase().contains("cyber"))
                        .count());

        Map<String, Long> yearlyComparison = allFirs.stream()
                .collect(Collectors.groupingBy(
                        fir -> String.valueOf(fir.getCreatedAt().getYear()),
                        Collectors.counting()
                ));

        response.put("monthlyData", monthlyData);
        response.put("crimeTypes", crimeTypes);
        response.put("yearlyComparison", yearlyComparison);

        return response;
    }

}
