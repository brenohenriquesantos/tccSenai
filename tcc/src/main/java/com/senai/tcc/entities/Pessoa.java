package com.senai.tcc.entities;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter @Setter
public class Pessoa {
	
	@NotBlank
	private String nome;
	@Column(unique = true, nullable = false)
	private String cpf;
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate data;
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "enderecoID")
	private Endereco endereco;
	
	
	public Pessoa(String nome, String cpf, LocalDate data_nasc, Endereco endereco) {
		this.nome = nome;
		this.cpf = cpf;
		this.data = data_nasc;
		this.endereco = endereco;
	}
	
	public Pessoa() {
		
	}
	

	
}
