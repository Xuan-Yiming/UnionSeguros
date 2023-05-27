package com.pucp.unionseguros.service.VehiculoService;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.VehiculoRepository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        Vehiculo foundVehiculo = null;
        foundVehiculo = vehiculoRepository.findVehiculoByPlaca(vehiculo.getPlaca());

        if(foundVehiculo != null){
            return 0;
        }else{
            Vehiculo savedVehiculo = vehiculoRepository.saveAndFlush(vehiculo);
            return  savedVehiculo.getId();
        }



    }
    public Vehiculo buscarVehiculoConPlaca(String placaIngrese){
        Vehiculo founVehiculo = null;
        founVehiculo =vehiculoRepository.findVehiculoByPlaca(placaIngrese);
        return founVehiculo;
    }
    public Page<Vehiculo> findAll(Pageable pageable){
        Page<Vehiculo> pageProductoEntity = vehiculoRepository.findAll(pageable);
        return pageProductoEntity;
    }
}
