const pokedex = document.getElementById("pokedex");

async function fetchPokemonData(){
    for(let i = 1; i <= 151; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await response.json();

        const card = document.createElement("div");
        card.classList.add("pokemoncard");

        card.innerHTML = `
        <div class="pokemonname">${data.name.toUpperCase()}</div>
        <div class="image">
            <img src="${data.sprites.front_default}" alt="${data.name}">
        </div>
        <div class="pokemonstats">
            <p>Type: ${data.types.map(t => t.type.name).join(", ")}</p>
            <p>HP: ${data.stats[0].base_stat}</p>
            <p>Attack: ${data.stats[1].base_stat}</p>
            <p>Defense: ${data.stats[2].base_stat}</p>
            <p>Speed: ${data.stats[5].base_stat}</p>
        </div>
        `;

        pokedex.appendChild(card);
    }
}

fetchPokemonData();