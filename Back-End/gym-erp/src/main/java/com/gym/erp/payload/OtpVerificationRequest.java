package com.gym.erp.payload;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpVerificationRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String otp;
}
