package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.EmailXToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailXTokenRepository extends JpaRepository<EmailXToken, Integer> {
}
