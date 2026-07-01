package com.secure.analyticsservices.controller;


import com.secure.analyticsservices.dto.AnalyticsResponse;
import com.secure.analyticsservices.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService service;

    @GetMapping("/dashboard")
    public AnalyticsResponse getAnalytics() {
        return service.getAnalytics();
    }
}
