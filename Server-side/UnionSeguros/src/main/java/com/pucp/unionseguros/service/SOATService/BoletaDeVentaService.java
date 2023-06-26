package com.pucp.unionseguros.service.SOATService;

import com.pucp.unionseguros.model.SOAT.BoletaDeVenta;
import com.pucp.unionseguros.model.SOAT.Poliza;
import com.pucp.unionseguros.model.SOAT.SOAT;
import com.pucp.unionseguros.repository.SOATRepository.BoletaDeVentaRepository;
import com.pucp.unionseguros.repository.SOATRepository.PolizaRepository;
import com.pucp.unionseguros.repository.SOATRepository.SOATRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class BoletaDeVentaService {
    private final BoletaDeVentaRepository boletaDeVentaRepository;
    private final SOATRepository soatRepository;
    private final PolizaRepository polizaRepository;
    @Autowired
    public BoletaDeVentaService(BoletaDeVentaRepository boletaDeVentaRepository, SOATRepository soatRepository, PolizaRepository polizaRepository) {
        this.boletaDeVentaRepository = boletaDeVentaRepository;
        this.soatRepository = soatRepository;
        this.polizaRepository = polizaRepository;
    }

    public List<BoletaDeVenta> listarBoletaDeVenta(){
        return boletaDeVentaRepository.findAll();
    }

    public  int insertarBoletaDeVenta(BoletaDeVenta boletaDeVenta){
        BoletaDeVenta savedBoletaDeVenta = boletaDeVentaRepository.saveAndFlush(boletaDeVenta);
        return savedBoletaDeVenta.getId();
    }

    public List<BoletaDeVenta> listarBoletasDeVentaActivas(){
        List<BoletaDeVenta> lista = new ArrayList<>();
        lista= boletaDeVentaRepository.findBoletaDeVentasByActivoIsTrue();
        return lista;
    }
    public List<BoletaDeVenta> BuscarBoletasDeVentaParametro(String busqueda){
        List<BoletaDeVenta> lista = new ArrayList<>();
        lista = boletaDeVentaRepository.findPagos(busqueda);
        return  lista;
    }

    public  BoletaDeVenta eliminarBoleta(Integer idBoletaDeVenta){
        BoletaDeVenta boletaDeVenta = boletaDeVentaRepository.findBoletaDeVentaById(idBoletaDeVenta);
        boletaDeVenta.setActivo(false);
        SOAT soat=boletaDeVenta.getFidSoat();
        soat.setActivo(false);
        Poliza poliza=soat.getFidPoliza();
        poliza.setActivo(false);
        //boletaDeVenta.getFidSoat().getFidPoliza().setActivo(false);
        soatRepository.save(soat);
        polizaRepository.save(poliza);
        return boletaDeVentaRepository.save(boletaDeVenta);
    }
//    public BoletaDeVenta updateBoletaDeVenta(BoletaDeVenta boletaDeVenta){
//        BoletaDeVenta foundBoleta = boletaDeVentaRepository.findBoletaDeVentaByIdAndActivoIsTrue(boletaDeVenta.getId());
//        foundBoleta.setId(boletaDeVenta.getId());
//        foundBoleta.setMonto(boletaDeVenta.getMonto());
//        foundBoleta.set
//    }

    public List<BoletaDeVenta> listarBoletaDeVentasDentroDeRango(LocalDate fechaUno, LocalDate fechaDos){
        List<BoletaDeVenta> lista = null;
        lista = boletaDeVentaRepository.listarBoletasDeVentaActivasDentroDeUnRangoDeFechas(fechaUno,fechaDos);
        return lista;
    }
    public BoletaDeVenta buscarVehiculoParametro(String busqueda){
        BoletaDeVenta boletaDeVenta = new BoletaDeVenta();
        boletaDeVenta = boletaDeVentaRepository.findBoletaDeVentasByFidSoat_FidPoliza_FidVehiculo_PlacaAndActivoIsTrue(busqueda);
        return  boletaDeVenta;
    }
}
