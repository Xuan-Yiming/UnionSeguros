package com.pucp.unionseguros.service.VehiculoService;

import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import com.pucp.unionseguros.repository.VehiculoRepository.MarcaVehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MarcaVehiculoService {
    private final MarcaVehiculoRepository marcaVehiculoRepository;

    @Autowired
    public MarcaVehiculoService(MarcaVehiculoRepository marcaVehiculoRepository) {
        this.marcaVehiculoRepository = marcaVehiculoRepository;
    }

    public List<MarcaVehiculo> listarMarcaVehiculo(){
        return marcaVehiculoRepository.findAll();
    }

    public int insertarMarcaVehiculo(MarcaVehiculo marcaVehiculo){
        MarcaVehiculo savedMarcaVehiculo = marcaVehiculoRepository.saveAndFlush(marcaVehiculo);
        return savedMarcaVehiculo.getId();
    }

    public MarcaVehiculo buscarMarcaConElId(Integer idMarca){
        return marcaVehiculoRepository.findMarcaVehiculoById(idMarca);
    }

    public List<MarcaVehiculo> busquedaDeMarcasPorParametro(String busqueda){
        return marcaVehiculoRepository.buscarMarcasVehiculosPorParametro(busqueda);
    }

    public List<MarcaVehiculo> listarMarcasActivas(){
        List<MarcaVehiculo> lista = null;
        lista= marcaVehiculoRepository.findMarcaVehiculosByActivoIsTrue();
        return lista;

    }
}
