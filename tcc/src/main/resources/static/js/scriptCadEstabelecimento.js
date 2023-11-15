const cnpj = document.querySelector('#cnpj');
const nome = document.querySelector('#nome');
const btnProsseguir = document.querySelector('#btnProsseguir');
const erroMsg = document.querySelector('#erroMsg');
const erroMsgForm2 = document.querySelector('#erroMsg2');
const form = document.querySelector('#form');
const sub_form = document.querySelector('#sub-form')
const file_input = document.querySelector('#file-input');
const imgPrincipal = document.querySelector('#imgPrincipal');
const cep = document.querySelector('#cep');
const bairro = document.querySelector("#bairro");
const logradouro = document.querySelector("#logradouro");
const localidade = document.querySelector("#localidade");
const btnProsseguir3 = document.querySelector('#btnProsseguir3');
const descricao = document.querySelector('#descricao');
let imagemData = "";
const radiosAcessibilidade1 = document.querySelectorAll('input[name="acessibilidade"]');
const radiosAcessibilidade2 = document.querySelectorAll('input[name="acessibilidade2"]');
const radiosAcessibilidade3 = document.querySelectorAll('input[name="acessibilidade3"]');
const erroMsg3 = document.querySelector('#erroMsg3');
const btnProsseguir2 = document.querySelector('#btnProsseguir2');
const terceiro_form = document.querySelector('#terceiro_form');
const quarto_form = document.querySelector('#quarto_form');
const btnEnviar = document.querySelector('#btnEnviar');
const diasFuncionamento = document.querySelector('#diasFuncionamento');
const horarioAbertura = document.querySelector('#horarioAbertura');
const horarioFechamento = document.querySelector('#horarioFechamento');




function mascaraCNPJ() {

	var cnpjLimpo = cnpj.value;

	if (cnpjLimpo != null) {
		// remover caracteres que não sejam numeros
		cnpjLimpo = cnpjLimpo.replace(/\D/g, "");

		//adiciona os pontos e etc.
		cnpjLimpo = cnpjLimpo.replace(/(\d{2})(\d)/, "$1.$2");
		cnpjLimpo = cnpjLimpo.replace(/(\d{3})(\d)/, "$1.$2");
		cnpjLimpo = cnpjLimpo.replace(/(\d{3})(\d)/, "$1/$2");
		cnpjLimpo = cnpjLimpo.replace(/(\d{4})(\d)/, "$1-$2");
	}

	cnpj.value = cnpjLimpo;
}


function obterValorRadio(radio) {
	for (var i = 0; i < radio.length; i++) {
		if (radio[i].checked) {
			return radio[i].value;
		}
	}
	return null;
}

function validarCampos() {
	if (!nome.value.trim() || !cnpj.value.trim()) {
		erroMsg.textContent = "Preencha todos os campos !";
		erroMsg.style = 'display: block';
		return false;
	}

	if (!descricao.value.trim()) {
		erroMsg.textContent = "Preencha todos os campos !";
		erroMsg.style = 'display: block';
		return false;
	}

	if (cnpj.value.length != 18) {
		erroMsg.textContent = "CNPJ invalido !";
		erroMsg.style = 'display: block';
		return false;
	}

	if (!file_input.value) {
		erroMsg.textContent = "Selecione uma Imagem !";
		erroMsg.style = 'display: block';
		return false;
	}

	return true;
}


function validarCamposForm2() {
	if (!cep.value.trim() || !localidade.value.trim() || !bairro.value.trim() || !logradouro.value.trim()) {
		erroMsgForm2.textContent = "Preencha Todos os Campos !";
		erroMsgForm2.style = 'display: block';
		return false;
	}

	return true;
}

function validarCamposForm3() {
	const isAcessibilidade1Checked = Array.from(radiosAcessibilidade1).some(radio => radio.checked);
	const isAcessibilidade2Checked = Array.from(radiosAcessibilidade2).some(radio => radio.checked);
	const isAcessibilidade3Checked = Array.from(radiosAcessibilidade3).some(radio => radio.checked);

	if (!isAcessibilidade1Checked || !isAcessibilidade2Checked || !isAcessibilidade3Checked) {
		erroMsg3.textContent = "Marque todos os Campos !";
		erroMsg3.style = 'display: block';
		return false;
	}

	return true;
}


function validarImagem(dadoImagem) {
	if (dadoImagem === "" || !dadoImagem) {
		erroMsg.textContent = "Erro ao processar imagem !";
		erroMsg.style = 'display: block';
		return false;
	}

	return true;
}

cnpj.addEventListener('keyup', mascaraCNPJ);


function mostrarImgEscolhida(fileInput) {
	var file = fileInput.files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		imgPrincipal.src = e.target.result;
	}

	reader.readAsDataURL(file);
}


file_input.addEventListener('change', function() {
	mostrarImgEscolhida(this);
})


//mascara de cep
$(document).ready(function() {
	$("#cep").mask("99.999-999");
});


function limparCep(cep) {
	cep = cep.replace(/[^0-9]/g, '');

	return cep;
}

function validarCamposForm4() {
	const diaFuncionamento = document.querySelector('#diasFuncionamento');
	const horarioAbertura = document.querySelector('#horarioAbertura');
	const horarioFechamento = document.querySelector('#horarioFechamento');
	const erroMsg3 = document.querySelector('#erroMsg3');

	if (!diaFuncionamento.value.trim()) {
		erroMsg3.style = 'display: block'
		erroMsg3.textContent = 'Informe os Dias de Funcionamento !';
		return false;
	}

	if (horarioAbertura > horarioFechamento) {
		erroMsg3.style = 'display: block'
		erroMsg3.textContent = 'O horario de abertura tem que ser inferior ao de fechamento !';
		return false;
	}

	return true;
}

async function verificarCnpj(cnpj) {
	const resposta = await fetch('/verificarCnpj', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(cnpj)
	})

	if (resposta.ok) {
		let textoErro = await resposta.text();
		erroMsg.textContent = textoErro;
		erroMsg.style = 'display: block';
		return false;
	}

	return true;
}




async function buscarEndereco(cep) {
	cep = limparCep(cep);

	var resposta = await fetch('https://viacep.com.br/ws/' + cep + '/json/');

	if (resposta.ok) {
		const dados = await resposta.json();

		localidade.value = dados.localidade;
		bairro.value = dados.bairro;
		logradouro.value = dados.logradouro;
	}
}

cep.addEventListener('blur', () => {
	const cepValor = cep.value;

	buscarEndereco(cepValor);
});

function imgToBase64(imagem) {
	return new Promise((resolve, reject) => {
		const arquivo = imagem.files[0];

		if (!arquivo) {
			reject(new Error("Nenhum arquivo fornecido."));
			return;
		}

		const reader = new FileReader();

		reader.onloadend = function() {
			const img = new Image();
			img.src = reader.result;

			img.onload = function() {
				const canvas = document.createElement('canvas');
				const canvasContexto = canvas.getContext('2d');

				const larguraImg = 1366;
				const alturaImg = 768;

				canvas.width = larguraImg;
				canvas.height = alturaImg;

				canvasContexto.drawImage(img, 0, 0, larguraImg, alturaImg);
				try {
					const imagem64 = canvas.toDataURL('image/jpeg', 0.8);
					resolve(imagem64);
				} catch (error) {
					reject(new Error("Erro ao processar a imagem"));
				}

			}

			img.onerror = function() {
				reject(new Error("Erro ao carregar a imagem"));
			}

		}

		reader.onerror = function() {
			reject(new Error("Erro na leitura do arquivo."));
		}

		reader.readAsDataURL(arquivo);
	})
}

async function processarImagem() {
	try {
		const imagem64 = await imgToBase64(file_input);
		return imagem64;
	} catch (error) {
		console.error(error.mesage);
		return null;
	}
}

cnpj.addEventListener('blur', async () => {
	verificarCnpj(cnpj.value);
})

btnProsseguir.addEventListener('click', async () => {
	if (validarCampos()) {

		imagemData = await processarImagem();

		if (verificarCnpj(cnpj.value)) {
			if (validarImagem(imagemData)) {
				form.style = 'display:none';
				terceiro_form.style = 'display:flex';
			}
		}
	}
})


btnProsseguir2.addEventListener('click', () => {
	if (validarCamposForm3()) {
		terceiro_form.style = 'display:none'
		sub_form.style = 'display:flex'
	}
})

btnProsseguir3.addEventListener('click', () => {
	if (validarCamposForm2()) {
		sub_form.style = 'display:none'
		quarto_form.style = 'display:flex';
	}
})



btnEnviar.addEventListener('click', async () => {
	if (validarCamposForm4()) {
		try {


			const estabelecimentoDados = {
				nome: nome.value,
				cnpj: cnpj.value,
				endereco: {
					logradouro: logradouro.value,
					cep: cep.value,
					bairro: bairro.value,
					localidade: localidade.value
				},
				fotoBase64: imagemData,
				descricao: descricao.value,
				rampa_acessivel: obterValorRadio(radiosAcessibilidade1),
				estacionamento_acessivel: obterValorRadio(radiosAcessibilidade2),
				banheiro_acessivel: obterValorRadio(radiosAcessibilidade3),
				estHorario: {
					diaSemana: diasFuncionamento.value,
					horarioAbertura: horarioAbertura.value,
					horarioFechamento: horarioFechamento.value
				}
			};

			const resposta = await fetch('/estabelecimento/cadastrar', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(estabelecimentoDados)
			})

			if (resposta.ok) {
				alert("Salvo Com Sucesso !");
				window.location.href = '/'
			}

		} catch (error) {
			const erroMsg = error.message;
			erroMsgForm2.textContent = erroMsg;
			erroMsgForm2.style = 'display: block';
		}
	}
})








