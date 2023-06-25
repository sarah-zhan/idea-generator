import { process } from './env';

const setupTextarea = document.getElementById('setup-textarea');
const setupInputContainer = document.getElementById('setup-input-container');
const movieBossText = document.getElementById('movie-boss-text');
const url = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.OPENAI_API_KEY;

document.getElementById('send-btn').addEventListener('click', () => {
	if (setupTextarea.value) {
		setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`;
		movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
	}
	fetchAPI();
});

const fetchAPI = () => {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			prompt: setupTextarea.value,
			model: 'text-davinci-003',
		}),
	})
		.then(response => response.json())
		.then(data => {
			movieBossText.innerText = data.choices[0].text;
		});
};
