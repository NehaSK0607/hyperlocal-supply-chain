package com.supplychain.dto;

public class DeliveryZoneDTO {
    private String zoneId;
    private String zoneName;
    private double latitude;
    private double longitude;

    public DeliveryZoneDTO(String zoneId, String zoneName, double latitude, double longitude) {
        this.zoneId = zoneId;
        this.zoneName = zoneName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getZoneId() { return zoneId; }
    public String getZoneName() { return zoneName; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
}
