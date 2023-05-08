package com.pucp.unionseguros.service.VehiculoService;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.VehiculoRepository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VehiculoService {
    private final VehiculoRepository vehiculoRepository;

    @Autowired
    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }
    public List<Vehiculo> listarVehiculos(){
        return vehiculoRepository.findAll();
    }

    public int insertarVehiculo(Vehiculo vehiculo) {
        Vehiculo savedVehiculo = vehiculoRepository.saveAndFlush(vehiculo);
        return  savedVehiculo.getId();
    }
    public Vehiculo buscarVehiculoConPlaca(String placaIngrese){
        Vehiculo founVehiculo = null;
        founVehiculo =vehiculoRepository.findVehiculoByPlaca(placaIngrese);
        return founVehiculo;
    }
}
