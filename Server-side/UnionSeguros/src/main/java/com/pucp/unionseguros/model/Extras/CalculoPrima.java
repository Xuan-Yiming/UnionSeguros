package com.pucp.unionseguros.model.Extras;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "calculo_prima")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CalculoPrima {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calculo_prima", nullable = false)
    private Integer idCaluloPrima;

    @Column(name = "marca", length = 300)
    private String marca;

    @Column(name = "modelo", length = 300)
    private String modelo;

    @Column(name = "moneda", length = 100)
    private String moneda;

    @Column(name = "anio_fabricacion")
    private int anioFabricacion;

    @Column(name = "valor_1")
    private double valor_1;

    @Column(name = "valor_2")
    private double valor_2;

    @Column(name = "valor_3")
    private double valor_3;

    @Column(name = "indice_siniestralidad")
    private double indiceSiniestralidad;

}
