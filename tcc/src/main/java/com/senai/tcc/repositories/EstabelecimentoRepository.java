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

	@Query(value = "select * from estabelecimento\r\n" + "where cnpj = :cnpj", nativeQuery = true)
	Optional<Estabelecimento> findByCnpj(@Param("cnpj") String cnpj);

	
	@Query(value = "select * from estabelecimento where nome like %:nome%", nativeQuery = true)
	List<Estabelecimento> obterEstabsPeloNome(@Param("nome") String nome);
	
	@Query(value = "select top(3) * from estabelecimento\r\n"
	        + "where (nome like %:nome% or :nome is null) and\r\n"
	        + "(banheiro_acessivel = :banheiro or :banheiro is null) and\r\n"
	        + "(rampa_acessivel = :rampa or :rampa is null) and\r\n"
	        + "(estacionamento_acessivel = :estac or :estac is null)", nativeQuery = true)
	List<Estabelecimento> obterEstabsFiltrados(@Param("nome") String nome,
	                                           @Param("banheiro") String banheiro,
	                                           @Param("rampa") String rampa,
	                                           @Param("estac") String estac);


}
