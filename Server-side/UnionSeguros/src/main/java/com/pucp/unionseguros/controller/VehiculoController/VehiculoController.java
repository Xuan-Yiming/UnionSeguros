/*
Nombre del archivo:    VehiculoController
Autor:                Jarumy Novoa
Descripcion:        Archivo controller de la clase Vehiculo
*/


package com.pucp.unionseguros.controller.VehiculoController;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.service.VehiculoService.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
@RestController
@RequestMapping(path = "api/v1/vehiculo")
public class VehiculoController {
    private final VehiculoService vehiculoService;

    @Autowired
    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }


    @GetMapping("/listarTodos")
    public List<Vehiculo> getVehiculos(){
        return vehiculoService.listarVehiculos();
    }

    @GetMapping(params = "placaIngresada",path = "/buscarVehiculoPorPlaca")
    public Vehiculo obtenerVehiculoPorPlaca(@RequestParam(name = "placaIngresada") String placaIngresada){
        return vehiculoService.buscarVehiculoConPlaca(placaIngresada);
    }
    @PostMapping("/insertar")
    public int registrarNuevoVehiculo(@RequestBody Vehiculo vehiculo){
        return vehiculoService.insertarVehiculo(vehiculo);
    }

    @GetMapping("/paginar")
    public Page<Vehiculo> findByLikePagin(@RequestParam(name = "page",defaultValue = "0") Integer page,
                                          @RequestParam(name = "size",defaultValue = "") Integer size){
        Pageable pageable= PageRequest.of(page, size);//page-1
        Page<Vehiculo> lista = vehiculoService.findAll(pageable);
        return lista;
    }
}
