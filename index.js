const readline = require('readline-sync')


// funcao que agrupara tudo 
function start() { 
    /**  objeto que guardara todo o conteudo, tudo oque vai acontecer ao longo das pesquisas 
     como o termo que foi utilizado na busca, as urls das imagens, quais sao as sentecas que foram encontradas etc. 
    */
    const content = {}
    content.searchTerm = askAndReturnSearchTerm() // injeta no objto content
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm() {
        return readline.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

       return selectedPrefixText
    }

    console.log(content)
}
start()
