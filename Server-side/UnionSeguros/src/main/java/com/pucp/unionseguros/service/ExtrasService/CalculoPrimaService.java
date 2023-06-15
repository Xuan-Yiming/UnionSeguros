package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.model.Vehiculo.TipoVehiculo;
import com.pucp.unionseguros.repository.ExtrasRepository.CalculoPrimaRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.MarcaVehiculoRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.ModeloRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
@Transactional
public class CalculoPrimaService {
    final private CalculoPrimaRepository calculoPrimaRepository;
    final private MarcaVehiculoRepository marcaVehiculoRepository;
    final private ModeloRepository modeloRepository;


    @Autowired
    public CalculoPrimaService(CalculoPrimaRepository calculoPrimaRepository, MarcaVehiculoRepository marcaVehiculoRepository, ModeloRepository modeloRepository) {
        this.calculoPrimaRepository = calculoPrimaRepository;
        this.marcaVehiculoRepository = marcaVehiculoRepository;
        this.modeloRepository = modeloRepository;
    }

    private String getSeparator(String line) {
        String[] separators = {",", ";", "\t"}; // Posibles separadores: coma, punto y coma, tabulación
        for (String separator : separators) {
            if (line.contains(separator)) {
                return separator;
            }
        }
        // Si no se encuentra un separador conocido, se puede lanzar una excepción o utilizar un separador predeterminado
        return ",";
    }

    public  String cargaMasivaParaCalculoPrima(MultipartFile file){
        if(file.isEmpty()){
            return "El archivo está vacio";
        }
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
            List<CalculoPrima> ListaParacalculoPrima = new ArrayList<>();
            br.readLine();
            while((line=br.readLine())!=null){
                String[] data = line.split(getSeparator(line));
                CalculoPrima prima = new CalculoPrima();
                prima.setMarca(data[0]);


                prima.setModelo(data[1]);


                prima.setMoneda(data[2]);
                //prima.setAnioFabricacion(Integer.parseInt(data[3]));
                prima.setValor_1(Double.parseDouble(data[3].replace(" ","")));
                prima.setValor_2(Double.parseDouble(data[4].replace(" ","")));
                prima.setValor_3(Double.parseDouble(data[5].replace(" ","")));
                prima.setIndiceSiniestralidad(Double.parseDouble(data[6]));

                ListaParacalculoPrima.add(prima);

            }
            calculoPrimaRepository.saveAllAndFlush(ListaParacalculoPrima);

            marcaVehiculoRepository.cargaMarca();

            modeloRepository.cargaModelos();

            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }
    public int buscarMarcaSiExiste(List<MarcaVehiculo> lista, MarcaVehiculo marca){
        int encontrado = 0;
        for (MarcaVehiculo  mar: lista) {
            if(mar.getMarca() == marca.getMarca()){
                encontrado= 1;
                break;
            }
        }
        return  encontrado;
    }


    public void procesarModeloDeVehiculo(List<Modelo> listaModelos ){
        List<Modelo> list = null;
        list = modeloRepository.findModelosByActivoIsTrue();
        if(list!=null){
            listaModelos.addAll(list);
        }
        List<MarcaVehiculo> listaMarcas = marcaVehiculoRepository.findMarcaVehiculosByActivoIsTrue();
        for (Modelo model: listaModelos) {

            for (MarcaVehiculo mar: listaMarcas) {
                if(model.getFidMarcaVehiculo().getMarca() == mar.getMarca()){
                    model.setFidMarcaVehiculo(mar);
                    break;
                }
            }
        }

        modeloRepository.saveAllAndFlush(listaModelos);

    }

    public double calcularMontoPrimaVerificando(String marcaIngresada, String modeloIngresado,Integer anhoIngresado){
        CalculoPrima calculoPrima = null;
        calculoPrima = calculoPrimaRepository.findCalculoPrimaByMarcaAndModeloAndAndAnioFabricacion(marcaIngresada,modeloIngresado,anhoIngresado);
        double valorAretornar=0;
        if(calculoPrima!=null){//SE ENCONTRO UNA MARCA UWU
            //VALOR 1 2022 VALOR 2021 VALOR 20
            if(anhoIngresado==2022){
                valorAretornar = calculoPrima.getValor_1() * calculoPrima.getIndiceSiniestralidad();
            } else if (anhoIngresado==2021) {
                valorAretornar = calculoPrima.getValor_2() * calculoPrima.getIndiceSiniestralidad();
            } else if (anhoIngresado==2020) {
                valorAretornar = calculoPrima.getValor_3() * calculoPrima.getIndiceSiniestralidad();
            }
        }
        return valorAretornar;
    }

}
