package com.secure.criminalservices.controller;

import com.secure.criminalservices.entity.Criminal;
import com.secure.criminalservices.service.CriminalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/criminal") 
@CrossOrigin
public class CriminalController {

    @Autowired
    private CriminalService service;

    @PostMapping("/create")
    public Criminal create(@RequestBody Criminal criminal) {
        return service.createCriminal(criminal);
    }

    @GetMapping("/all")
    public List<Criminal> getAll() {
        return service.getAllCriminals();
    }

    @GetMapping("/{id}")
    public Criminal getById(@PathVariable String id) {
        return service.getCriminalById(id);
    }

    @PutMapping("/update/{id}")
    public Criminal update(@PathVariable String id,
                           @RequestBody Criminal criminal) {
        return service.updateCriminal(id, criminal);
    }

    @PutMapping("/update-status/{id}")
    public Criminal updateStatus(@PathVariable String id,
                                 @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.deleteCriminal(id);
        return "Criminal deleted successfully";
    }

    @GetMapping("/status/{status}")
    public List<Criminal> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }
}
