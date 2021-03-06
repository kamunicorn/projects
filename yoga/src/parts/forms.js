"use strict";

	// Forms submit
function forms() {

	let statusMessage = {
		loading: 'Загрузка...',
		success: 'Спасибо! Скоро мы с вами свяжемся!',
		failure: 'Что-то пошло не так.'
	};

	let mainForm = document.querySelector('.main-form'),
		contactForm = document.querySelector('#contacts form');
	
	contactForm.addEventListener('submit', function(e) {
		e.preventDefault();
		submitForm(this);
	});

	mainForm.addEventListener('submit', function(e) {
		e.preventDefault();
		submitForm(this);
	});

	function submitForm(form) {
		let formInputs = form.querySelectorAll('input'),
			statusBox = document.createElement('div');

		statusBox.classList.add('status');
		form.appendChild(statusBox);
		let formData = new FormData(form);

		/* let formData2 = {};
		formInputs.forEach((inp) => {formData2[inp.name] = inp.value;});
		formData = JSON.stringify(formData2); */
		// console.log(formData);
		
		function postData(data) {

			return new Promise(function(resolve, reject) {
				let request = new XMLHttpRequest();
				request.open('POST', 'server.php');
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				// request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
				
				request.onreadystatechange = function() {
					if (request.readyState < 4) {
						// resolve();
						statusBox.innerHTML = statusMessage.loading;
					} else if (request.readyState === 4 && request.status === 200) {
						resolve();
						// statusBox.innerHTML = statusMessage.success;
					} else {
						reject();
						// statusBox.innerHTML = statusMessage.failure;
					}
				};

				request.send(data);

			});
		}	// End postData

		postData(formData)
				// .then(() => statusBox.innerHTML = statusMessage.loading)
				.then(() => {
					statusBox.innerHTML = statusMessage.success;
					formInputs.forEach( (input) => input.value = '' );
				})
				.catch(() => statusBox.innerHTML = statusMessage.failure);
		
		setTimeout(() => statusBox.remove(), 3000);
	}

		// verify and reset telephone str

	let phoneInputs = document.querySelectorAll('input[type=tel]');
	
	phoneInputs.forEach(function(input) {
		input.addEventListener('input', function() {
			// console.log(this);
			this.value = verifyTelephone(this.value);
		});
	});
}	

module.exports = forms;