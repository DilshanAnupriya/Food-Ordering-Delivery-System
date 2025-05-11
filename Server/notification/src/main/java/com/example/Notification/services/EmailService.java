package com.example.Notification.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmationEmail(String toEmail, String orderId, double totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Order Confirmation - #" + orderId);
        message.setText("Thank you for your order!\n\nOrder ID: " + orderId +
                "\nTotal Amount: $" + totalAmount +
                "\n\nYour order has been successfully placed and is being processed.");

        mailSender.send(message);
    }
}