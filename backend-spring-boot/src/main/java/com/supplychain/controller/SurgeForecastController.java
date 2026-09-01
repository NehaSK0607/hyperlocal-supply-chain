package com.supplychain.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/forecast")
@CrossOrigin(origins = "*")
public class SurgeForecastController {

    private final String PYTHON_SERVICE_URL = "http://127.0.0.1:8000/api/v1/forecast/predict";

    @PostMapping("/predict")
    public ResponseEntity<Object> getSurgeForecast(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        
        try {
            Object response = restTemplate.postForObject(PYTHON_SERVICE_URL, entity, Object.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to reach ML Forecasting Microservice: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
