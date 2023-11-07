//DOOM
const cep = document.querySelector("#cep");
const btnEnviar = document.querySelector("#enviar");
//DOOM

//Valores dos Campos
const cpf = localStorage.getItem("cpf");
const email = localStorage.getItem("email");
const senha = localStorage.getItem("senha");
const data = localStorage.getItem("data");
const nome = localStorage.getItem("nome");
const imagem = localStorage.getItem("imagem");
const bairro = document.querySelector("#bairro");
const logradouro = document.querySelector("#logradouro");
const localidade = document.querySelector("#localidade");
const cepValor = document.querySelector("#cep");


//funcoes



//mascara de cep
$(document).ready(function(){
	$("#cep").mask("99.999-999");
  });
  
 
 function limparCep(cep){
	 cep = cep.replace(/[^0-9]/g, '');
	 
	 return cep;
 }
  
  
async function buscarEndereco() {
	
	
	var cepValor = document.querySelector("#cep").value;
	cepValor = limparCep(cepValor);

	if (cepValor != null && cepValor.length === 8) {
		var resposta = await fetch("/buscarEndereco?cep=" + cepValor);
		
		if(resposta.ok){
			const data = await resposta.json();
			bairro.value = data.bairro;
			logradouro.value = data.logradouro;
			localidade.value = data.localidade;
		}else{
			const erroMsg =  await resposta.text();
			alert(erroMsg);
		}
			
	}
	
	
}

 async function enviarDadosBack() {

	const dadosJuntos = {
		cpf,
		email,
		senha,
		data,
		nome,
		endereco: {
			bairro: bairro.value,
			logradouro: logradouro.value,
			localidade: localidade.value,
			cep: cepValor.value
		},
		fotoBase64: imagem
	};

	const resposta = await fetch("/cadastrarUsuario", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dadosJuntos)
	})
	
	if(!resposta.ok){
		const erroTexto = await resposta.text();
		alert(erroTexto);
	}
	
	const msgSucesso = await resposta.text();
	alert(msgSucesso);
	window.location.href = "/";
	
}

function verificarCampos() {

	var valido = true;

	const campos = {
		cpf,
		email,
		senha,
		data,
		nome,
        imagem,
		bairro,
		logradouro,
		localidade,
		cepValor
	};

	Object.values(campos).forEach(function(campo) {
		if (typeof campo === "string" &&  !campo.trim()) {
			valido = false;
		}
	})

	if (!valido) {
		alert("Preencha Todos os Campos !");
		return false;
	} else {
		return true;
	}
}

//eventos
cep.addEventListener("blur", buscarEndereco);

btnEnviar.addEventListener("click", () => {
	
	event.preventDefault();
	
	var retorno = verificarCampos();

	if (retorno) {
		enviarDadosBack();
	}
});

