//DOOM

const imgEstabelecimento = document.querySelector('#imgEstabelecimento');
const titulo = document.querySelector('#titulo');
const descricao = document.querySelector('#descricao');
const estacionamento = document.querySelector('#estacionamento');
const rampa = document.querySelector('#rampa');
const banheiro = document.querySelector('#banheiro');
const btnEnviar = document.querySelector('#btnEnviar');
const message = document.querySelector('#message');
const numeroComentarios = document.querySelector('#numeroComentarios');
const comentarios = document.querySelector('#comentarios');
const map = L.map('map');

let latitude = 0;
let longitude = 0;
let marker, circle, zoomed;




function obterIdUrl() {
	const url = window.location.search;

	var urlParametro = new URLSearchParams(url);

	var id = urlParametro.get('id');

	return id;
}

function limparCep(cep) {
	cep = cep.replace(/[^0-9]/g, '');

	return cep;
}


async function obterEstabelecimento(id) {
	let resposta = await fetch('/estabelecimento/consultar?id=' + id);

	try {
		if (!resposta.ok) {
			alert("Deu erro");
		} else {
			const dados = await resposta.json();
			return dados;
		}
	} catch (erro) {
		window.location.href = "/login";
	}

}

function alterarBackgroundServices(dados) {
	if (dados.estacionamento_acessivel === 'S') {
		estacionamento.classList.add('hover-green');
	}

	if (dados.rampa_acessivel === 'S') {
		rampa.classList.add('hover-green');
	}

	if (dados.banheiro_acessivel === 'S') {
		banheiro.classList.add('hover-green');
	}
}

function obterValorCookie(nomeCookie) {
	var cookieString = document.cookie.split(';').find(row => row.trim().startsWith(nomeCookie + '='));

	if (!cookieString) {
		return null;

	}

	return cookieString.split('=')[1];
}

async function obterComentarios(idForm) {
	if (idForm === null) {
		throw new Error("Formulario vazio !");
	}

	const resposta = await fetch('/estabelecimento/comentarios?estabID=' + idForm);

	if (!resposta.ok) {
		throw new Error("Erro ao buscar os comentarios")
	}

	const listaComentarios = await resposta.json();
	return listaComentarios;
}

function criarCorpoComentario(comentario) {

	let divBody = document.createElement('div');
	divBody.classList.add('media-body');

	let h4 = document.createElement('h4');
	h4.classList.add('media-heading');
	h4.textContent = comentario.usr.nome;

	let p = document.createElement('p');
	p.textContent = comentario.texto;

	divBody.appendChild(h4);
	divBody.appendChild(p);


	let ul = document.createElement('ul');
	ul.classList.add("list-unstyled", "list-inline", "media-detail", "pull-left");


	let li = document.createElement('li');

	let i = document.createElement('i');
	i.classList.add("fa", "fa-calendar");



	li.appendChild(i);
	li.textContent = formatarData(comentario.data);

	ul.appendChild(li);

	divBody.appendChild(ul);

	return divBody;
}

function criarComentario(comentario) {

	let div = document.createElement('div');
	div.classList.add('media');

	let a = document.createElement('a');
	a.classList.add('pull-left');

	let img = document.createElement('img');
	img.src = "data:image/jpg;base64," + comentario.usr.fotoBase64;

	a.appendChild(img);

	div.appendChild(a);

	let divBody = criarCorpoComentario(comentario);

	div.appendChild(divBody);

	return div;

}

async function listarComentarios() {
	try {
		const idForm = obterIdUrl();

		const listaComentarios = await obterComentarios(idForm);

		numeroComentarios.textContent = listaComentarios.length + " Comentario(s)";

		listaComentarios.forEach(comentario => {

			let divComentario = criarComentario(comentario);
			comentarios.appendChild(divComentario);
		})

	} catch (Erro) {

		alert(Erro);
	}


}

async function carregarImgUsr() {

	if (verificarUsrLogado()) {

		const id = obterValorCookie('usuarioID');

		const resposta = await fetch('/usuario/consultar?id=' + id);

		if (resposta.ok) {

			const dados = await resposta.json();

			const imgUsr = document.querySelector('#imgUsr');

			imgUsr.src = "data:image/jpeg;base64," + dados.fotoBase64;
		}
	}


}

function verificarUsrLogado() {
	const idUsr = obterValorCookie('usuarioID');

	if (idUsr != null) {
		return true;
	}

	return false;
}

function formatarData(data) {
	const dataFormatada = moment(data);
	return dataFormatada.format('DD/MM/YYYY');
}


document.addEventListener('DOMContentLoaded', async () => {
	const id = obterIdUrl();

	const dados = await obterEstabelecimento(id);

	titulo.textContent = dados.nome;
	descricao.textContent = dados.descricao;
	imgEstabelecimento.src = "data:image/jpeg;base64," + dados.fotoBase64;

	alterarBackgroundServices(dados);

	listarComentarios();

	carregarImgUsr();

	obterLatELong(dados.endereco.cep);
})


btnEnviar.addEventListener('click', async (event) => {
	event.preventDefault();
	const idForm = obterIdUrl();
	const idUsr = obterValorCookie('usuarioID');

	if (!idUsr) {
		alert("Faça login para comentar !");
		return;
	}

	const comentarioTexto = message.value;

	const dados = {
		"idUsuario": idUsr,
		"idEstabelecimento": idForm,
		"texto": comentarioTexto
	}

	try {
		const resposta = await fetch('/estabelecimento/comentar', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(dados)
		})

		if (resposta.ok) {
			location.reload();
		} else {
			const txtErro = await resposta.text();
			alert(txtErro);
		}
	} catch (error) {
		const msgErro = await error.text();
		alert(msgErro);
	}




})

async function obterLatELong(cep) {

	cep = limparCep(cep);

	const urlGeo = 'https://nominatim.openstreetmap.org/search?format=json&postalcode=' + cep;

	const resposta = await fetch(urlGeo);

	const dados = await resposta.json();

	if (dados.length > 0) {
		latitude = parseFloat(dados[0].lat);
		longitude = parseFloat(dados[0].lon);

		map.setView([latitude, longitude], 15);

		marcadorMapa();
	}

}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap'
}).addTo(map);



function marcadorMapa() {

	const lat = latitude;
	const lng = longitude;

	if (marker) {
		map.removeLayer(marker);
	}

	marker = L.marker([lat, lng]).addTo(map);
}





























