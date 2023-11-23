package com.senai.tcc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.senai.tcc.entities.Estabelecimento;
import com.senai.tcc.exceptions.InvalidCnpjException;
import com.senai.tcc.exceptions.NotFoundEstabelecimentos;
import com.senai.tcc.exceptions.ProcessamentoException;
import com.senai.tcc.services.EstabelecimentoService;

@Controller
public class EstabelecimentoController {
	
	@Autowired
	EstabelecimentoService estService;
	
	@GetMapping("/estabelecimento/cadastrar")
	public String cadastrar() {
		return "/cadastro/formCadastroEstabelecimento";
	}
	
	
	@PostMapping("/estabelecimento/cadastrar")
	public ResponseEntity<String> cadastrar(@RequestBody Estabelecimento estabelecimento) {
		try {
			estService.salvar(estabelecimento);
			return ResponseEntity.ok("Cadastrado com Sucesso !");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (InvalidCnpjException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (ProcessamentoException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}
	
	@GetMapping("/estabelecimento/acessados")
	public ResponseEntity<?> acessados(){
		try {
			return ResponseEntity.ok(estService.obterAcessados());
		}catch (Exception e) {
			return ResponseEntity.internalServerError().body(e.getMessage());
		}
		
	}
	
	@GetMapping("/estabelecimento/consultar")
	public ResponseEntity<?> obterEstabelecimentoById(@RequestParam Long id){
		try {
			return ResponseEntity.ok(estService.getEstByID(id));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (InvalidCnpjException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}catch(Exception e) {
			return ResponseEntity.internalServerError().body("Erro ao processar Solicitação !");
		}
	}
	
	@GetMapping("/estabelecimento/")
	public String obterFormEstabelecimento() {
		return "estabelecimento/formEstabelecimento";
	}
	
	@PostMapping("/verificarCnpj")
	public ResponseEntity<?> consultarCnpj(@RequestBody String cnpj){
		try {
			if(estService.consultarEstByCnpj(cnpj)) {
				return ResponseEntity.ok("CNPJ já cadastrado !");
			}
			
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("CNPJ não encontrado !");
		} catch (InvalidCnpjException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PostMapping("/consultarEstabelecimentos")
	public ResponseEntity<?> consultarEstabelecimentos(@RequestBody String nome){
		try {
			return ResponseEntity.ok(estService.obterEstabsPeloNome(nome));
		}catch (NotFoundEstabelecimentos e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}catch (Exception e) {
			return ResponseEntity.internalServerError().body("Ocorreu um erro ao consultar");
		}
	}
}
