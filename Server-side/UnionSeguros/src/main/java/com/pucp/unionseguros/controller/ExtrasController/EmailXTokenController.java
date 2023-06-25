package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.model.Extras.EmailXToken;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.service.CorreosService.EmailService;
import com.pucp.unionseguros.service.ExtrasService.EmailXTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@Service
@RestController
@RequestMapping(path = "api/v1/EmailXToken")
@CrossOrigin
public class EmailXTokenController {
    private final EmailService emailService;
    private final EmailXTokenService emailXTokenService;

    @Autowired
    public EmailXTokenController(EmailService emailService, EmailXTokenService emailXTokenService) {
        this.emailService = emailService;
        this.emailXTokenService = emailXTokenService;
    }

    @PostMapping("/insertar")
    public EmailXToken generarToken(@RequestParam(name = "emailIngresado")String emailIngresado){
        EmailXToken emailXToken = new EmailXToken();
        Random random = new Random();
        StringBuilder sb = new StringBuilder(6);
        //PARA CREAR EL TOKEN
        for (int i =0;i< 6;i++){
            int digit = random.nextInt(10);
            sb.append(digit);
        }

        emailXToken.setEmail(emailIngresado);
        emailXToken.setActivo(true);
        emailXToken.setToken(sb.toString());
        boolean success = false;

        try{
        success = emailService.sendEmailTool("El token para validar su correo es: "+ sb.toString() +"\nAtentamente Union Seguros.",
                                    emailIngresado,
                                                "Token de validación de cuenta - UnionSeguros");
        }
        catch(Exception ex){ System.out.print(ex.getMessage()); }

        return emailXTokenService.generarToken(emailXToken);

    }

    @GetMapping("/validarToken")
    public boolean validarToken(@RequestParam(name = "email") String email,
                                @RequestParam(name = "token") String token){
        boolean success = false;

        success=emailXTokenService.validarToken(email,token);
        return success;
    }

    @GetMapping("/resetearToken")
    public boolean resetearToken(@RequestParam(name = "email") String email){
        boolean succes = false;
        succes=emailXTokenService.resetearToken(email);
        return succes;
    }
}
