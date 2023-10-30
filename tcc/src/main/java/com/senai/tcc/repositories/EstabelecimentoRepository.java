package com.senai.tcc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.senai.tcc.entities.Estabelecimento;

@Repository
public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {
	@Query(value = "Select TOP 3 * FROM estabelecimento", nativeQuery = true)
	List<Estabelecimento> findMostAcess();
}
