package com.gym.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Kilojoules - Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp +
                "\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.");
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to Kilojoules!");
        message.setText("Hello " + name + ",\n\nWelcome to Kilojoules Energy & Fitness Management System!\n" +
                "Your account has been created successfully.\n\nLet's crush your fitness goals!");
        mailSender.send(message);
    }
}
