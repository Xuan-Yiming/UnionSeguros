package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.model.Extras.Auditoria;
import com.pucp.unionseguros.service.ExtrasService.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/auditoria")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    @Autowired
    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @PostMapping("/insertar")
    public Auditoria insertarAuditoria(@RequestBody Auditoria auditoria){
        return auditoriaService.insertarAuditoria(auditoria);
    }

    @GetMapping("/listarTodos")
    public List<Auditoria> listarAuditoria(){
        return auditoriaService.listarAuditoria();
    }

    @GetMapping(params = "busqueda",path ="/buscarAuditoriaParametros")
    public List<Auditoria> buscarAuditoria(@RequestParam(name = "busqueda") String busqueda){
        return auditoriaService.buscarAuditoriaParametro(busqueda);
    }
}
