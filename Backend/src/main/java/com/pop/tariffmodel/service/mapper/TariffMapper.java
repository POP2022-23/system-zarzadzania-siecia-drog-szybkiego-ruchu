package com.pop.tariffmodel.service.mapper;

import com.pop.mapmodel.domain.Road;
import com.pop.mapmodel.repository.RoadJpaRepository;
import com.pop.tariffmodel.domain.Tariff;
import com.pop.tariffmodel.domain.VehicleType;
import com.pop.tariffmodel.dto.TariffDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TariffMapper {

    private final RoadJpaRepository roadJpaRepository;

    public Tariff mapTariffDTOToModel(TariffDTO tariffDTO) {
        Tariff tariff = new Tariff();
        tariff.setName(tariffDTO.getName());
        tariff.setValid(tariffDTO.isValid());
        Map<VehicleType, BigDecimal> transitRates = new HashMap<>();
        Map<VehicleType, BigDecimal> roadPassRates = new HashMap<>();
        tariffDTO.getTransitRates().forEach((n, r)-> transitRates.put(VehicleType.valueOf(n), r));
        tariffDTO.getRoadPassRates().forEach((n, r)-> roadPassRates.put(VehicleType.valueOf(n), r));
        tariff.setTransitRates(transitRates);
        tariff.setRoadPassRates(roadPassRates);
        List<Road> roads = mapRoadIdsToRoadsList(tariffDTO.getRoadIds());
        tariff.setRoads(roads);
        return tariff;
    }

    public List<Road> mapRoadIdsToRoadsList(List<Long> roadIds) {
        List<Road> roads  = new ArrayList<>();
        roadIds.forEach(roadId ->{
            roads.add(roadJpaRepository.findById(roadId).orElseThrow(
                    () -> new RuntimeException("Road with id " + roadId + " does not exist")
            ));
        });
        return roads;
    }

    public Map<VehicleType, BigDecimal> mapTariffDtoRatesToTariffRates(Map<String, BigDecimal> rates) {
        Map<VehicleType, BigDecimal> mappedRates = new HashMap<>();
        rates.forEach((n, r)-> mappedRates.put(VehicleType.valueOf(n), r));
        return mappedRates;
    }

    public TariffDTO mapTariffModelToDTO(Tariff tariffModel) {
        Map<String, BigDecimal> transitRates = new HashMap<>();
        tariffModel.getTransitRates().forEach((vehicleType, rate) -> transitRates.put(vehicleType.name(), rate));
        Map<String, BigDecimal> roadPassRates = new HashMap<>();
        tariffModel.getRoadPassRates().forEach((vehicleType, rate) -> roadPassRates.put(vehicleType.name(), rate));

        return TariffDTO.builder()
                .id(tariffModel.getId())
                .name(tariffModel.getName())
                .isValid(tariffModel.isValid())
                .transitRates(transitRates)
                .roadPassRates(roadPassRates)
                .roadIds(tariffModel.getRoads().stream().map(r -> r.getId()).collect(Collectors.toList()))
                .build();
    }
}
