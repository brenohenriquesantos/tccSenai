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
const bairro = document.querySelector("#bairro").value;
const logradouro = document.querySelector("#logradouro").value;
const localidade = document.querySelector("#localidade").value;
const cepValor = document.querySelector("#cep").value;


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
			document.querySelector("#bairro").value = data.bairro;
			document.querySelector("#logradouro").value = data.logradouro;
			document.querySelector("#localidade").value = data.localidade;
		}else{
			const erroMsg =  await resposta.text();
			alert(erroMsg);
		}
			
	}
	
	
}

function enviarDadosBack() {

	const dadosJuntos = {
		cpf,
		email,
		senha,
		data,
		nome,
		endereco: {
			bairro,
			logradouro,
			localidade,
			cep: cepValor
		}
	};

	fetch("/cadastrarUsuario", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dadosJuntos)
	})
		.then(response => {

			if (!response.ok) {
				return response.text().then(text => Promisse.reject(text));
			}

			return response.text();
		})
		.then(data => {
			alert(data);
			window.location.href = "/";
		}).catch(error => {
			alert(error);
			window.location.href = "/";
		});
}

function verificarCampos() {
	preventDefault();

	var valido = true;

	const campos = {
		cpf,
		email,
		senha,
		data,
		nome,
		endereco,
		bairro,
		logradouro,
		localidade,
		cepValor
	};

	campos.forEach(function(campo) {
		if (!campo.trim()) {
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
	var retorno = verificarCampos();

	if (retorno) {
		enviarDadosBack();
	}
});

