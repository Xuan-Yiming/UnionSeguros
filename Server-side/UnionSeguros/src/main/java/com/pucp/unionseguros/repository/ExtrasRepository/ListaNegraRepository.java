package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListaNegraRepository extends JpaRepository<ListaNegra, Integer> {
}
