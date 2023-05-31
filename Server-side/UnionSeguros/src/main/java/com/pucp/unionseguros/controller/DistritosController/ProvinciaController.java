package com.pucp.unionseguros.controller.DistritosController;

import com.pucp.unionseguros.model.Distritos.Provincia;
import com.pucp.unionseguros.service.DistritoService.ProvinciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/Provincia")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    @Autowired
    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @GetMapping(params = "idDepartamento",path = "/listarProvinciasPorDepartamento")
    public List<Provincia> listarProvinciasPorDepartamento(@RequestParam Integer idDepartamento){
        return provinciaService.listarProvinciasPorDepartamento(idDepartamento);
    }


}
