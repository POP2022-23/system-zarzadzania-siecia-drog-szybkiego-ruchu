package com.pop.tariff.dto;

import com.pop.tariff.domain.VehicleType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class TariffDTO {
    private long id;
    private boolean isValid;
    private String name;
    private Map<String, BigDecimal> rates;
    private List<Long> roadIds;
}
