package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import com.pucp.unionseguros.model.Extras.ListaNegra;
import com.pucp.unionseguros.repository.ExtrasRepository.CalculoPrimaRepository;
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

    @Autowired
    public CalculoPrimaService(CalculoPrimaRepository calculoPrimaRepository) {
        this.calculoPrimaRepository = calculoPrimaRepository;
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

            while((line=br.readLine())!=null){
                String[] data = line.split(getSeparator(line));
                CalculoPrima prima = new CalculoPrima();

                prima.setMarca(data[0]);
                prima.setModelo(data[1]);
                prima.setMoneda(data[2]);
                prima.setAnioFabricacion(Integer.parseInt(data[3]));
                prima.setValor_1(Double.parseDouble(data[4]));
                prima.setValor_2(Double.parseDouble(data[5]));
                prima.setValor_3(Double.parseDouble(data[6]));
                prima.setIndiceSiniestralidad(Double.parseDouble(data[7]));
                
                ListaParacalculoPrima.add(prima);
            }


            calculoPrimaRepository.saveAllAndFlush(ListaParacalculoPrima);
            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }
}
