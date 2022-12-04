package com.pop.tariff.repository;

import com.pop.tariff.domain.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TariffJpaRepository extends JpaRepository<Tariff, Long> {

    List<Tariff> findAll();
}
