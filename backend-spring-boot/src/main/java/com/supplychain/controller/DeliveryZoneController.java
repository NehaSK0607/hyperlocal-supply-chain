package com.supplychain.controller;

import com.supplychain.dto.DeliveryZoneDTO;
import com.supplychain.repository.DeliveryZoneRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/zones")
@CrossOrigin(origins = "*")
public class DeliveryZoneController {

    private final DeliveryZoneRepository repository;

    public DeliveryZoneController(DeliveryZoneRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DeliveryZoneDTO> getAllZones() {
        // Fetch from PostGIS and map spatial Points to clean JSON
        return repository.findAll().stream()
            .map(zone -> new DeliveryZoneDTO(
                zone.getZoneId(),
                zone.getZoneName(),
                zone.getCentralHubLocation().getY(), // Latitude
                zone.getCentralHubLocation().getX()  // Longitude
            ))
            .collect(Collectors.toList());
    }
}
