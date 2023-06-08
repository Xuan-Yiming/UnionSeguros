package com.pucp.unionseguros.service.VehiculoService;

import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.VehiculoRepository.VehiculoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
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

    public List<Vehiculo> buscarVehiculoParametro(String busqueda){
        List<Vehiculo> lista = new ArrayList<>();
        lista = vehiculoRepository.findVehiculoParametro(busqueda);
        return  lista;
    }

    public Vehiculo updateVehiculo(Vehiculo vehiculo){
        return vehiculoRepository.save(vehiculo);
    }

    public Vehiculo deleteVehiculo(Vehiculo vehiculo){
        vehiculo.setActivo(false);
        return vehiculoRepository.save(vehiculo);
    }
    @Transactional
    public void eliminarVehiculo(Integer id){
        vehiculoRepository.eliminarVehiculo(id);
    }

}
