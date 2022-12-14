package com.pop.tariffmodel.service;

import com.pop.tariffmodel.domain.Tariff;
import com.pop.tariffmodel.domain.VehicleType;
import com.pop.tariffmodel.dto.TariffDTO;
import com.pop.tariffmodel.repository.TariffJpaRepository;
import com.pop.tariffmodel.service.mapper.TariffMapper;
import com.pop.tariffmodel.service.validator.TariffValidator;
import com.pop.mapmodel.domain.Road;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BasicTariffModel implements ITariffModel {

    private final TariffJpaRepository tariffJpaRepository;
    private final TariffValidator tariffValidator;
    private final TariffMapper tariffMapper;

    @Override
    public List<TariffDTO> getTariffList() {
        return tariffJpaRepository.findAll().stream()
                .map(tariffMapper::mapTariffModelToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean saveNewTariffData(TariffDTO tariffData) {
        if(!tariffValidator.validateTariff(tariffData)) {
            return false;
        }
        Tariff tariff = tariffMapper.mapTariffDTOToModel(tariffData);
        tariffJpaRepository.save(tariff);
        return true;
    }

    @Override
    public boolean saveTariffChangeData(final TariffDTO tariffData) {
        if (!tariffValidator.validateTariff(tariffData)) {
            return false;
        }
        final Tariff tariff = tariffJpaRepository.findById(tariffData.getId()).orElse(null);
        if (tariff == null) {
            return false;
        }

        tariff.setName(tariffData.getName());
        tariff.setValid(tariffData.isValid());
        final Map<VehicleType, BigDecimal> transitRates = tariffMapper.mapTariffDtoRatesToTariffRates(tariffData.getTransitRates());
        tariff.updateTransitRates(transitRates);
        final Map<VehicleType, BigDecimal> roadPassRates = tariffMapper.mapTariffDtoRatesToTariffRates(tariffData.getRoadPassRates());
        tariff.updateRoadPassRates(roadPassRates);
        final List<Road> roads  = tariffMapper.mapRoadIdsToRoadsList(tariffData.getRoadIds());
        tariff.updateRoads(roads);

        tariffJpaRepository.save(tariff);
        return true;
    }
}
