package com.pucp.unionseguros.service.ExtrasService;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import com.pucp.unionseguros.model.Extras.SoatVigente;
import com.pucp.unionseguros.repository.ExtrasRepository.SoatVigenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.DateFormatter;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.StringTokenizer;

@Component
public class SoatVigenteService {

    private final SoatVigenteRepository soatVigenteRepository;

    @Autowired
    public SoatVigenteService(SoatVigenteRepository soatVigenteRepository) {
        this.soatVigenteRepository = soatVigenteRepository;
    }

    public String cargaMasivaDeSoatsVigentes(MultipartFile file){
        List<SoatVigente> lista = soatVigenteRepository.findAll();
        int encontrado;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");
        if(file.isEmpty()){
            return "El archivo está vacio";
        }

        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
            List<SoatVigente> listaSoatsVigente = new ArrayList<>();
            br.readLine();//sacamos los titulos
            while((line = br.readLine())!=null){
                String[] data = line.split(getSeparator(line));
                SoatVigente soatVigente = new SoatVigente();
                soatVigente.setCodigo(data[0]);
                soatVigente.setPlaca(data[1].replace("-",""));
                soatVigente.setFechaInicio(LocalDate.parse(data[2],formatter));
                soatVigente.setFechaFin(LocalDate.parse(data[3],formatter));
                soatVigente.setNombreAseguradora(data[4]);

                encontrado = buscarRepetidos(soatVigente,lista);
                if(encontrado ==0){
                    listaSoatsVigente.add(soatVigente);
                }


            }
            soatVigenteRepository.saveAllAndFlush(listaSoatsVigente);
            return "Archivo CSV cargado exitosamente";


        }catch (IOException e){
            return "Error al cargar el archivo csv :" + e.getMessage();
        }
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

    private  int buscarRepetidos(SoatVigente abuscar, List<SoatVigente> lista){
        if(lista.size()==0) return 0;
        for (SoatVigente cal: lista) {
            if(cal.getCodigo().equals(abuscar.getCodigo()) &&
                    cal.getPlaca().equals(abuscar.getPlaca()) &&
                    cal.getFechaFin().equals(abuscar.getFechaFin()) &&
                    cal.getFechaInicio().equals(abuscar.getFechaInicio()) &&
                    cal.getNombreAseguradora().equals(abuscar.getNombreAseguradora())){
                return 1;
            }

        }
        return 0;
    }
}
