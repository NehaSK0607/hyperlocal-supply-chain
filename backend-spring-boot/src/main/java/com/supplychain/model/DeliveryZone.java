package com.supplychain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.locationtech.jts.geom.Point;

@Entity
public class DeliveryZone {
    @Id
    private String zoneId;
    
    private String zoneName;
    
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point centralHubLocation;

    public DeliveryZone() {}

    public DeliveryZone(String zoneId, String zoneName, Point centralHubLocation) {
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.centralHubLocation = centralHubLocation;
    }

    public String getZoneId() { return zoneId; }
    public String getZoneName() { return zoneName; }
    public Point getCentralHubLocation() { return centralHubLocation; }
}
