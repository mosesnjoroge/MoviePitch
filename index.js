import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  const setupTextarea = document.getElementById('setup-textarea')
  if (setupTextarea.value) {
    const userInput =setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userInput)
    fetchSynopsis(userInput)
  }
})

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',
    prompt: `Generate a short enthusiast response on the an outline and you need some minutes to think about it.
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline:${outline}
    message:
    `,
    max_tokens:60
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging, professional and marketable movie synopsis asking for a synopsis based on an outline. Choose actors that suit the role and place them in brackets after each character.
    ###
    outline: A big-headed daredevil figher pilot goes back to school only to be sent on a deadly mission.
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their
    elite flying skills. When hot shot figther pilot Maverick (Tom Cruise) is sent to the school, his reckless
    attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected
    Iceman (Val Kilmer). But Maverick isnt only competing to be the top fighter pilot, he's also fighting
    for the attention of his beatiful flight instructor, Charlotte Blackwood (Kelly McGills). Maverick
    gradually earns the respect of his instructors and peers - and also the love of charlotte, but struggles
    to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy,
    Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best
    fighter pilot and return from the mission triumphant.
    ###
    outline:${outline}
    synopsis:
    `,
    max_tokens:700
  })
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}
// title generator based on the synopsis
async function fetchTitle(synopsis) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt:`Generate an exciting title based on the synopsis.
    ###
    title: Top Gun
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their
    elite flying skills. When hot shot figther pilot maverick (Tom Cruise) is sent to the school, his reckless
    attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected
    Iceman (Val Kilmer). But Maverick isnt only competing to be the top fighter pilot, he's also fighting
    for the attention of his beatiful flight instructor, Charlotte Blackwood (Kelly McGills). Maverick
    gradually earns the respect of his instructors and peers - and also the love of charlotte, but struggles
    to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy,
    Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best
    fighter pilot and return from the mission triumphant.
    ###
    synopsis:${synopsis}
    title:
    `,
    max_tokens:20,
    temperature: 0.7
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImagePrompt(title,synopsis)
}
// fetch function for extracting the actors generated from the synopsis by openai
async function fetchStars(synopsis) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt:`Extract the names that are in brackets from the synopsis.
    ###
    names: Tom Cruise, Val Kilmer, Kelly McGills
    synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their
    elite flying skills. When hot shot figther pilot maverick (Tom Cruise) is sent to the school, his reckless
    attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected
    Iceman (Val Kilmer). But Maverick isnt only competing to be the top fighter pilot, he's also fighting
    for the attention of his beatiful flight instructor, Charlotte Blackwood (Kelly McGills). Maverick
    gradually earns the respect of his instructors and peers - and also the love of charlotte, but struggles
    to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy,
    Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best
    fighter pilot and return from the mission triumphant.
    ###
    synopsis:${synopsis}
    names:
    `,
    max_tokens:30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}
// fetch function for generate image with dall-e

async function fetchImagePrompt(title,synopsis) {
  const response = await openai.createCompletion({
    model:'gpt-3.5-turbo-instruct',
    prompt:`Generate a short description of an image which could be used to advertise a movie based on a title
    and synopsis.The description should be rich in visual detail but contain no names.
    ###
    title: Love's Time Warp
    synopsis: When scientist and time traveller Wendy (Emma Watson) is sent back to the 1920s to assasinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner
    circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson).With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out
    her mission or follow her heart.But the choices she makes in the 1920s will have far-reaching concequences that reverberate through the ages.
    image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is super-imposed over the scene.
    ###
    title: Zero Earth
    synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the united Nations to save planet earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster Gizmo (Gaten Matarazzo),
    Kob embarks on a perilous mission to detroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
    image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out
    over a vibrant cityscape, with a rainbow in the sky above them.
    ###
    title: ${title}
    synopsis: ${synopsis}
    image description:
    `,
    temperature: 0.8,
    max_tokens:100
  })
  const imagePrompt = response.data.choices[0].text.trim()
  fetchImageUrl(imagePrompt)
}
// movie idea: A madman develops a machine to control all humans and only intelligent animals can save the human race.

async function fetchImageUrl(imagePrompt) {
  const response = await openai.createImage({
    prompt:`${imagePrompt}. The should be no text in this image`,
    n:1,
    size:'256x256',
    response_format:'b64_json'
  })
  document.getElementById('output-img-container').innerHTML = `<img src="${response.data.data[0].b64_json}">`
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`
  document.getElementById('view-pithc-btn').addEventListener('click',()=>{
    document.getElementById('setup-container').style.display = 'none'
    document.getElementById('output-container').style.display = 'flex'
    movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rick for sure! Remember, I want 10%💰`
  })
}

// refactoring model and prompts to one request on text-davinci using langchain
// tailor the app to specific genre
