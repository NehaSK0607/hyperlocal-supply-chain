package com.supplychain.seeder;

import com.supplychain.model.DeliveryZone;
import com.supplychain.repository.DeliveryZoneRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final DeliveryZoneRepository repository;

    public DatabaseSeeder(DeliveryZoneRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        GeometryFactory factory = new GeometryFactory();
        
        // HYD_ZONE_MADHAPUR Coordinates (Lon, Lat)
        Point madhapur = factory.createPoint(new Coordinate(78.3814, 17.4483));
        madhapur.setSRID(4326); // Set Spatial Reference System (WGS84)
        
        // HYD_ZONE_GACHIBOWLI
        Point gachibowli = factory.createPoint(new Coordinate(78.3643, 17.4401));
        gachibowli.setSRID(4326);

        repository.save(new DeliveryZone("HYD_ZONE_MADHAPUR", "Madhapur Dark Store", madhapur));
        repository.save(new DeliveryZone("HYD_ZONE_GACHIBOWLI", "Gachibowli Dark Store", gachibowli));
        
        System.out.println("✅ PostGIS Spatial Zones Initialized!");
    }
}
