package com.secure.dutyservices.controller;
import com.secure.dutyservices.entity.InvestigationEntry;
import com.secure.dutyservices.service.InvestigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investigation")
@CrossOrigin
public class InvestigationController {

    @Autowired
    private InvestigationService service;

    @PostMapping("/add")
    public InvestigationEntry addEntry(@RequestBody InvestigationEntry entry) {
        return service.addEntry(entry);
    }

    @GetMapping("/fir/{firId}")
    public List<InvestigationEntry> getByFir(@PathVariable String firId) {
        return service.getByFirId(firId);
    }

    @PutMapping("/update-status/{id}")
    public InvestigationEntry updateStatus(
            @PathVariable String id,
            @RequestParam String status) {

        return service.updateStatus(id, status);
    }
}
