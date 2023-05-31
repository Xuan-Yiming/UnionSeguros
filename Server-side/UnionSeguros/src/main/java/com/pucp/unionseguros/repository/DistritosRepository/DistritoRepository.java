package com.pucp.unionseguros.repository.DistritosRepository;

import com.pucp.unionseguros.model.Distritos.Distrito;
import com.pucp.unionseguros.model.Distritos.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistritoRepository extends JpaRepository<Distrito,Integer> {

    public List<Distrito> findDistritosByFidProvincia(Provincia provincia);
}
