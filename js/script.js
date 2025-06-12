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

async function showTypeIcons(){
    
    const container = document.getElementById("types")
    const response = await fetch("https://pokeapi.co/api/v2/type")
    const data = await response.json();
    
    data.results.forEach((type) => {
        const typeName = type.name

        const icon = document.createElement("img")
        icon.src = `./img/types/${typeName}.png`
         icon.alt = typeName;
    icon.classList.add("type-icon");

    container.appendChild(icon);
    
    })
}

document.addEventListener("DOMContentLoaded", () => {
  const typeContainer = document.getElementById("types");
  const pokemonList = document.getElementById("pokemon-list") || createPokemonListContainer();

  typeContainer.addEventListener("click", async (e) => {
    if (e.target.closest("button")) {
      const type = e.target.closest("button").className;
      showPokemonsByType(type);
    }
  });

  async function showPokemonsByType(type) {
    pokemonList.innerHTML = "Loading...";
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!res.ok) throw new Error("Failed to fetch Pokémon of this type.");
      const data = await res.json();
      
      pokemonList.innerHTML = `<h2>${type.charAt(0).toUpperCase() + type.slice(1)} type Pokémon</h2>`;
      data.pokemon.slice(0, 50).forEach(entry => {
        const name = entry.pokemon.name;
        pokemonList.innerHTML += `<div>${name}</div>`;
      });
    } catch (err) {
      pokemonList.innerHTML = "Error loading Pokémon.";
    }
  }

  function createPokemonListContainer() {
    const div = document.createElement("div");
    div.id = "pokemon-list";
    document.body.appendChild(div);
    return div;
  }
});

showTypeIcons()
fetchPokemonData();