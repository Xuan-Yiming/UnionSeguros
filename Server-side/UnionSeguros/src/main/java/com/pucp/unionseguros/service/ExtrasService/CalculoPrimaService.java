package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import com.pucp.unionseguros.model.Vehiculo.MarcaVehiculo;
import com.pucp.unionseguros.model.Vehiculo.Modelo;
import com.pucp.unionseguros.repository.ExtrasRepository.CalculoPrimaRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.MarcaVehiculoRepository;
import com.pucp.unionseguros.repository.VehiculoRepository.ModeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
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
            List<MarcaVehiculo> listaMarcas = new ArrayList<>();
            List<Modelo> listaModelos = new ArrayList<>();
            br.readLine();
            while((line=br.readLine())!=null){
                String[] data = line.split(getSeparator(line));
                CalculoPrima prima = new CalculoPrima();
                MarcaVehiculo marca = new MarcaVehiculo();
                Modelo modelo = new Modelo();

                prima.setMarca(data[0]);
                marca.setActivo(true);
                marca.setMarca(data[0]);

                prima.setModelo(data[1]);
                modelo.setFidMarcaVehiculo(marca);
                modelo.setModelo(data[1]);
                modelo.setActivo(true);

                prima.setMoneda(data[2]);
                //prima.setAnioFabricacion(Integer.parseInt(data[3]));
                prima.setValor_1(Double.parseDouble(data[3].replace(" ","")));
                prima.setValor_2(Double.parseDouble(data[4].replace(" ","")));
                prima.setValor_3(Double.parseDouble(data[5].replace(" ","")));
                prima.setIndiceSiniestralidad(Double.parseDouble(data[6]));


//                if(buscarMarcaSiExiste(listaMarcas,marca)){
//                    listaMarcas.add(marca);
//                }
                listaMarcas.add(marca);
                listaModelos.add(modelo);
                ListaParacalculoPrima.add(prima);
            }

            //marcaVehiculoRepository.saveAllAndFlush(listaMarcas);
            calculoPrimaRepository.saveAllAndFlush(ListaParacalculoPrima);
            //colocar los ids de las marcas en donde deberian ir

            //procesarModeloDeVehiculo(listaModelos);
            marcaVehiculoRepository.cargaMarca();
            modeloRepository.cargaModelos();

            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }
//    public boolean buscarMarcaSiExiste(List<MarcaVehiculo> lista, MarcaVehiculo marca){
//        List<MarcaVehiculo> list = null ;
//        list=marcaVehiculoRepository.findMarcaVehiculosByActivoIsTrue();
//        if(list!=null){
//            lista.addAll(list);
//        }
//        boolean encontrado = true;
//        for (MarcaVehiculo  mar: lista) {
//            if(mar.getMarca() == marca.getMarca()){
//                encontrado= false;
//            }
//        }
//        return  encontrado;
//    }

    public void procesarModeloDeVehiculo(List<Modelo> listaModelos ){
//        List<Modelo> list = null;
//        list = modeloRepository.findModelosByActivoIsTrue();
//
//        if(list!=null){
//            listaModelos.addAll(list);
//        }

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
