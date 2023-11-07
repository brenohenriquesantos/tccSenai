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
const comentariosBanco = document.querySelector('#comentariosBanco');




function obterIdUrl() {
	const url = window.location.search;

	var urlParametro = new URLSearchParams(url);

	var id = urlParametro.get('id');

	return id;
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
	
	if(!cookieString){
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

function criarCorpoComentario(nome, comentario) {

	let divBody = document.createElement('div');
	divBody.classList.add('media-body');

	let h4 = document.createElement('h4');
	h4.classList.add('media-heading');
	h4.textContent = nome;

	let p = document.createElement('p');
	p.textContent = comentario;

	divBody.appendChild(h4);
	divBody.appendChild(p);


	let ul = document.createElement('ul');
    ul.classList.add("list-unstyled", "list-inline", "media-detail", "pull-left");


	let li = document.createElement('li');

	let i = document.createElement('i');
	i.classList.add("fa", "fa-calendar");



	li.appendChild(i);
	li.textContent = '27/02/2014';

	ul.appendChild(li);

	divBody.appendChild(ul);

	return divBody;
}

function criarComentario(nome, comentario,usrImg) {

	let div = document.createElement('div');
	div.classList.add('media');

	let a = document.createElement('a');
	a.classList.add('pull-left');

	let img = document.createElement('img');
	img.src = usrImg;

	a.appendChild(img);

	div.appendChild(a);

	let divBody = criarCorpoComentario(nome, comentario);

	div.appendChild(divBody);
	
	return div;


}

async function listarComentarios() {
	try {
		const idForm = obterIdUrl();

		const listaComentarios = await obterComentarios(idForm);

		numeroComentarios.textContent = listaComentarios.length + " Comentario(s)";
		
		listaComentarios.forEach(comentario =>{
			
			var nome = comentario.usr.nome;
			var texto = comentario.texto;
			var imagem = "data:image/jpg;base64," + comentario.usr.fotoBase64;
			
			let divComentario = criarComentario(nome,texto,imagem);
			comentariosBanco.appendChild(divComentario);
		})

	} catch (Erro) {
		
		alert(Erro);
	}


}


document.addEventListener('DOMContentLoaded', async () => {
	const id = obterIdUrl();

	const dados = await obterEstabelecimento(id);

	titulo.textContent = dados.nome;
	descricao.textContent = dados.descricao;
	imgEstabelecimento.src = "data:image/jpeg;base64," + dados.fotoBase64;

	alterarBackgroundServices(dados);

	listarComentarios();
})


btnEnviar.addEventListener('click', async (event) => {
	event.preventDefault();
	const idForm = obterIdUrl();
	const idUsr = obterValorCookie('usuarioID');
	
	if(!idUsr){
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
		}else{
			const txtErro = await resposta.text();
			alert(txtErro);
		}
	} catch (error) {
		const msgErro = await error.text();
		alert(msgErro);
	}




})