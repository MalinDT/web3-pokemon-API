// Starter selection logic per generation

const GENERATION_TO_STARTERS = {
  1: [1, 4, 7],       // Bulbasaur, Charmander, Squirtle
  2: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
  3: [252, 255, 258], // Treecko, Torchic, Mudkip
  4: [387, 390, 393], // Turtwig, Chimchar, Piplup
  5: [495, 498, 501], // Snivy, Tepig, Oshawott
  6: [650, 653, 656], // Chespin, Fennekin, Froakie
  7: [722, 725, 728], // Rowlet, Litten, Popplio
  8: [810, 813, 816], // Grookey, Scorbunny, Sobble
  9: [906, 909, 912]  // Sprigatito, Fuecoco, Quaxly
};

const resultContainer = document.getElementById('starter-result');
const genSelect = document.getElementById('gen-select');
const getStarterBtn = document.getElementById('get-starter');

function chooseRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function renderStarterCard(poke) {
  const card = document.createElement('div');
  card.className = 'pokemoncard';
  card.innerHTML = `
    <div class="pokemonname">${poke.name.toUpperCase()} (#${poke.id})</div>
    <div class="image"><img src="${poke.sprites.front_default}" alt="${poke.name}"></div>
    <div class="pokemonstats">
      <p>Type: ${poke.types.map(t => t.type.name).join(', ')}</p>
      <p>HP: ${poke.stats[0].base_stat}</p>
      <p>Attack: ${poke.stats[1].base_stat}</p>
      <p>Defense: ${poke.stats[2].base_stat}</p>
      <p>Speed: ${poke.stats[5].base_stat}</p>
    </div>
    <div style="margin-top:12px; display:flex; gap:8px; justify-content:center;">
      <a class="btn" href="pokedex.html?type=${encodeURIComponent(poke.types[0].type.name)}">See similar type</a>
      <a class="btn" href="pokedex.html#${poke.id}">Open Pokédex</a>
    </div>
  `;
  resultContainer.innerHTML = '';
  resultContainer.appendChild(card);
}

async function fetchPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error('Failed to fetch starter');
  return await response.json();
}

async function handleGetStarter() {
  const gen = genSelect.value;
  const ids = GENERATION_TO_STARTERS[gen];
  if (!ids) return;
  resultContainer.innerHTML = '<div id="loading-spinner"><div class="spinner"></div></div>';
  try {
    const chosenId = chooseRandom(ids);
    const poke = await fetchPokemon(chosenId);
    renderStarterCard(poke);
  } catch (e) {
    resultContainer.innerHTML = '<div id="error-message">Failed to fetch starter. Please try again.</div>';
  }
}

if (getStarterBtn) {
  getStarterBtn.addEventListener('click', handleGetStarter);
}


