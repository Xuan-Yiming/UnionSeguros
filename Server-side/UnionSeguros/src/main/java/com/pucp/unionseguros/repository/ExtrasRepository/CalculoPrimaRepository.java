package com.pucp.unionseguros.repository.ExtrasRepository;

import com.pucp.unionseguros.model.Extras.CalculoPrima;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.List;

@Repository
public interface CalculoPrimaRepository extends JpaRepository<CalculoPrima,Integer> {

    CalculoPrima findCalculoPrimaByMarcaAndModelo(String marcaIngresada, String modeloIngresado);



//    @Transactional
//    @Modifying
//    @Query("INSERT INTO  MarcaVehiculo (marca,activo) SELECT distinct marca , 1 from CalculoPrima where marca not in (select distinct marca from MarcaVehiculo ) ")
//    int insertarMarcasConCalculoPrima();
//    //@Query("INSERT INTO MarcaVehiculo (marca, activo) SELECT DISTINCT cp.marca, 1 FROM CalculoPrima cp WHERE cp.marca NOT IN (SELECT DISTINCT mv.marca FROM MarcaVehiculo mv)")
//
//
//    @Modifying
//    @Transactional
//    @Query("INSERT INTO  Modelo (fid_marca_vehiculo,fid_tipo_vehiculo,modelo,activo)" +
//            "SELECT id_marca_vehiculo,1,modelo," +
//            "from calculoPrima A" +
//            "inner join MarcaVehiculo B" +
//            "on A.marca=B.marca" +
//            "where Modelo not in (select distinct modelo from UnionSeguros.modelo )")
//    int insertarModelosConCalculoPrima();

}