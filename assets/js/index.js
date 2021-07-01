// variaveis para renderizar na tela
let divLivro = document.getElementById('dadosLivro')
let btnLivro = document.getElementById('btnLivro')
let resBtn = document.getElementById('resBTN')
let btnAVN = document.getElementById('btnAVN')
let btnATN = document.getElementById('btnATN')
let cap = document.getElementById('cap')
let ver = document.getElementById('ver')
let select = document.getElementById('select')
let page = 1

fetch("https://www.abibliadigital.com.br/api/books")
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        getAbreviation(data)

    })
function getAbreviation(json) {
    json.map(abreviacao => {
        return select.innerHTML += `
           <option value="${abreviacao.abbrev.pt}">${abreviacao.name}</option>`
    })
}


// evento do botao para pegar valor do input 
btnLivro.addEventListener('click', (e) => {
    if (cap.value > 0) {
        page = cap.value
    }
    // api que traz informações básicas de um livro, a busca é pelo nome abreviado "exodos" "ex"
    fetch(`https://www.abibliadigital.com.br/api/books/${select.value.toLowerCase()}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            showDescriptionBook(data)

        })

    fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${select.value.toLowerCase()}/${page}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if (ver.value > 0) {
                showVersesBooks(data.verses)
            }
            else {
                showAndUpdateVersesBooks(data.verses)
            }
        })
})

// mostrar na tela as informações da busca
function showDescriptionBook(json) {
    // o arquivo chega em objeto por isso a variavel livro
    // é um array para colocar o objeto dentro e dps iterar
    let livro = []
    livro.push(json)

    // uso do tamplete string para redenrizar a chamada da api na tela
    livro.map(book => {
        return divLivro.innerHTML = `
           
           <div class="flex flex-col items-center pt-4 pl-2 ">
               <h2><strong>Livro</strong>: ${book.name} </h2> 
               <span><strong>Testamento</strong>: ${book.testament}</span>
               <h4><strong>Autor</strong>: ${book.author}</h4> 
               <span><strong>Capitulos</strong>: ${book.chapters}</span>
               <!--<p>Comentários: ${book.comment}</p>-->
           </div>
           `
    })
}


function showVersesBooks(json) {
    resBtn.innerHTML = `<p>Capitulo: ${page}</p>`
    json.filter(verses => {
        return verses.number == ver.value
    }).map(verso => {
        return resBtn.innerHTML += `
           <div class="border my-5">
               <p class="pt-4 pl-2 ">Verso: ${verso.number} <span>${verso.text}</span></p> 
           </div>
           `
    })
}

function showUpdateLastVersesBooks(json) {
    resBtn.innerHTML = `<p>Capitulo: ${page}</p>`
    let newValue = ++ver.value
    json.filter(verses => {
        return verses.number == newValue
    }).map(verso => {
        return resBtn.innerHTML += `
           <div class="border my-5">
               <p class="pt-4 pl-2 ">Verso: ${verso.number} <span>${verso.text}</span></p> 
           </div>
           `
    })
}

function showUpdateBackVersesBooks(json) {
    resBtn.innerHTML = `<p>Capitulo: ${page}</p>`
    let newValue = --ver.value
    json.filter(verses => {
        return verses.number == newValue
    }).map(verso => {
        return resBtn.innerHTML += `
           <div class="border my-5">
               <p class="pt-4 pl-2 ">Verse:${verso.number} <span>${verso.text}</span></p> 
           </div>
           `
    })
}

function showAndUpdateVersesBooks(json) {
    resBtn.innerHTML = `<p>Capitulo: ${page}</p>`
    json.map(verses => {
        return resBtn.innerHTML += `
           <div class="border">
               <p class="pt-4 pl-2">Verse:${verses.number} <span>${verses.text}</span></p> 
           </div>
           `
    })
}

function lastPage() {
    btnAVN.addEventListener('click', () => {
        if (ver.value > 0) {
            fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${select.value.toLowerCase()}/${page}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    showUpdateLastVersesBooks(data.verses)
                })
        } else {
            fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${select.value.toLowerCase()}/${++page}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    showAndUpdateVersesBooks(data.verses)
                })
        }
    })
}
lastPage()

function backPage() {
    btnATN.addEventListener('click', () => {
        if (ver.value > 0) {
            fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${select.value.toLowerCase()}/${page}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    showUpdateBackVersesBooks(data.verses)
                })
        } else {
            fetch(`https://www.abibliadigital.com.br/api/verses/nvi/${select.value.toLowerCase()}/${--page}`)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    showAndUpdateVersesBooks(data.verses)
                })
        }

    })
}
backPage()
