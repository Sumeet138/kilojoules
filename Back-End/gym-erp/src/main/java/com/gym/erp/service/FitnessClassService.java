package com.gym.erp.service;

import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.enums.ClassType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class FitnessClassService {

    @Autowired
    private FitnessClassRepository classRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    public FitnessClass createClass(FitnessClass fitnessClass) {
        return classRepository.save(fitnessClass);
    }

    public List<FitnessClass> getAllActiveClasses() {
        return classRepository.findByIsActiveTrue();
    }

    public List<FitnessClass> getAllClasses() {
        return classRepository.findAll();
    }

    public FitnessClass getClassById(Long id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + id));
    }

    public List<FitnessClass> getClassesByTrainer(Long trainerId) {
        return classRepository.findByTrainerId(trainerId);
    }

    public List<FitnessClass> getClassesByType(ClassType classType) {
        return classRepository.findByIsActiveTrueAndClassType(classType);
    }

    public FitnessClass updateClass(Long id, FitnessClass updated) {
        FitnessClass existing = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + id));
        existing.setClassName(updated.getClassName());
        existing.setClassType(updated.getClassType());
        existing.setScheduledDay(updated.getScheduledDay());
        existing.setScheduledTime(updated.getScheduledTime());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setCapacity(updated.getCapacity());
        existing.setDescription(updated.getDescription());
        existing.setActive(updated.isActive());
        if (updated.getTrainer() != null) {
            existing.setTrainer(updated.getTrainer());
        }
        return classRepository.save(existing);
    }

    public FitnessClass incrementEnrollment(Long classId) {
        FitnessClass fitnessClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + classId));
        fitnessClass.setCurrentEnrollment(fitnessClass.getCurrentEnrollment() + 1);
        return classRepository.save(fitnessClass);
    }

    public FitnessClass decrementEnrollment(Long classId) {
        FitnessClass fitnessClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + classId));
        if (fitnessClass.getCurrentEnrollment() > 0) {
            fitnessClass.setCurrentEnrollment(fitnessClass.getCurrentEnrollment() - 1);
        }
        return classRepository.save(fitnessClass);
    }
}
