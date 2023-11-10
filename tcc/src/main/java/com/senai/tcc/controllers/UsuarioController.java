package com.senai.tcc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.senai.tcc.entities.Usuario;
import com.senai.tcc.services.UsuarioService;

@Controller
public class UsuarioController {

	@Autowired
	private UsuarioService usrService;

	@GetMapping("usuario/consultar")
	public ResponseEntity<?> obterUsuario(@RequestParam Long id) {
		try {
			Usuario usr = usrService.acharUsuario(id);
			return ResponseEntity.ok(usr);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Ocorreu um erro no servidor.");
		}
	}
}
