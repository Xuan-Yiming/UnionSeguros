package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.EmailXToken;
import com.pucp.unionseguros.repository.ExtrasRepository.EmailXTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

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
}
