package com.senai.tcc.services;

import io.micrometer.common.util.StringUtils;

public class LimparCEP {
	public static String limpar(String cep) {
		if (StringUtils.isBlank(cep)) {
			return null;
		}
		
		cep = cep.replace("/\\D/g", "");
		return cep;
	}
}
