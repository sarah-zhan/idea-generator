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

const fetchAPI = async input => {
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
	// console.log(response)
};

const fetchSynopsis = async input => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate an engaging, professional and marketable movie synopsis based on the input and match the actorthat fit the role. The synopsis should include actors names in brackets after each character.
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
	fetchStars(synopsis);
};

const fetchTitle = async synopsis => {
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

	const title = response.data.choices[0].text.trim();
	document.getElementById('output-title').innerText = title;
	fetchImagePromt(title, synopsis);
};

const fetchStars = async synopsis => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate the name of the main actors in the movie.
		###
		input: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
		stars: Jack Nicholson, Paul Newman
		###
		input: ${synopsis}
		stars:
		`,
		max_tokens: 30,
	});
	document.getElementById('output-stars').innerText =
		response.data.choices[0].text.trim();
};

const fetchImagePromt = async (title, synopsis) => {
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `Generate a description of the movie based on the title and synopsis.
		###
		title: The Time Traveler's Wife
		synopsis: Chicago librarian Henry De Tamble (Eric Bana) suffers from a rare genetic disorder that causes him to drift uncontrollably back and forth through time. On one of his sojourns, he meets the love of his life, Claire (Rachel McAdams), and they marry. But the problems and complexities of any relationship are multiplied by Henry's inability to remain in one time and place, so that he and his beloved are continually out of sync.
		image description: Claire and Henry are hugging each other, and Henry's head is on Claire's shoulder. Claire is watch to the front. Both of them are on the left. The background is yellow and blue.
		###
		title: zero Earth
		synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
		image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
		###
		title: ${title}
		synopsis: ${synopsis}
		image description:
		`,
		temperature: 0.8,
		max_tokens: 100,
	});
	const imageDescription = response.data.choices[0].text.trim();
	fetchImage(imageDescription);
};

const fetchImage = async imageDescription => {
	const response = await openai.createImage({
		prompt: `${imageDescription}.`,
		n: 1,
		size: '256x256',
		response_format: 'url',
	});

	document.getElementById(
		'output-img-container'
	).innerHTML = `<img src="${response.data.data[0].url}">`;

	setupInputContainer.innerHTML = `<button id='view-pitch-btn' class='view-pitch-btn'>View</button>'`;

	document.getElementById('view-pitch-btn').addEventListener('click', () => {
		document.getElementById('setup-container').style.display = 'none';
		document.getElementById('output-container').style.display = 'flex';
	})

};
