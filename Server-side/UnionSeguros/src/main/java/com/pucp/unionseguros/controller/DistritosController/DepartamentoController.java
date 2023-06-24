/*
Nombre del archivo:    DepartamentoController
Autor:                Tadeo Gallegos
Descripcion:        Archivo controller de la clase Departamento
*/

package com.pucp.unionseguros.controller.DistritosController;

import com.pucp.unionseguros.model.Distritos.Departamento;
import com.pucp.unionseguros.service.DistritoService.DepartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/Departamento")
public class DepartamentoController {

    private final DepartamentoService departamentoService;
    @Autowired
    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @GetMapping("/listarDepartamentos")
    public List<Departamento> listarDepartamentos(){
        return departamentoService.listarDepartamentos();
    }


}
