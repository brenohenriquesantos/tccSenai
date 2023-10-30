package com.senai.tcc.entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class EmpresaColaborador extends Pessoa {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
	@JoinColumn(name = "estabelecimentoID")
	private Estabelecimento estabelecimento;
	

	public EmpresaColaborador(String nome, String cpf, 
			LocalDate data_nasc, Endereco endereco, Estabelecimento estabelecimento) {
		super(nome, cpf, data_nasc, endereco);
		this.estabelecimento = estabelecimento;
	}
	
	public EmpresaColaborador() {
		
	}


	

	
	
}
