package com.senai.tcc.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.senai.tcc.entities.Estabelecimento;

@Repository
public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {
	@Query(value = "Select TOP 3 * FROM estabelecimento", nativeQuery = true)
	List<Estabelecimento> findMostAcess();
	
	@Query(value = "select * from estabelecimento\r\n"
			+ "where cnpj = :cnpj", nativeQuery = true)
	Optional<Estabelecimento> findByCnpj(@Param("cnpj") String cnpj);
	
	@Query(value = "select id, nome,img_estabelecimento\r\n"
			+ "from estabelecimento\r\n"
			+ "where nome like %:nome%", nativeQuery = true)
	Optional<List<Estabelecimento>> findEstabsByName(@Param("nome") String nome);
}
