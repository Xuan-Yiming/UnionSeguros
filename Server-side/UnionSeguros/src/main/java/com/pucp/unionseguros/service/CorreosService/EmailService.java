package com.pucp.unionseguros.service.CorreosService;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private MailSender sender;

    public boolean sendEmailTool(String textMessage, String email,String subject) {
        Boolean result = false;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setText(textMessage);
        message.setSubject(subject);

        try{
            sender.send(message);
            System.out.println("Envia3.");
            result = true;
        }catch (Exception exception){
            System.err.println(exception.getMessage());
        }
        return result;
    }

}