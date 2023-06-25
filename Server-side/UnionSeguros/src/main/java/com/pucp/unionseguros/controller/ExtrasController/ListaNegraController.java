package com.pucp.unionseguros.controller.ExtrasController;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.service.ExtrasService.ListaNegraService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/listaNegra")
public class ListaNegraController {

    private final ListaNegraService listaNegraService;

    @Autowired
    public ListaNegraController(ListaNegraService listaNegraService) {
        this.listaNegraService = listaNegraService;
    }

    @PostMapping("/cargaMasivaListaNegra")
    public String cargaMasiva(@RequestParam ("file")MultipartFile file){
        return listaNegraService.cargaMasivaDeListaNegra(file);
    }
    @GetMapping("/listarListaNegra")
    public List<ListaNegra> listarListaNegra(){
        return  listaNegraService.listarListaNegra();
    }
}
