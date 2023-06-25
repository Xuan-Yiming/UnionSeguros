package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.EmailXToken;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.repository.ExtrasRepository.EmailXTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class EmailXTokenService {

    private final EmailXTokenRepository emailXTokenRepository;


    public EmailXTokenService(EmailXTokenRepository emailXTokenRepository) {
        this.emailXTokenRepository = emailXTokenRepository;
    }

    public EmailXToken generarToken(EmailXToken emailXTokenIngresado){


        return  emailXTokenRepository.save(emailXTokenIngresado);
    }

    public boolean validarToken(String email,String token){
        EmailXToken emailXToken = null;
        emailXToken = emailXTokenRepository.findEmailXTokenByEmailAndTokenAndActivoIsTrue(email,token);
        boolean success= false;

        if(emailXToken!=null){
            success=true;
        }

        return success;
    }

    public boolean resetearToken(String email) {
        List<EmailXToken> lista = new ArrayList<>();
        EmailXToken emailXToken =new EmailXToken();
        boolean succes= false;
        int i=0;
        lista=emailXTokenRepository.findEmailXTokenByEmail(email);
        for(i=0;i< lista.size();i++){
            emailXToken=lista.get(i);
            emailXToken.setActivo(false);
            emailXTokenRepository.save(emailXToken);
        }
        if(i== lista.size() -1){
            succes =true;
        }
        return  succes;

    }
}
