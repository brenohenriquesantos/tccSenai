package com.senai.tcc.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Estabelecimento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String nome;
	@Column(nullable = false, unique = true)
	private String cnpj;
	@Transient
	private String fotoBase64;
	@JsonIgnore
	@Lob
	private byte[] imgEstabelecimento;
	@ManyToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "enderecoID")
	private Endereco endereco;
	@Column(nullable = false)
	@Lob
	private String descricao;
	@Column(nullable = false, length = 3)
	private String rampa_acessivel;
	@Column(nullable = false, length = 3)
	private String estacionamento_acessivel;
	@Column(nullable = false, length = 3)
	private String banheiro_acessivel;
	@JoinColumn(name = "horario_id")
	@OneToOne(mappedBy = "est", cascade = CascadeType.ALL)
	private EstHorarioFuncionamento estHorario;

	

}
