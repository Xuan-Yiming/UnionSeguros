package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.SoatVigente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoatVigenteRepository extends JpaRepository<SoatVigente, Integer> {
}
