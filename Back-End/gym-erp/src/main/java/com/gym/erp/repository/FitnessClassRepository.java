package com.gym.erp.repository;

import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.enums.ClassType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FitnessClassRepository extends JpaRepository<FitnessClass, Long> {

    List<FitnessClass> findByIsActiveTrue();

    List<FitnessClass> findByClassType(ClassType classType);

    List<FitnessClass> findByTrainerId(Long trainerId);

    List<FitnessClass> findByIsActiveTrueAndClassType(ClassType classType);
}
