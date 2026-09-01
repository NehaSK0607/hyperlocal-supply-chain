class DemandForecaster:
    def predict_surge(self, zone_id: str, sku_id: int, current_demand: int) -> dict:
        zone_multipliers = {"HYD_ZONE_MADHAPUR": 1.85, "HYD_ZONE_GACHIBOWLI": 1.40, "HYD_ZONE_KONDAPUR": 1.10}
        multiplier = zone_multipliers.get(zone_id.upper(), 1.0)
        predicted_demand = int(current_demand * multiplier)
        surge_percentage = float(((multiplier - 1.0) * 100))
        is_high_risk = surge_percentage >= 50.0
        return {
            "zoneId": zone_id, "skuId": sku_id, "currentDemand": current_demand,
            "forecastedDemand": predicted_demand, "surgePercentage": round(surge_percentage, 2),
            "riskLevel": "CRITICAL" if is_high_risk else "NORMAL",
            "recommendedAction": "TRIGGER_LANGCHAIN_STOCK_TRANSFER" if is_high_risk else "MONITOR"
        }
forecaster = DemandForecaster()
