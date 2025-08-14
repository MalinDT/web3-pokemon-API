// --- Modern Pokédex Features ---

// State
let allPokemonData = [];
let displayedPokemon = [];
let favorites = JSON.parse(localStorage.getItem('favoritesTeam') || '[]');
let currentGenLimit = 151;
let currentSort = 'number';
let currentSearch = '';
let currentType = null;
let currentPage = 1;
const PAGE_SIZE = 30;
let isLoading = false;

// DOM Elements
const pokedex = document.getElementById("pokedex");
const searchBar = document.getElementById("search-bar");
const sortDropdown = document.getElementById("sort-dropdown");
const genSelector = document.getElementById("generation-selector");
const favoritesTeam = document.getElementById("favorites-team");
const typeChartBtn = document.getElementById("type-chart-btn");
const typeChartModal = document.getElementById("type-chart-modal");
const typeChartContent = document.getElementById("type-chart-content");
const closeTypeChart = document.getElementById("close-type-chart");
const pokemonModal = document.getElementById("pokemon-modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");
const typesContainer = document.getElementById("types");

// --- Utility Functions ---
function showLoading() {
  if (!pokedex) return;
  let spinner = document.getElementById('loading-spinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.innerHTML = '<div class="spinner"></div>';
    pokedex.parentNode.insertBefore(spinner, pokedex);
  }
  spinner.style.display = 'flex';
}
function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
}
function showError(msg) {
  if (!pokedex) return;
  let err = document.getElementById('error-message');
  if (!err) {
    err = document.createElement('div');
    err.id = 'error-message';
    pokedex.parentNode.insertBefore(err, pokedex);
  }
  err.textContent = msg;
  err.style.display = 'block';
}
function hideError() {
  const err = document.getElementById('error-message');
  if (err) err.style.display = 'none';
}

// --- Data Fetching ---
async function fetchPokemonData(limit = currentGenLimit) {
  isLoading = true;
  showLoading();
  hideError();
  allPokemonData = [];
  pokedex.innerHTML = '';
  try {
    for (let i = 1; i <= limit; i++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      allPokemonData.push(data);
    }
    isLoading = false;
    hideLoading();
    renderPokemon();
  } catch (e) {
    isLoading = false;
    hideLoading();
    showError('Failed to load Pokémon. Please try again later.');
  }
}

// --- Rendering ---
function renderPokemon() {
  pokedex.innerHTML = '';
  let filtered = allPokemonData;
  if (currentType) {
    filtered = filtered.filter(p => p.types.some(t => t.type.name === currentType));
  }
  if (currentSearch) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(currentSearch) ||
      (p.id + '').includes(currentSearch)
    );
  }
  // Sorting
  filtered = filtered.slice();
  switch (currentSort) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'hp':
      filtered.sort((a, b) => b.stats[0].base_stat - a.stats[0].base_stat); break;
    case 'attack':
      filtered.sort((a, b) => b.stats[1].base_stat - a.stats[1].base_stat); break;
    case 'defense':
      filtered.sort((a, b) => b.stats[2].base_stat - a.stats[2].base_stat); break;
    case 'speed':
      filtered.sort((a, b) => b.stats[5].base_stat - a.stats[5].base_stat); break;
    default:
      filtered.sort((a, b) => a.id - b.id);
  }
  // Pagination
  const start = 0;
  const end = currentPage * PAGE_SIZE;
  displayedPokemon = filtered.slice(start, end);
  if (displayedPokemon.length === 0) {
    pokedex.innerHTML = '<div id="error-message">No Pokémon found.</div>';
    return;
  }
  for (const data of displayedPokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemoncard');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Details for ${data.name}`);
    card.dataset.id = data.id;
    card.dataset.types = data.types.map(t => t.type.name).join(',');
    card.innerHTML = `
      <div class="pokemonname">${data.name.toUpperCase()}</div>
      <div class="image">
        <img src="${data.sprites.front_default}" alt="${data.name}">
      </div>
      <div class="pokemonstats">
        <p>Type: ${data.types.map(t => t.type.name).join(', ')}</p>
        <p>HP: ${data.stats[0].base_stat}</p>
        <p>Attack: ${data.stats[1].base_stat}</p>
        <p>Defense: ${data.stats[2].base_stat}</p>
        <p>Speed: ${data.stats[5].base_stat}</p>
      </div>
      <button class="fav-btn" aria-label="${favorites.includes(data.id) ? 'Remove from team' : 'Add to team'}">${favorites.includes(data.id) ? '★' : '☆'}</button>
    `;
    // Card click for modal
    card.addEventListener('click', e => {
      if (e.target.classList.contains('fav-btn')) return;
      showPokemonModal(data.id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        showPokemonModal(data.id);
      }
    });
    // Favorite button
    card.querySelector('.fav-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(data.id);
    });
    pokedex.appendChild(card);
  }
  // Lazy loading: show Load More if more to show
  if (filtered.length > displayedPokemon.length) {
    let loadMore = document.getElementById('load-more-btn');
    if (!loadMore) {
      loadMore = document.createElement('button');
      loadMore.id = 'load-more-btn';
      loadMore.textContent = 'Load More';
      loadMore.className = 'btn';
      loadMore.addEventListener('click', () => {
        currentPage++;
        renderPokemon();
      });
      pokedex.parentNode.insertBefore(loadMore, pokedex.nextSibling);
    }
    loadMore.style.display = 'block';
  } else {
    const loadMore = document.getElementById('load-more-btn');
    if (loadMore) loadMore.style.display = 'none';
  }
  renderFavorites();
}

function renderFavorites() {
  favoritesTeam.innerHTML = '<b>Your Team:</b> ';
  if (favorites.length === 0) {
    favoritesTeam.innerHTML += '<span>No favorites yet.</span>';
    return;
  }
  for (const id of favorites) {
    const poke = allPokemonData.find(p => p.id === id);
    if (!poke) continue;
    const fav = document.createElement('span');
    fav.className = 'fav-poke';
    fav.textContent = poke.name;
    fav.tabIndex = 0;
    fav.setAttribute('role', 'button');
    fav.setAttribute('aria-label', `Remove ${poke.name} from team`);
    fav.addEventListener('click', () => toggleFavorite(id));
    fav.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleFavorite(id);
    });
    favoritesTeam.appendChild(fav);
  }
}
function toggleFavorite(id) {
  const idx = favorites.indexOf(id);
  if (idx === -1) favorites.push(id);
  else favorites.splice(idx, 1);
  localStorage.setItem('favoritesTeam', JSON.stringify(favorites));
  renderPokemon();
}

// --- Modal Logic ---
const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD'
};
async function showPokemonModal(id) {
  const poke = allPokemonData.find(p => p.id === id);
  if (!poke) return;
  showModal();
  const mainType = poke.types[0].type.name;
  const modalBg = TYPE_COLORS[mainType] || '#fff';
  modalContent.style.background = modalBg;
  modalContent.innerHTML = `<h2>${poke.name.toUpperCase()} (#${poke.id})</h2>
    <img src="${poke.sprites.front_default}" alt="${poke.name}" style="width:120px;">
    <p><b>Type:</b> ${poke.types.map(t => t.type.name).join(', ')}</p>
    <p><b>Abilities:</b> ${poke.abilities.map(a => a.ability.name).join(', ')}</p>
    <p><b>Base Stats:</b></p>
    <ul>
      ${poke.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}
    </ul>
    <p><b>Height:</b> ${poke.height / 10} m</p>
    <p><b>Weight:</b> ${poke.weight / 10} kg</p>
    <p><b>Moves:</b> ${poke.moves.slice(0, 8).map(m => m.move.name).join(', ')}${poke.moves.length > 8 ? ', ...' : ''}</p>
    <button id="modal-fav-btn">${favorites.includes(poke.id) ? 'Remove from Team' : 'Add to Team'}</button>
  `;
  document.getElementById('modal-fav-btn').onclick = () => {
    toggleFavorite(poke.id);
    showPokemonModal(poke.id);
  };
}
function showModal() {
  if (!pokemonModal || !closeModal) return;
  pokemonModal.style.display = 'flex';
  closeModal.focus();
}
function hideModal() {
  if (!pokemonModal) return;
  pokemonModal.style.display = 'none';
}
if (closeModal) closeModal.onclick = hideModal;
if (pokemonModal) {
  pokemonModal.addEventListener('click', e => {
    if (e.target === pokemonModal) hideModal();
  });
}
document.addEventListener('keydown', e => {
  if (pokemonModal && pokemonModal.style.display === 'flex' && e.key === 'Escape') hideModal();
});

// --- Type Chart Modal ---
if (typeChartBtn && typeChartModal && typeChartContent && closeTypeChart) {
  typeChartBtn.onclick = () => {
    typeChartModal.style.display = 'flex';
    typeChartContent.innerHTML = getTypeChartHTML();
    closeTypeChart.focus();
  };
  closeTypeChart.onclick = () => (typeChartModal.style.display = 'none');
  typeChartModal.addEventListener('click', e => {
    if (e.target === typeChartModal) typeChartModal.style.display = 'none';
  });
  document.addEventListener('keydown', e => {
    if (typeChartModal.style.display === 'flex' && e.key === 'Escape') typeChartModal.style.display = 'none';
  });
}
function getTypeChartHTML() {
  // Simple static chart for demo
  return `<h2>Type Effectiveness Chart</h2>
    <img src='https://static.wikia.nocookie.net/pokemon/images/8/89/Type_Chart.png' alt='Type Chart' style='width:100%;max-width:350px;'>`;
}

// --- Controls ---
if (searchBar) {
  searchBar.oninput = e => {
    currentSearch = e.target.value.toLowerCase();
    currentPage = 1;
    renderPokemon();
  };
}
if (sortDropdown) {
  sortDropdown.onchange = e => {
    currentSort = e.target.value;
    renderPokemon();
  };
}
if (genSelector) {
  genSelector.onchange = e => {
    const val = e.target.value;
    if (val === 'all') currentGenLimit = 1025;
    else currentGenLimit = {
      '1': 151, '2': 251, '3': 386, '4': 493, '5': 649, '6': 721, '7': 809, '8': 905, '9': 1025
    }[val] || 151;
    currentPage = 1;
    fetchPokemonData(currentGenLimit);
  };
}

// --- Type Filtering ---
if (typesContainer && pokedex) {
  typesContainer.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn) {
      const type = btn.className;
      currentType = type;
      currentPage = 1;
      renderPokemon();
    }
  });
}

// --- Initial Load & page-specific wiring ---
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');

  // If on Pokédex page, fetch data and optionally pre-filter by type
  if (pokedex) {
    if (typeParam) {
      currentType = typeParam;
    }
    fetchPokemonData(currentGenLimit);
  }

  // If on the landing page, clicking a type sends you to pokedex with the type preselected
  if (typesContainer && !pokedex) {
    typesContainer.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (btn) {
        const selectedType = btn.className;
        window.location.href = `pokedex.html?type=${encodeURIComponent(selectedType)}`;
      }
    });
  }
});


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

function filterPokemonByType(type) {
  const cards = document.querySelectorAll(".pokemoncard");
  cards.forEach(card => {
    const cardTypes = card.dataset.types.split(",");
    if (cardTypes.includes(type)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// (Removed duplicate DOMContentLoaded blocks and replaced with unified initializer above)

// showTypeIcons();