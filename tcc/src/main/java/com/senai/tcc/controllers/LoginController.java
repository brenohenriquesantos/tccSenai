package com.senai.tcc.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.senai.tcc.services.CookieService;
import com.senai.tcc.services.UsuarioService;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class LoginController {
	
	@Autowired
	UsuarioService usuarioService;
	
	@PostMapping("/login")
	public ResponseEntity<Boolean> fazerLogin(@RequestBody Map<String, String> credenciais,
			HttpServletResponse response){
		try {
			
			boolean retorno = false;
			
			String cpf = credenciais.get("cpf");
			String senha = credenciais.get("senha");

			retorno = usuarioService.login(cpf,senha);
			
			if(retorno) {
				
				int segCookie = 1800;
				
				CookieService.setCookie(response, "usuarioID",
						String.valueOf(usuarioService.buscarIdPeloCpf(cpf)), segCookie);
				
				return ResponseEntity.ok(true);
			}
			
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
			
		}catch(Exception erro) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
		}
	}
	
	@GetMapping("/login")
	public String redirecionarLogin() {
		return "login/formLogin";
	}
}
