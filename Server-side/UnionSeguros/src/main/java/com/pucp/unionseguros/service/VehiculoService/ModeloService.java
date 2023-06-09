package com.pucp.unionseguros.service.VehiculoService;

import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.VehiculoRepository.MarcaVehiculoRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.ModeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ModeloService {

    private  final ModeloRepository modeloRepository;
    private final MarcaVehiculoRepository marcaVehiculoRepository;

    @Autowired
    public ModeloService(ModeloRepository modeloRepository,
                         MarcaVehiculoRepository marcaVehiculoRepository) {
        this.modeloRepository = modeloRepository;
        this.marcaVehiculoRepository = marcaVehiculoRepository;
    }

    public List<Modelo> listarModelo(){
        return modeloRepository.findAll();
    }
    public List<Modelo> listarModelosPorMarcas(Integer idMarca){
        MarcaVehiculo marcaVehiculo = new MarcaVehiculo();
        marcaVehiculo =  marcaVehiculoRepository.findMarcaVehiculoByIdAndActivoIsTrue(idMarca);
        return modeloRepository.findModelosByFidMarcaVehiculo(marcaVehiculo);
    }

    public int insertarModelo(Modelo modelo){
        Modelo savedModelo = modeloRepository.saveAndFlush(modelo);
        return  savedModelo.getId();
    }

    public Modelo modificarModelo(Modelo modelo){
        return modeloRepository.save(modelo);

    }

    public Modelo eliminarModelo(Integer idIngresado){
        Modelo modelo = modeloRepository.findModeloById(idIngresado);
        modelo.setActivo(false);
        return modeloRepository.save(modelo);
    }

    public List<Modelo> busquedaDeModelosPorNombreIDMarca(String busqueda){
        List<Modelo> lista = null;
        lista= modeloRepository.buscarModelosPorNombreIdMarca(busqueda);
        return lista;
    }


}
