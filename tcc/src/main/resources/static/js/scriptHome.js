const linkLogin = document.querySelector('#login');
const nomeCookie = "usuarioID";
const inputPesquisa = document.querySelector('#inputPesquisa');
const listaPesquisaResult = document.querySelector('.listaProdutos');


function verificarCookie(nomeCookie) {
	var cookieValor = document.cookie.split(';').find(row => row.trim().startsWith(nomeCookie + '='));

	if (cookieValor) {
		return true;
	}

	return false;
}

function deleteCookie(nomeCookie) {
	fetch('/deslogar', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: nomeCookie
	}
	)
}


function verificarLogado() {

	if (verificarCookie(nomeCookie)) {
		linkLogin.textContent = 'Deslogar'
	} else {
		linkLogin.textContent = 'Login'
	}
}



linkLogin.addEventListener('click', () => {
	if (verificarCookie(nomeCookie)) {
		deleteCookie(nomeCookie);
	}

	window.location.href = "/login"

})

async function buscarEstabMaisAcessados() {
	try {
		let resposta = await fetch('/estabelecimento/acessados');

		if (!resposta.ok) {
			resposta = await resposta.text();
			throw new Error(resposta);
		}

		const dados = await resposta.json();

		return dados;
	} catch (erro) {
		console.log(erro.message);
	}
}

async function popularEstabelecimentos() {

	const dados = await buscarEstabMaisAcessados();

	const containers = document.querySelectorAll('#services > .container');

	containers.forEach((container, index) => {

		if (dados[index]) {
			const link = container.querySelector('a');
			const imagem = container.querySelector('img');
			const titulo = container.querySelector('h2');
			const descricao = container.querySelector('p');

			titulo.textContent = dados[index].nome;
			descricao.textContent = dados[index].descricao;
			link.setAttribute('href', '/estabelecimento/?id=' + dados[index].id);
			imagem.src = "data:image/jpeg;base64," + dados[index].fotoBase64;
		}
	})
}

function verificarAdm() {
	const isAdm = sessionStorage.getItem('isAdm');
}

async function obterEstabs(nomeLocal) {

	try {
		const resposta = await fetch('/consultarEstabNome', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: nomeLocal
		});

		if (resposta.ok) {
			const dados = await resposta.json();

			return dados;
		}

		return null;
	} catch (error) {
		console.log('Erro ao consultar o estabelecimento com  o valor informado');
	}



}


inputPesquisa.addEventListener('input', async (event) => {
	const nomeAtual = event.target.value

	if (nomeAtual) {
		const retorno = await obterEstabs(nomeAtual);

		if (retorno != null && retorno.length > 0) {

			listaPesquisaResult.style = 'display:block';

			const ul = document.querySelector('#lista');

			ul.innerHTML = "";

			ul.style = 'display:block';

			for (i = 0; i < retorno.length; i++) {
				const li = document.createElement("li");

				li.innerHTML = `
					<a href="/estabelecimento/?id=${retorno[i].id}">
							<img width="80px" src="data:image/jpeg;base64,${retorno[i].fotoBase64}" alt="">
							<span class="item-name">${retorno[i].nome}</span>
					</a>
		`;

				ul.appendChild(li);
			}
		} else {
			listaPesquisaResult.style = 'display:none';
		}
	} else {
		listaPesquisaResult.style = 'display:none';
	}

})


document.addEventListener('DOMContentLoaded', () => {
	popularEstabelecimentos();

	verificarLogado()

	verificarAdm();
})
