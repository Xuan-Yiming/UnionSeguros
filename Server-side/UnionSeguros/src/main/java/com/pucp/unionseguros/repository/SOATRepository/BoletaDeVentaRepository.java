package com.pucp.unionseguros.repository.SOATRepository;

import com.pucp.unionseguros.model.SOAT.BoletaDeVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BoletaDeVentaRepository extends JpaRepository<BoletaDeVenta, Integer> {


    public List<BoletaDeVenta> findBoletaDeVentasByActivoIsTrue();

    BoletaDeVenta findBoletaDeVentaById(Integer idBoleta);

    public BoletaDeVenta findBoletaDeVentaByIdAndActivoIsTrue(Integer idBoleta);

    @Query("SELECT b FROM BoletaDeVenta b INNER JOIN SOAT s INNER JOIN Poliza po INNER JOIN Vehiculo v " +
            "INNER JOIN Cliente c INNER JOIN Persona per " +
            "WHERE CONCAT(CAST(b.fechaEmision AS string),v.placa,per.nombre, per.apellidoPaterno, " +
            "per.apellidoMaterno, per.numeroDocumento) " +
            "LIKE CONCAT('%', ?1, '%')  " +
            "AND b.activo = true AND b.fidSoat.id = s.id AND po.id = s.fidPoliza.id AND v.id = po.fidVehiculo.id " +
            "AND po.fidCliente.id = c.id AND c.id = per.id " +
            "ORDER BY b.fechaEmision ASC")
    public List<BoletaDeVenta> findPagos(String busqueda);


    @Query("SELECT b FROM BoletaDeVenta b WHERE b.fechaEmision>= ?1 AND b.fechaEmision<= ?2 AND b.activo =true")
    public List<BoletaDeVenta> listarBoletasDeVentaActivasDentroDeUnRangoDeFechas(LocalDate fechaUno, LocalDate fechaDos);

    public BoletaDeVenta findBoletaDeVentasByFidSoat_FidPoliza_FidVehiculo_PlacaAndActivoIsTrue(String placa);
}
