package com.pucp.unionseguros.repository.SOATRepository;

import com.pucp.unionseguros.model.SOAT.SOAT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SOATRepository extends JpaRepository<SOAT,Integer> {

    public List<SOAT> findSOATSByActivoIsTrue();
}
