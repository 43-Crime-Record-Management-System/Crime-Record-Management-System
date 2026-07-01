package com.secure.evidenceservices.controller;

import com.secure.evidenceservices.entity.CourtHearing;
import com.secure.evidenceservices.service.CourtHearingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hearings")
@CrossOrigin
public class CourtHearingController {

    private final CourtHearingService service;

    public CourtHearingController(CourtHearingService service) {
        this.service = service;
    }

    @PostMapping
    public CourtHearing addHearing(@RequestBody CourtHearing hearing) {
        return service.addHearing(hearing);
    }

    @GetMapping("/{caseId}")
    public List<CourtHearing> getByCase(@PathVariable String caseId) {
        return service.getByCaseId(caseId);
    }
    @PutMapping("/{id}/status")
    public CourtHearing updateStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteHearing(id);
    }

}
