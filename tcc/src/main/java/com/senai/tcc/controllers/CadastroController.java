package com.senai.tcc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.senai.tcc.entities.Usuario;
import com.senai.tcc.exceptions.InvalidCpfException;
import com.senai.tcc.services.UsuarioService;
import com.senai.tcc.services.Utilitarios;

import jakarta.validation.Valid;

@Controller
public class CadastroController {
	
	@Autowired
	UsuarioService usuarioService;
	
	@GetMapping("/cadastro")
	public String redirecionarForm1() {
		return "cadastro/formCadastro";
	}
	
	@GetMapping("/cadastro/")
	public String redirecionarForm2(){
		return "cadastro/formCadastro2";
	}
	
	
	@PostMapping("/cadastrarUsuario")
	public ResponseEntity<String> cadastrarUsuario(@RequestBody @Valid Usuario usr){
		try {
			Usuario novoUsuario = usuarioService.salvarUsuario(usr);
			
			if(novoUsuario != null) {
				return ResponseEntity.ok("Cadastrado Com Sucesso !");
			}else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro ao salvar !");
			}
			
		} catch (DataIntegrityViolationException dive) {
			// banco de dados.
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Ocorreu um erro no servidor.");
		} catch (Exception e) {
			// Captura todas as outras exceções não esperadas.
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor.");
		}
	}
	
	@PostMapping("/verificarCPF")
	public ResponseEntity<String> verificarCPF(@RequestBody String cpf) {

		try {
			
			Utilitarios.validarCPF(cpf);
			
			boolean retorno;
			retorno = usuarioService.verificarCPF(cpf);

			if (retorno) {
				return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF já esta cadastrado !");
			} else {
				return ResponseEntity.ok(null);
			}
		} catch (InvalidCpfException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}

	}
	
}
