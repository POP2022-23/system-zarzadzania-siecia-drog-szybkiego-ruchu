package com.pop.mapmodel.service;

import com.pop.db.domain.Road;
import com.pop.db.repository.RoadJpaRepository;
import com.pop.mapmodel.dto.RoadDataDTO;
import com.pop.mapmodel.service.mapper.RoadDataMapper;
import com.pop.mapmodel.service.validator.RoadDataValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MapService implements IMapService {

    private final RoadJpaRepository roadRepository;
    private final RoadDataMapper roadDataMapper;
    private final RoadDataValidator roadDataValidator;

    @Override
    public List<RoadDataDTO> getRoadList() {
        List<Road> roads = roadRepository.findAll();

        return roadDataMapper.mapToDTO(roads);
    }

    @Override
    public boolean saveRoadData(RoadDataDTO roadDataDTO) {
        try {
            roadDataValidator.validate(roadDataDTO);
            Road road = roadDataMapper.mapFromDTO(roadDataDTO);
            roadRepository.save(road);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

}
