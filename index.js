import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
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
    prompt: `Generate a short message to enthusiastically say "${outline}" sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence.`,
    max_tokens:60
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
}

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',
    prompt: `Generate an engaging, professional and marketable movie synopsis asking for a synopsis based on following idea "${outline}".`,
    max_tokens:70
  })
  // document.getElementById('output-text').innerText = response.data.choices[0].text.trim()
}
console.log(fetchSynopsis())
