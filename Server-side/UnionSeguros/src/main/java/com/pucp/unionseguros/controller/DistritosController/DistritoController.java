package com.pucp.unionseguros.controller.DistritosController;

import com.pucp.unionseguros.model.Distritos.Distrito;
import com.pucp.unionseguros.service.DistritoService.DistritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/Distrito")
public class DistritoController {

    private  final DistritoService distritoService;


    @Autowired
    public DistritoController(DistritoService distritoService) {
        this.distritoService = distritoService;
    }

    @GetMapping(params = "idProvincia",path = "/listarDistritosPorProvincia")
    public List<Distrito> listarDistritosPorProvincias(@RequestParam Integer idProvincia){
        return distritoService.listarDistritosPorProvincia(idProvincia);
    }
}
