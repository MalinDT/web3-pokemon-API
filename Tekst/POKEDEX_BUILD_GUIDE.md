# 📝 How to Build This Modern Pokédex Web App

## Overview
This guide will help you recreate a modern, interactive Pokédex web app with:
- A home page featuring Pokémon type icons for navigation
- A Pokédex page with search, sorting, filtering, modals for details, favorites/team builder, and more
- Responsive, modern styling

---

## 1. Project Structure

Your project should look like this:

```
web3-pokemon-API/
├── css/
│   ├── pokedex.css
│   ├── style.css
├── img/
│   └── (type icons, logo, etc.)
├── js/
│   ├── data.js
│   ├── script.js
├── index.html
├── pokedex.html
└── html/ (optional duplicate entry points)
    ├── index.html  (uses ../ paths for css/js/img)
    └── pokedex.html (uses ../ paths for css/js/img)
```

Note: You can use either the root `index.html`/`pokedex.html` or the duplicates in `html/`. Do not mix them during browsing; links are set up to be consistent within each set.

---

## 2. Home Page (`index.html` or `html/index.html`)

- Displays a bar of Pokémon type icons.
- Clicking a type navigates to the Pokédex with a preselected filter: `pokedex.html?type=TYPE_NAME`.
- The "dark" type icon is commented out (no Gen 1 dark types).
- The old `radom.html` link has been removed; the "Generate" button is currently a placeholder (`#`).

**Key code for type icon navigation:**
```js
// In js/script.js
document.addEventListener("DOMContentLoaded", () => {
  const typeContainer = document.getElementById("types");
  if (typeContainer && !document.getElementById("pokedex")) {
    typeContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) {
        const selectedType = btn.className;
        window.location.href = `pokedex.html?type=${encodeURIComponent(selectedType)}`;
      }
    });
  }
});
```

---

## 3. Pokédex Page (`pokedex.html` or `html/pokedex.html`)

### Features:
- **Type bar** for filtering
- **Search bar** (by name or number)
- **Sorting dropdown** (number, name, stats)
- **Generation selector** (choose which generations to load)
- **Pokémon grid** (cards for each Pokémon)
- **Modal popup** for Pokémon details (abilities, stats, evolutions, etc.)
- **Favorites/team builder** (add/remove Pokémon, stored in localStorage)
- **Type chart modal**
- **Loading spinner and error handling**
- **Responsive and accessible design**

### Key HTML Elements:
- `.controls-bar` for search, sorting, generation selector, and type chart button
- `#pokedex` for the Pokémon grid
- `#pokemon-modal` for the details popup
- `#favorites-team` for the team builder
- `#type-chart-modal` for the type chart

Include the main script with `defer` so DOM elements exist when the code runs:

```html
<script src="js/script.js" defer></script>
```
For the `html/` pages, paths go up one level:
```html
<script src="../js/script.js" defer></script>
```

---

## 4. JavaScript (`js/script.js`)

### Main Logic:
- **Fetch Pokémon data** from the [PokéAPI](https://pokeapi.co/)
- **Render cards** for each Pokémon, with type info in a `data-types` attribute
- **Filter** by type (from the type bar or URL parameter)
- **Search** by name or number (real-time filtering)
- **Sort** by number, name, or stats
- **Paginate/lazy load** (show more as you scroll/click)
- **Show modal** with detailed info when a card is clicked
- **Add/remove favorites** (team builder, stored in localStorage)
- **Show type chart** in a modal
- **Handle loading and errors** gracefully
- **Apply type-appropriate styling** to modals

Page detection is automatic: if `#pokedex` exists, data is loaded and in-page filtering is enabled; on the home page, clicking a type navigates to the Pokédex with a `type` query parameter. Duplicate `DOMContentLoaded` handlers were consolidated to avoid double-binding and conflicting behavior.

**Example: Filtering by Type**
```js
function filterPokemonByType(type) {
  const cards = document.querySelectorAll(".pokemoncard");
  cards.forEach(card => {
    const cardTypes = card.dataset.types.split(",");
    card.style.display = cardTypes.includes(type) ? "block" : "none";
  });
}
```

**Example: Modal Styling by Type**
```js
const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', // etc.
};
function showPokemonModal(id) {
  const poke = allPokemonData.find(p => p.id === id);
  const mainType = poke.types[0].type.name;
  modalContent.style.background = TYPE_COLORS[mainType] || '#fff';
  // ...render modal content...
}
```

---

## 5. CSS (`css/pokedex.css` and `css/style.css`)

- **Modern, clean look** with flexbox/grid layouts
- **Type bar** is centered, spaced, and visually distinct
- **Pokémon cards** have shadows, rounded corners, and hover effects
- **Modals** are styled and responsive, with type-appropriate backgrounds
- **Controls bar** is accessible and mobile-friendly

---

## 6. Images (`img/`)

- Type icons: `POKEMON_TYPE_FIRE.png`, `POKEMON_TYPE_WATER.png`, etc. (stored directly under `img/`)
- Pokémon logo and other assets

---

## 7. Accessibility & Responsiveness

- All interactive elements have `aria-label`s and keyboard navigation
- Layout adapts to mobile and desktop screens

---

## 8. Deployment

- You can deploy this as a static site (e.g., GitHub Pages, Netlify, Vercel)
- No backend required; all data is fetched from the public PokéAPI
- Choose one set of entry points (root or `html/`) and keep paths consistent. Consider removing the unused set before deploying to avoid confusion.

---

## 9. Troubleshooting

- If type icons don't work, check the event listener in `js/script.js`
- If filtering doesn't work, ensure the `data-types` attribute is set on each card
- If modals don't show, check the modal HTML and JS logic

---

## 10. Reference

- [MalinDT/web3-pokemon-API on GitHub](https://github.com/MalinDT/web3-pokemon-API)

---

**If you have any questions or need more details on a specific feature, just ask!** 