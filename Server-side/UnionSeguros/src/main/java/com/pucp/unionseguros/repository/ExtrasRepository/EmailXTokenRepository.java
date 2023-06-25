package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.EmailXToken;
import com.pucp.unionseguros.model.Personas.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailXTokenRepository extends JpaRepository<EmailXToken, Integer> {

    public EmailXToken findEmailXTokenByEmailAndTokenAndActivoIsTrue(String emailIngresado,String tokenIngresado);

    public List<EmailXToken> findEmailXTokenByEmail(String emailIngresado);
}
