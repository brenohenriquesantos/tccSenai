package com.senai.tcc.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Usuario extends Pessoa {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY )
	private Long id;
	@Column(nullable = false)
	private String senha;
	@Column(nullable = false)
	private String email;
	

	
	
	public Usuario(String nome, String cpf, LocalDate data_nasc, Endereco endereco, String senha) {
		super(nome, cpf, data_nasc, endereco);
		this.senha = senha;
	}



	public Long getId() {
		return id;
	}


	public String getSenha() {
		return senha;
	}



	public void setSenha(String senha) {
		this.senha = senha;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}
	
	
	
	
	
}
