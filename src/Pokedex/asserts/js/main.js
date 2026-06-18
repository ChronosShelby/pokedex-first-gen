const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('pokemonModal')
const searchInput = document.getElementById('searchPokemon')

const maxRecords = 151
const limit = 12
let offset = 0

function convertPokemonToLi(pokemon) {
    return `
        <li
            class="pokemon ${pokemon.type}"
            onclick="showPokemonDetails(${pokemon.number})"
            >
            
            <span class="number">
                #${pokemon.number.toString().padStart(4, '0')}
            </span>
            <span class="name">
                ${pokemon.name}
            </span>

            <div class="details">
                <ol class="types">
                    ${pokemon.types
                        .map(type =>
                            `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img
                    src="${pokemon.photo}"
                    alt="${pokemon.name}"
                >
            </div>
        </li>
    `
}

window.showPokemonDetails = function(id) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(pokemon => {

            const details = document.getElementById('pokemonDetails')

            details.innerHTML = `
                <div class="pokemon-detail-card">

                    <h2 class="pokemon-detail-name">
                        ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                    </h2>

                    <img
                        class="pokemon-detail-image"
                        src="${pokemon.sprites.other.dream_world.front_default}"
                        alt="${pokemon.name}"
                    >

                    <div class="pokemon-detail-info">
                        <p>
                            <strong>Número:</strong> #${pokemon.id.toString().padStart(4, '0')}
                        </p>
                        <p>
                                <strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(' / ')}
                        </p>
                        <p>
                            <strong>Altura:</strong> ${pokemon.height / 10}m
                        </p>
                        <p>
                            <strong>Peso:</strong> ${pokemon.weight / 10}kg
                        </p>
                        <p>
                            <strong>HP:</strong> ${pokemon.stats[0].base_stat}
                        </p>
                        <p>
                            <strong>Ataque:</strong> ${pokemon.stats[1].base_stat}
                        </p>
                        <p>
                            <strong>Defesa:</strong> ${pokemon.stats[2].base_stat}
                        </p>
                    </div>
                </div>
            `

            document.getElementById('pokemonModal').style.display = 'flex'
            document
                .getElementById('closeModal')
                .addEventListener('click', () => {
                    document.getElementById('pokemonModal').style.display = 'none'

            })
        })
}

modal.addEventListener('click', (event) => {

    if(event.target === modal) {
        modal.style.display = 'none'
    }

})

searchInput.addEventListener('input', () => {

    const search =
        searchInput.value.toLowerCase()
    const pokemons =
        document.querySelectorAll('.pokemon')

    pokemons.forEach(pokemon => {
        const name =
            pokemon.querySelector('.name')
                .textContent
                .toLowerCase()
        const number =
            pokemon.querySelector('.number')
                .textContent

        pokemon.style.display =
            name.includes(search)
            || number.includes(search)
            ? ''
            : 'none'
    })
})

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})