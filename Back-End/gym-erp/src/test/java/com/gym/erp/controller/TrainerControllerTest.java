package com.gym.erp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.erp.entity.Trainer;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.TrainerDTO;
import com.gym.erp.service.ImageService;
import com.gym.erp.service.TrainerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TrainerController.class)
class TrainerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TrainerService trainerService;

    @MockBean
    private ImageService imageService;

    private Trainer trainer;
    private TrainerDTO trainerDTO;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setId(1L);
        trainer.setTrainerId("TRN001");
        trainer.setUsername("coachmark");
        trainer.setPassword("pass");
        trainer.setEmail("mark@gym.com");
        trainer.setFirstName("Mark");
        trainer.setLastName("Johnson");
        trainer.setPhone("9000000001");
        trainer.setSpecialization("HIIT");

        trainerDTO = new TrainerDTO();
        trainerDTO.setId(1L);
        trainerDTO.setTrainerId("TRN001");
        trainerDTO.setEmail("mark@gym.com");
        trainerDTO.setFirstName("Mark");
        trainerDTO.setLastName("Johnson");
    }

    @Test
    @DisplayName("GET /api/trainers returns 200 with trainer list")
    void getAllTrainers_returns200() throws Exception {
        when(trainerService.findAll()).thenReturn(List.of(trainerDTO));

        mockMvc.perform(get("/api/trainers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].trainerId").value("TRN001"));
    }

    @Test
    @DisplayName("GET /api/trainers/{id} returns 200 when found")
    void getTrainerById_returns200() throws Exception {
        when(trainerService.getTrainerById(1L)).thenReturn(Optional.of(trainer));

        mockMvc.perform(get("/api/trainers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainerId").value("TRN001"));
    }

    @Test
    @DisplayName("GET /api/trainers/{id} returns 404 when not found")
    void getTrainerById_returns404() throws Exception {
        when(trainerService.getTrainerById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/trainers/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/trainers/login returns 200 on valid credentials")
    void login_returns200() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("coachmark");
        request.setPassword("pass");

        when(trainerService.authenticateTrainer(any(LoginRequest.class))).thenReturn(trainer);

        mockMvc.perform(post("/api/trainers/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainerId").value("TRN001"));
    }

    @Test
    @DisplayName("POST /api/trainers/login returns 401 on invalid credentials")
    void login_returns401() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("coachmark");
        request.setPassword("wrong");

        when(trainerService.authenticateTrainer(any(LoginRequest.class)))
                .thenThrow(new CustomException("Invalid credentials"));

        mockMvc.perform(post("/api/trainers/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /api/trainers/{id} returns 204 on success")
    void deleteTrainer_returns204() throws Exception {
        doNothing().when(trainerService).deleteTrainer(1L);

        mockMvc.perform(delete("/api/trainers/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/trainers/{id} returns 404 when not found")
    void deleteTrainer_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Trainer not found"))
                .when(trainerService).deleteTrainer(99L);

        mockMvc.perform(delete("/api/trainers/99"))
                .andExpect(status().isNotFound());
    }
}
