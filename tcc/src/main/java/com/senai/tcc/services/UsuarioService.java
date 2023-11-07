package com.senai.tcc.services;

import java.security.InvalidAlgorithmParameterException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.senai.tcc.components.Base64ToByte;
import com.senai.tcc.components.ByteToBase64;
import com.senai.tcc.entities.Usuario;
import com.senai.tcc.exceptions.InvalidCpfException;
import com.senai.tcc.exceptions.InvalidEmailException;
import com.senai.tcc.exceptions.InvalidFotoException;
import com.senai.tcc.exceptions.ProcessamentoException;
import com.senai.tcc.repositories.UsuarioRepository;

import javassist.NotFoundException;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepostiory;
	@Autowired
	private PasswordEncoder enconder;

	public List<Usuario> listarUsuarios() {
		List<Usuario> listaUsuarios = usuarioRepostiory.findAll();
		return listaUsuarios;
	}

	public Usuario acharUsuario(Long id) {
		Usuario usr = usuarioRepostiory.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado !"));

		usr = conveterImgToBase64(usr);

		return usr;
	}

	public Usuario achaUsuarioCpf(String cpf) throws InvalidCpfException, NotFoundException {

		Utilitarios.validarCPF(cpf);

		cpf = LimparCPF.limpar(cpf);

		Usuario usr = usuarioRepostiory.findByCpf(cpf)
				.orElseThrow(() -> new NotFoundException("Usuario não encontrado !"));

		usr = conveterImgToBase64(usr);

		return usr;

	}

	public void salvarUsuario(Usuario usr) throws InvalidCpfException, InvalidAlgorithmParameterException,
			ProcessamentoException, InvalidFotoException {

		validarCampos(usr);

		limparCEP(usr);

		limparCPF(usr);

		criptografarSenha(usr);

		conveterImgBase64ParaByte(usr);

		usuarioRepostiory.save(usr);

	}

	public void apagarUsuario(Long id) {
		usuarioRepostiory.deleteById(id);
	}

	public boolean verificarCPF(String cpf) throws InvalidCpfException {

		Utilitarios.validarCPF(cpf);

		cpf = LimparCPF.limpar(cpf);

		Optional<Usuario> usr = usuarioRepostiory.findByCpf(cpf);

		if (usr.isPresent()) {
			return true;
		}

		return false;
	}

	public boolean login(String cpf, String senha) throws Exception {
		try {

			cpf = LimparCPF.limpar(cpf);
			Optional<Usuario> usrOptional = usuarioRepostiory.findByCpf(cpf);

			if (usrOptional.isEmpty()) {
				return false;
			}

			if (enconder.matches(senha, usrOptional.get().getSenha())) {
				return true;
			}

			return false;
		} catch (Exception erro) {
			throw new Exception("CPF ou Senha incorretos !");
		}

	}

	public Long buscarIdPeloCpf(String cpf) {
		cpf = LimparCPF.limpar(cpf);

		return usuarioRepostiory.findByCpf(cpf).map(Usuario::getId).orElse(null);
	}

	public void verificarUsuarioCpfEmail(String cpf, String email)
			throws InvalidCpfException, InvalidEmailException, NotFoundException {

		Utilitarios.validarCPF(cpf);

		Utilitarios.validarEmail(email);

		Optional<Usuario> usr = usuarioRepostiory.findByCpfAndEmail(cpf, email);

		if (usr.isEmpty()) {
			throw new NotFoundException("CPF ou Email estão incorretos");
		}

	}

	public String buscarNomePeloCpf(String cpf) throws InvalidCpfException, NotFoundException {
		Utilitarios.validarCPF(cpf);

		cpf = LimparCPF.limpar(cpf);

		Optional<Usuario> usr = usuarioRepostiory.findByCpf(cpf);

		if (usr.isPresent()) {
			return usr.get().getNome();
		} else {
			throw new NotFoundException("Usuario não encontrado !");
		}
	}

	private Usuario conveterImgToBase64(Usuario usr) {
		usr.setFotoBase64(ByteToBase64.transformar(usr.getUsrImg()));
		return usr;
	}

	private void limparCEP(Usuario usr) {
		String cep = usr.getEndereco().getCep();

		cep = LimparCEP.limpar(cep);

		usr.getEndereco().setCep(cep);

	}

	private void validarCampos(Usuario usr)
			throws InvalidCpfException, InvalidAlgorithmParameterException, InvalidFotoException {

		Utilitarios.validarCPF(usr.getCpf());

		Utilitarios.validarSenha(usr.getSenha());

		Utilitarios.validarImgBase64(usr.getFotoBase64());
	}

	private void limparCPF(Usuario usr) {
		String cpfLimpo = LimparCPF.limpar(usr.getCpf());

		usr.setCpf(cpfLimpo);
	}

	private void criptografarSenha(Usuario usr) throws InvalidAlgorithmParameterException {
		String senhaCript = CriptografaSenha.encriptarSenha(usr.getSenha());

		usr.setSenha(senhaCript);

	}

	private void conveterImgBase64ParaByte(Usuario usr) throws ProcessamentoException {
		byte[] imgByte = Base64ToByte.transformar(usr.getFotoBase64());

		usr.setUsrImg(imgByte);
	}

}
