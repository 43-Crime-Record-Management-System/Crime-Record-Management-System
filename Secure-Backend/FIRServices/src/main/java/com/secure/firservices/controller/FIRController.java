package com.secure.firservices.controller;

import com.secure.firservices.entity.FIR;
import com.secure.firservices.service.FIRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fir")
@CrossOrigin(origins = "*")
public class FIRController {

    @Autowired
    private FIRService service;

    @PostMapping("/create")
    public FIR create(@RequestBody FIR fir) {
        return service.createFIR(fir);
    }

    @GetMapping("/all")
    public List<FIR> getAll() {
        return service.getAllFIR();
    }

    @GetMapping("/{id}")
    public FIR getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PutMapping("/status/{id}")
    public FIR updateStatus(@PathVariable String id,
                            @RequestParam String status,
                            @RequestParam(required = false) String reason) {

        return service.updateStatus(id, status, reason);
    }

    


    @PutMapping("/assign/{id}")
    public FIR assignOfficer(@PathVariable String id,
                             @RequestParam String officerId) {
        return service.assignOfficer(id, officerId);
    }

    @GetMapping("/status/{status}")
    public List<FIR> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/officer/{officerId}")
    public List<FIR> getByOfficer(@PathVariable String officerId) {
        return service.getByOfficer(officerId);
    }
    @GetMapping("/search")
    public List<FIR> searchByName(@RequestParam String name) {
        return service.searchByComplainantName(name);
    }

    @GetMapping("/location")
    public List<FIR> searchByLocation(@RequestParam String location) {
        return service.getByLocation(location);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.deleteFIR(id);
        return "Deleted Successfully";
    }

    @GetMapping("/performance/{officerId}")
    public Map<String, Object> getPerformance(
            @PathVariable String officerId,
            @RequestParam(required = false) String month) {
        return service.getOfficerPerformanceByEmail(officerId, month);
    }


    @GetMapping("/count/officer/{officerId}")
    public long countByOfficer(@PathVariable String officerId) {
        return service.countByOfficer(officerId);
    }

    @GetMapping("/count/officer/{officerId}/status/{status}")
    public long countByOfficerAndStatus(@PathVariable String officerId,
                                        @PathVariable String status) {
        return service.countByOfficerAndStatus(officerId, status);
    }
    @GetMapping("/officer/{officerId}/status/{status}")
    public List<FIR> getByOfficerAndStatus(
            @PathVariable String officerId,
            @PathVariable String status) {

        return service.getByOfficerAndStatus(officerId, status);
    }
}
