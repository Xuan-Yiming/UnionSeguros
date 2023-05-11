package com.pucp.unionseguros.repository.SOATRepository;

import com.pucp.unionseguros.model.SOAT.PlanSOAT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PlanSOATRepository extends JpaRepository<PlanSOAT, Integer> {
    public PlanSOAT findPlanSOATByIdAndActivoIsTrue(Integer id);
    public List<PlanSOAT> findPlanSOATByActivoIsTrue();
    @Query(nativeQuery = true, value = "SELECT id_plan_soat,nombre_plan,cobertura,precio,activo FROM plan_soat \n" +
            "    WHERE CONCAT(CAST(id_plan_soat AS CHAR), nombre_plan, CAST(cobertura AS CHAR)," +
            " CAST(precio AS CHAR), CAST(activo AS CHAR)) \n" +
            "    LIKE CONCAT('%', ?1, '%') ORDER BY nombre_plan ASC ")
    public List<PlanSOAT> findPlanSOAT(String busqueda);
}
