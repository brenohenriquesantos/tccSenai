const nomeCookie = "usuarioID";
const linkLogin = document.querySelector('#login');

const checkRampa = document.querySelector('#rampa');
const checkEstacionamento = document.querySelector('#estacionamento');
const checkBanheiro = document.querySelector('#banheiro');
const linkPerfil = document.querySelector('#perfil');

const estadosSelect = document.querySelector('#estados');
const cidadesSelect = document.querySelector('#cidades');


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

function obterIdLogado() {
	const cookie = document.cookie.split(';').find(row => row.trim().startsWith(nomeCookie + '='));

	const id = cookie ? parseInt(cookie.split('=')[1]) : null;

	return id;
}

function verificarLogado() {

	if (verificarCookie(nomeCookie)) {
		linkLogin.textContent = 'Deslogar'
		linkPerfil.style = 'display:block'
		linkPerfil.href = '/usuario/perfil/?id=' + obterIdLogado();

	} else {
		linkPerfil.style = 'display:none'
		linkLogin.textContent = 'Login'
	}
}


linkLogin.addEventListener('click', () => {
	if (verificarCookie(nomeCookie)) {
		deleteCookie(nomeCookie);
	}

	window.location.href = "/login"

})


async function popularEstabsFiltrados() {

	let banheiro, rampa, estacionamento;


	if (checkBanheiro.checked) {
		banheiro = 'S'
	}

	if (checkRampa.checked) {
		rampa = 'S'
	}

	if (checkEstacionamento.checked) {
		estacionamento = 'S'
	}



	const filtros = {
		nome: document.querySelector('#inputPesquisa').value,
		banheiro: banheiro,
		rampa: rampa,
		estacionamento: estacionamento,
		uf: document.querySelector('#estados').value,
		localidade: document.querySelector('#cidades').value
	}


	const res = await fetch('/consultarEstabsFiltrados', {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(filtros)
	}
	)

	const services = document.querySelector('#services');

	services.innerHTML = '';

	if (res.ok) {
		const dados = await res.json();

		dados.forEach((item) => {
			const caixaResult = document.createElement("div");

			caixaResult.classList.add("caixaResult");

			caixaResult.innerHTML = `
					<div>
						<a href="/estabelecimento/?id=${item.id}"><img src="data:image/jpeg;base64,${item.fotoBase64}"
						 alt="imagem"></a>
					</div>

					<div class = "txtResult">
						<h3>${item.nome}</h3>
					</div>
		`;

			services.appendChild(caixaResult);
		})
	} else {
		services.innerHTML = '';
		
		const erro = await res.text();
		console.log(erro);
	}
}





function filtrar() {
	var input, filter,
		ul,
		li,
		a,
		i,
		txtValue,
		count = 0;

	input = document.querySelector('#inputPesquisa');

	div = document.querySelector(".listaProdutos");

	ul = document.querySelector('#lista');

	filter = input.value.toUpperCase();

	if (filter === "") {
		div.style.display = "none"
		ul.style.display = "none";
	} else {
		li = ul.getElementsByTagName("li");

		for (i = 0; i < li.length; i++) {
			a = li[i].getElementsByTagName("a")[0];

			txtValue = a.textContent || a.innerText;

			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";

				count++;
			} else {
				li[i].style.display = "none";
			}
		}

		if (count === 0) {
			div.style.display = "none !important"
			ul.style.display = "none";
		} else {
			div.style.display = "block"
			ul.style.display = "block"
		}

	}

}

async function obterEstados() {
	const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

	if (!response.ok) {
		alert('Erro ao obter estados !');
	}

	const dados = await response.json();


	for (const estado of dados) {
		const option = document.createElement('option');

		option.value = estado.sigla;
		option.text = estado.nome;

		estadosSelect.appendChild(option);
	}
}

async function obterCidadesPeloUf(siglaEstado) {
	const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado}/municipios`);

	if (!response.ok) {
		alert('Erro ao obter cidades');
	}

	const cidades = await response.json();



	for (const cidade of cidades) {
		const option = document.createElement('option');

		option.value = cidade.nome;
		option.text = cidade.nome;

		cidadesSelect.appendChild(option);

	}


}


estadosSelect.addEventListener('change', () => {

	cidadesSelect.innerHTML = '';

	const siglaEstado = estadosSelect.value;

	obterCidadesPeloUf(siglaEstado);


})


document.addEventListener('DOMContentLoaded', () => {
	popularEstabsFiltrados();
	verificarLogado();
	obterEstados();
})

