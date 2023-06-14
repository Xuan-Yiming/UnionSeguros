/*
Nombre del archivo:    SOATController
Autor:                Tadeo Gallegos
Descripcion:        Archivo controller de la clase SOAT
*/

package com.pucp.unionseguros.controller.SOATController;

import com.pucp.unionseguros.model.SOAT.SOAT;
import com.pucp.unionseguros.service.SOATService.SOATService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/SOAT")
public class SOATController {

    private final SOATService soatService;

    @Autowired
    public SOATController(SOATService soatService) {
        this.soatService = soatService;
    }

    @GetMapping("/listarTodos")
    public List<SOAT> listarSOATs(){
        return soatService.listarSOAT();
    }

    @PostMapping("/insertar")
    public int insertarNuevoSOAT(@RequestBody SOAT soat){
        return soatService.insertarSOAT(soat);
    }

    @PutMapping("/eliminar")
    public SOAT eliminarSOAT(@RequestBody SOAT soat){
        return soatService.eliminarSOAT(soat);
    }

    @GetMapping("/listarSOATsActivos")
    public List<SOAT> listarSOATSActivos(){
        return soatService.listarSOATsActivos();
    }
}
