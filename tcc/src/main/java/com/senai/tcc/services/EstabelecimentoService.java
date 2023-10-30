package com.senai.tcc.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.senai.tcc.components.Base64ToByte;
import com.senai.tcc.components.ByteToBase64;
import com.senai.tcc.entities.Estabelecimento;
import com.senai.tcc.entities.EstabelecimentoFoto;
import com.senai.tcc.exceptions.InvalidCnpjException;
import com.senai.tcc.exceptions.ProcessamentoException;
import com.senai.tcc.repositories.EstabelecimentoRepository;

import io.micrometer.common.util.StringUtils;
import jakarta.transaction.Transactional;

@Service
public class EstabelecimentoService {
	@Autowired
	private EstabelecimentoRepository estRepository;

	
	@Transactional
	public void salvar(Estabelecimento estabelecimento) throws IllegalArgumentException, InvalidCnpjException, ProcessamentoException {
		
		validarEstabelecimento(estabelecimento);
		
		estabelecimento.setCnpj(LimparCNPJ.limpar(estabelecimento.getCnpj()));
		
		estabelecimento = inserirEstabelecimentoFoto(estabelecimento);
		
		estRepository.save(estabelecimento);
	}
	
	
	public List<Estabelecimento> obterAcessados() throws Exception{
		List<Estabelecimento> estabelecimentos = estRepository.findMostAcess();

		validarEstabMaisAcessados(estabelecimentos);
		
		estabelecimentos = conveterImgsToBase64(estabelecimentos);

		return estabelecimentos;	
	}
	
	public Estabelecimento getEstByID(Long id) throws IllegalArgumentException, InvalidCnpjException {
		validarID(id);
		
		Estabelecimento est = estRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Estabelecimento não encontrado !"));
		
		validarEstabelecimento(est);
		
		est = conveterImgToBase64(est);
		
		return est;
	}
	
	private  List<Estabelecimento> conveterImgsToBase64(List<Estabelecimento> estabelecimentos) {
		for (Estabelecimento estabelecimento : estabelecimentos) {
			estabelecimento.setFotoBase64(ByteToBase64.transformar(estabelecimento.getImagem().getFoto()));
		}
		
		return estabelecimentos;
	}
	
	private  Estabelecimento conveterImgToBase64(Estabelecimento estabelecimento) {
		
			estabelecimento.setFotoBase64(ByteToBase64.transformar(estabelecimento.getImagem().getFoto()));
		
		return estabelecimento;
	}
	
	private void validarEstabMaisAcessados(List<Estabelecimento> estabelecimentos) throws Exception {
		if(estabelecimentos == null) {
			throw new Exception("Não há estabelecimentos");
		}
	}
	
	private Estabelecimento inserirEstabelecimentoFoto(Estabelecimento estabelecimento) throws ProcessamentoException {
		EstabelecimentoFoto estab_foto = new EstabelecimentoFoto();

		estab_foto.setEstabelecimento(estabelecimento);

		estab_foto.setFoto(convertBase64ToByte(estabelecimento));

		estabelecimento.setImagem(estab_foto);
		
		return estabelecimento;

	}
	
	
	private byte[] convertBase64ToByte (Estabelecimento estabelecimento) throws ProcessamentoException {
		byte[] imgByte = Base64ToByte.transformar(estabelecimento.getFotoBase64());
		return imgByte;
	}
	
	

	private void validarEstabelecimento(Estabelecimento estabelecimento)
			throws IllegalArgumentException, InvalidCnpjException {
		
		if (StringUtils.isBlank(estabelecimento.getNome())) {
			throw new IllegalArgumentException("Campo nome não pode ser vazio");
		}
		
		Utilitarios.validarCNPJ(estabelecimento.getCnpj());
	}
	
	private void validarID(Long id) {
		if(id == null) {
			 throw new IllegalArgumentException("O ID não pode ser nulo !");
		}
	}
	

}
