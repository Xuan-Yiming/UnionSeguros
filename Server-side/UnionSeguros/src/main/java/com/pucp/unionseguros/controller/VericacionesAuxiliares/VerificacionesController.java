package com.pucp.unionseguros.controller.VericacionesAuxiliares;

import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.model.Extras.SoatVigente;
import com.pucp.unionseguros.model.Personas.Cliente;
import com.pucp.unionseguros.model.Personas.TipoDocumento;
import com.pucp.unionseguros.model.SOAT.Poliza;
import com.pucp.unionseguros.model.Vehiculo.Vehiculo;
import com.pucp.unionseguros.repository.ExtrasRepository.ListaNegraRepository;
import com.pucp.unionseguros.repository.ExtrasRepository.SoatVigenteRepository;
import com.pucp.unionseguros.repository.PersonasRepository.ClienteRepository;
import com.pucp.unionseguros.repository.PersonasRepository.TipoDocumentoRepository;
import com.pucp.unionseguros.repository.SOATRepository.PolizaRepository;
import com.pucp.unionseguros.repository.SOATRepository.SOATRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Service
@RestController
@RequestMapping(path = "api/v1/verificaciones")
public class VerificacionesController {


    //aaaaa
    private final SoatVigenteRepository soatVigenteRepository;
    private  final SOATRepository soatRepository;

    private final PolizaRepository polizaRepository;

    private final VehiculoRepository vehiculoRepository;
    private  final ClienteRepository clienteRepository;
    private  final TipoDocumentoRepository tipoDocumentoRepository;

    private  final  ListaNegraRepository listaNegraRepository;


    @Autowired
    public VerificacionesController(SoatVigenteRepository soatVigenteRepository, SOATRepository soatRepository, PolizaRepository polizaRepository, VehiculoRepository vehiculoRepository, ClienteRepository clienteRepository, TipoDocumentoRepository tipoDocumentoRepository, ListaNegraRepository listaNegraRepository) {
        this.soatVigenteRepository = soatVigenteRepository;
        this.soatRepository = soatRepository;
        this.polizaRepository = polizaRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.clienteRepository = clienteRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
        this.listaNegraRepository = listaNegraRepository;
    }


    @GetMapping("/verificarVehiculoConSOATVigente")
    public boolean verificarSoatVigente(@RequestParam(name = "placaIngresada")String placaIngresada){
        boolean encontrado=false;
        SoatVigente soatVigente = null;
        soatVigente = soatVigenteRepository.findSoatVigenteByPlaca(placaIngresada);
        LocalDate fechaDeBusqueda = LocalDate.now();
        if(soatVigente!=null){
            if(fechaDeBusqueda.isAfter(soatVigente.getFechaInicio()) && fechaDeBusqueda.isBefore(soatVigente.getFechaFin())){
                encontrado = true;
                return encontrado;
            }
        }
        Poliza poliza = null;
        Vehiculo vehiculo = vehiculoRepository.findVehiculoByPlaca(placaIngresada);
        poliza = polizaRepository.findPolizaByFidVehiculoAndActivoIsTrue(vehiculo);
        fechaDeBusqueda.plusDays(1);
        if(poliza!=null){
            if(fechaDeBusqueda.isAfter(poliza.getFechaVigenciaDesde()) && fechaDeBusqueda.isBefore(poliza.getFechaVigenciaFin())){
                encontrado=true;
                return encontrado;
            }
        }



        return  encontrado;
    }

    @GetMapping("/verificarPersonaBaneadaListaNegra")
    public boolean verificarPersonaBaneada(@RequestParam(name = "busqueda")String busqueda){
        boolean encontrado = false;
        ListaNegra listaNegra = null    ;
        listaNegra = listaNegraRepository.busquedaPorParametro(busqueda);
        if(listaNegra!=null){
            encontrado=true;
        }
        return encontrado;
    }

    @GetMapping("/verificarClienteBaneado")
    public boolean verificarClienteBaneado(@RequestParam(name = "numDocumento")String numDocumento,
                                            @RequestParam(name = "nombreTipoDocumento")String nombreTipoDocumento){
        boolean encontrado= false;
        TipoDocumento tipoDocumento = tipoDocumentoRepository.findTipoDocumentoByNombre(nombreTipoDocumento);
        Cliente cliente = null;
        cliente = clienteRepository.findClienteByNumeroDocumentoAndFidTipoDocumentoAndBaneadoIsTrue(numDocumento,tipoDocumento);
        if(cliente!=null){
            encontrado= true;
        }
        return  encontrado;

    }
}
