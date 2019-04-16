// robo de processamento de texto
// comece sempre pela camada de maior abstracao  = interface publica (nesse caso)

const algorithmia = require('algorithmia') // modulo do algorithmia
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {
    await fetchContentFromWikipedia(content) // baixa o conteudo do wikipedia
    sanitizeContent(content) // limpa o conteudo pois o wikipedia possui tags proprias que vem junto do conteudo quando da o get
    breakContentIntoSentences(content) // quebra em sentencas  


    async function fetchContentFromWikipedia(content) {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) // autentica 
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') // algoritmo do wikipedia
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm) // busca o conteudo
        const wikipediaContent = wikipediaResponde.get() // retorna o valor

        content.sourceContentOriginal = wikipediaContent.content
    }
}

function sanitizeContent(content) {
    // quebra todo o conteudo em linhas e remove as linhas em branco.
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
    const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)

    content.sourceContentSanatized = withoutDatesInParentheses

    function removeBlankLinesAndMarkdown(text) {
        const allLines = text.split('\n')

        const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
            if (line.trim().length === 0 || line.trim().startsWith('=')) { // ignora linhas em branco e linhas com markdown do wikipedia
                return false
            }
            return true
        })

        return withoutBlankLinesAndMarkdown.join(' ')
    }

    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }
}


function breakContentIntoSentences(content){
    content.sentences = []
    const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanatized)
    sentences.forEach((sentence) => {
        content.sentences.push({
            text: sentence,
            keywords: [],
            images:[]
        })
    })
}

module.exports = robot
