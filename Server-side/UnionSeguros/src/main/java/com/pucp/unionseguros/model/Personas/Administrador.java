/*
Nombre del archivo:    Administrador
Autor:                Jarumy Novoa
Descripcion:        Archivo model de la clase Administrador
*/

package com.pucp.unionseguros.model.Personas;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
@Getter
@Setter
@Entity
@Table(name = "administrador")
@AllArgsConstructor
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "id_persona")
public class Administrador extends Usuario{

    @Column(name = "activo")
    private boolean activo;

    @ManyToOne
    @JoinColumn(name = "fid_roles")
    private Roles fidRoles;
}
