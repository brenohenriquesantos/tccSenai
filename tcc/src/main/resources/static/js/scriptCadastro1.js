//DOM
const btnProsseguir = document.querySelector("#btnProsseguir");
const cpf = document.querySelector("#cpf");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const data = document.querySelector("#data");
const nome = document.querySelector("#nome");
const senhaConfirmar = document.querySelector("#senhaConfirmar");
const copyright = document.querySelector("#copyright");
const filerInput = document.querySelector('#file-input');
const imgPrincipal = document.querySelector('#imgPrincipal');
let imagemData = "";
//DOM








//funções
function validarEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

//mascara cpf
$(document).ready(function() {
	$('#cpf').mask('000.000.000-00');
});

function validarSenha(senhaParaValidar) {
	if (senhaParaValidar.length < 8) {
		return false;
	} else {
		return true;
	}
}

function senhaIguais(senha1, senha2) {
	if (senha1 != senha2) {
		return false;
	} else {
		return true;
	}
}

function verificarCampos(event) {
	const camposForm = [cpf, email, senha, senhaConfirmar];

	var camposPreenchidos = true;

	camposForm.forEach(function(campo) {
		if (!campo.value.trim()) {
			camposPreenchidos = false;
		}
	});

	if (!camposPreenchidos) {
		event.preventDefault();
		alert("Preencha Todos os Campos!");
		return false;
	} else {
		return true;
	}
}

function validarImagem(dadoImagem) {
	if (dadoImagem === "" || !dadoImagem) {
		return false;
	}

	return true;
}

async function amazenarDados() {

	event.preventDefault();
	
	const imagem = await processarImagem();

	localStorage.setItem("cpf", cpf.value);
	localStorage.setItem("email", email.value);
	localStorage.setItem("senha", senha.value);
	localStorage.setItem("data", data.value);
	localStorage.setItem("nome", nome.value);
	localStorage.setItem("imagem", imagem.value);
	

	window.location.href = "/cadastro/";

	return false;
}

function verificarCPF(cpfParaVerificar) {
	fetch('/verificarCPF', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(`"${cpfParaVerificar}"`)
	})
		.then(response => {
			if (!response.ok) {
				return response.text()
					.then(data => {
						if (data.includes('vazio')) {
							return null;
						} else {
							alert(data)
						}
					});
			}
		})
}

function mostrarImgEscolhida(fileInput) {
	var file = fileInput.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		imgPrincipal.src = e.target.result;
	}

	reader.readAsDataURL(file);
}

function toBase64(imagem) {
	return new Promise((resolve, reject) => {
		const arquivo = imagem.files[0];

		if (!arquivo) {
			reject(new Error("Nenhum arquivo fornecido."));
			return;
		}

		const reader = new FileReader();

		reader.onloadend = function() {
			const imagem64 = reader.result.replace("data:", "").replace(/^.+,/, "");
			resolve(imagem64);
		}

		reader.onerror = function() {
			reject(new Error("Erro na leitura do arquivo."));
		}

		reader.readAsDataURL(arquivo);
	})
}

async function processarImagem() {
	try {
		const imagem64 = await toBase64(filerInput);
		return imagem64;
	} catch (error) {
		return null;
	}
}


//funções

//eventos
//Depois de carrregar todo o html
document.addEventListener("DOMContentLoaded", () => {
	var anoAtual = new Date().getFullYear();
	copyright.textContent = "© " + anoAtual + " ODIN. Todos os direitos reservados";
})


email.addEventListener("blur", function() {
	var verificar = validarEmail(email.value);
	var alertaMostrado = false;

	if (!verificar && !alertaMostrado) {
		email.value = "";
		alertaMostrado = true;
		alert("Por favor, insira um endereço de email válido.");
		alertaMostrado = false;
	}
});

senha.addEventListener("blur", function() {
	var retorno = validarSenha(senha.value);
	var alertaMostrado = false;

	if (!retorno && !alertaMostrado) {
		senha.value = "";
		alertaMostrado = true;
		alert("Por favor, insira uma senha valida!");
		alertaMostrado = false;

	}
});

senhaConfirmar.addEventListener("blur", function() {
	var retorno = senhaIguais(senha.value, senhaConfirmar.value);
	var alertaMostrado = false;

	if (!retorno && !alertaMostrado) {
		senha.value = "";
		senhaConfirmar.value = ""
		alertaMostrado = true;
		alert("As senhas devem ser iguais !");
		alertaMostrado = false;
	}
});

btnProsseguir.addEventListener("click", function(event) {
	var retorno = verificarCampos(event);
	if (retorno) {
		
		if(validarImagem(imgPrincipal)){
			amazenarDados();
		localStorage.clear();
		}else{
			alert("Escolha uma foto !");
		}
	}
});

cpf.addEventListener("blur", function() {
	verificarCPF(cpf.value);
});


filerInput.addEventListener('change', function() {
	mostrarImgEscolhida(this);
})
