package com.senai.tcc.entities;

import java.sql.Time;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
public class EstHorarioFuncionamento {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String diaSemana;
	@Column(nullable = false)
	private Time horarioAbertura;
	@Column(nullable = false)
	private Time horarioFechamento;
	@OneToOne
	@JoinColumn(name = "estabelecimento_id")
	private Estabelecimento est;
}
