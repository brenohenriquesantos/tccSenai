//DOOM
const cpf = document.querySelector("#cpf");
const senha = document.querySelector("#senha");
const btnLogin = document.querySelector("#btnLogin");
const erroMsg = document.querySelector("#erroMsg");


//eventos

btnLogin.addEventListener('click', () => {

	event.preventDefault();

	const cpfValor = cpf.value;
	const senhaValor = senha.value;

	const credenciais = {
		cpf: cpfValor,
		senha: senhaValor
	};



	fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credenciais)
	})
		.then(response => {
			if (!response.ok) {
				erroMsg.style.display = 'block';
			} else {
				erroMsg.style.display = 'none';

				window.location.href = "/";

			}
		})
		.catch(error => {
			alert("Servidor Indisponivel", error.message);
		})
})
