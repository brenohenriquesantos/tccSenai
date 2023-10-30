package com.senai.tcc.components;

import java.util.Base64;

import com.senai.tcc.exceptions.ProcessamentoException;

public class Base64ToByte {
	public static byte[] transformar(String base64) throws ProcessamentoException {
		try {
			byte[] arrayByte = Base64.getDecoder().decode(base64);
			return arrayByte;
		} catch (IllegalArgumentException e) {
			throw new ProcessamentoException("Erro ao processar para byte !");
		}

	}

}
