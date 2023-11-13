const linkLogin = document.querySelector('#login');
const nomeCookie = "usuarioID";

function verificarCookie(nomeCookie) {
	var cookieValor = document.cookie.split(';').find(row => row.trim().startsWith(nomeCookie + '='));

	if (cookieValor) {
		return true;
	}

	return false;
}

function deleteCookie(name, path, domain) {
	if (verificarCookie(name)) {
		document.cookie = name + "=" +
			((path) ? ";path=" + path : "") +
			((domain) ? ";domain=" + domain : "") +
			";expires=Thu, 01 Jan 1970 00:00:01 GMT";
	}
}


if (verificarCookie(nomeCookie)) {
	linkLogin.textContent = 'Deslogar'
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




document.addEventListener('DOMContentLoaded', () => {
	popularEstabelecimentos();

	verificarAdm();
})
