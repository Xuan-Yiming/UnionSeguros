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
        EmailXToken emailXToken=emailXTokenRepository.findEmailXTokenByEmailAndTokenAndActivoIsTrue(email,token);
        boolean valida=false;
        if(emailXToken!=null){
            valida=false;
        }
        return  valida;
    }

    public boolean resetearToken(String email) {
        boolean valida=false;
        List<EmailXToken> lista = new ArrayList<>();
        EmailXToken emailXToken =new EmailXToken();
        lista=emailXTokenRepository.findEmailXTokenByEmail(email);
        for(int i=0;i< lista.size();i++){
            emailXToken=lista.get(i);
            emailXToken.setActivo(false);
            emailXToken=emailXTokenRepository.save(emailXToken);
            if(emailXToken!=null){
                valida=true;
            }
            else {
                valida=false;
            }
        }
        return valida;
    }
}
