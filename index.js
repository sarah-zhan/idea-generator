import { process } from '/env';
import { Configuration, OpenAIApi } from 'openai';

const setupInputContainer = document.getElementById('setup-input-container');
const movieBossText = document.getElementById('movie-boss-text');

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


document.getElementById('send-btn').addEventListener('click', () => {
	const setupTextarea = document.getElementById('setup-textarea');
	if (setupTextarea.value) {
		const userInput = setupTextarea.value;
		setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`;
		movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`;
		fetchAPI(userInput);
		fetchSynopsis(userInput);
	}


});

const fetchAPI = async (input) => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate a 20 words message to enthusiastically sounds interesting and that you need some minutes to think about it.
		###
		input: A father looks for his son, who was adducted when it was 3, for 20 years in China.
		message: I'll need to think about that. It is a happy and sad story and it uncovers a dark industry of selling children in China.
		###
		input: A mother chooses to stay with her brutal husband to protect her two children.
		message: That is a sad story, but it is worthy of showing the real world of the life of this woman. Give me a few moments to think!
		###
		input: ${input}
		message:
		`,
		max_tokens: 60,
	});
	movieBossText.innerText = response.data.choices[0].text.trim();
	console.log(response)
};

const fetchSynopsis = async (input) => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate an engaging, professional and marketable movie synopsis based on the input and match the actor that fit the role.
		###
		input: Slow-witted Forrest Gump uses his optimism to beat all the odds in life.

		synopsis: Slow-witted Forrest Gump (Tom Hanks) has never thought of himself as disadvantaged, and thanks to his supportive mother (Sally Field), he leads anything but a restricted life. Whether dominating on the gridiron as a college football star, fighting in Vietnam or captaining a shrimp boat, Forrest inspires people with his childlike optimism. But one person Forrest cares about most may be the most difficult to save -- his childhood love, the sweet but troubled Jenny (Robin Wright).
		###
		input: ${input}
		synopsis:
		`,
		max_tokens: 700,
	});
	const synopsis = response.data.choices[0].text.trim();
	document.getElementById('output-text').innerText = synopsis;
	fetchTitle(synopsis);
}

const fetchTitle = async (synopsis) => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate a title for the synopsis.
		###
		input: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
		title: Top Gun
		###
		input: ${synopsis}
		title:
		`,
		max_tokens: 20,
	});
	document.getElementById('output-title').innerText =
		response.data.choices[0].text.trim();
	console.log(response);

}
