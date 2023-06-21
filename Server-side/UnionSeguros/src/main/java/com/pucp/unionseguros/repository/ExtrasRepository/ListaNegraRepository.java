package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ListaNegraRepository extends JpaRepository<ListaNegra, Integer> {

    @Query("SELECT a FROM ListaNegra a WHERE CONCAT(a.numeroDocumento,a.nombreApellidos,a.numeroDocumento) LIKE CONCAT('%',?1,'%') ")
    ListaNegra busquedaPorParametro(String busqueda);
}
