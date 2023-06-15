package com.pucp.unionseguros.service.SOATService;

import com.pucp.unionseguros.model.SOAT.SOAT;
import com.pucp.unionseguros.repository.SOATRepository.SOATRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SOATService {
    private final SOATRepository soatRepository;

    @Autowired
    public SOATService(SOATRepository soatRepository) {
        this.soatRepository = soatRepository;
    }

    public List<SOAT> listarSOAT(){return  soatRepository.findAll();}

    public int insertarSOAT(SOAT soat) {
        SOAT savedSOAT = soatRepository.saveAndFlush(soat);
        return savedSOAT.getId();
    }

    public List<SOAT> listarSOATsActivos(){
        List<SOAT> lista = null ;
        lista = soatRepository.findSOATSByActivoIsTrue();
        return lista;
    }

    public  SOAT eliminarSOAT(SOAT soat){
        soat.setActivo(false);
        return soatRepository.saveAndFlush(soat);
    }

    public List<SOAT> BuscarSOATParametro(String busqueda){
        List<SOAT> lista = new ArrayList<>();
        lista = soatRepository.findSOATParametros(busqueda);
        return  lista;
    }
}
