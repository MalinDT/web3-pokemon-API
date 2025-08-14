# 📝 Hvordan bygge denne moderne Pokédex-nettappen

## Oversikt
Denne veiledningen hjelper deg å gjenskape en moderne, interaktiv Pokédex-nettapp med:
- En forside med Pokémon-typeikoner for navigasjon
- En Pokédex-side med søk, sortering, filtrering, detaljer i popup, favoritter/teambygger og mer
- Responsivt, moderne design

---

## 1. Prosjektstruktur

Prosjektet ditt bør se slik ut:

```
web3-pokemon-API/
├── css/
│   ├── pokedex.css
│   ├── style.css
├── img/
│   └── (typeikoner, logo, osv.)
├── js/
│   ├── data.js
│   ├── script.js
├── index.html
├── pokedex.html
└── html/ (valgfrie duplikat-innsteg)
    ├── index.html  (bruker ../-stier for css/js/img)
    └── pokedex.html (bruker ../-stier for css/js/img)
```

Merk: Du kan bruke enten rot-`index.html`/`pokedex.html` eller duplikatene i `html/`. Ikke bland dem under bruk; lenker er satt opp til å være konsistente innen hvert sett.

---

## 2. Forside (`index.html` eller `html/index.html`)

- Viser en rad med Pokémon-typeikoner.
- Klikk på en type navigerer til Pokédex med forhåndsvalgt filter: `pokedex.html?type=TYPE_NAME`.
- "dark"-typeikonet er kommentert ut (ingen Gen 1 dark-typer).
- Den gamle `radom.html`-lenken er fjernet; "Generate"-knappen er nå en plassholder (`#`).

**Nøkkelkode for typeikon-navigasjon:**
```js
// I js/script.js
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

## 3. Pokédex-side (`pokedex.html` eller `html/pokedex.html`)

### Funksjoner:
- **Typebar** for filtrering
- **Søkefelt** (på navn eller nummer)
- **Sorteringsmeny** (nummer, navn, stats)
- **Generasjonsvelger** (velg hvilke generasjoner som skal vises)
- **Pokémon-rutenett** (kort for hver Pokémon)
- **Popup/modal** for Pokémon-detaljer (evner, stats, evolusjoner, osv.)
- **Favoritter/teambygger** (legg til/fjern Pokémon, lagres i localStorage)
- **Typekart-modal**
- **Lasteindikator og feilhåndtering**
- **Responsivt og tilgjengelig design**

### Viktige HTML-elementer:
- `.controls-bar` for søk, sortering, generasjonsvelger og typekart-knapp
- `#pokedex` for Pokémon-rutenettet
- `#pokemon-modal` for detalj-popup
- `#favorites-team` for teambygger
- `#type-chart-modal` for typekart

Inkluder hovedscriptet med `defer` slik at DOM-elementer finnes når koden kjører:

```html
<script src="js/script.js" defer></script>
```
For `html/`-sidene går stiene ett nivå opp:
```html
<script src="../js/script.js" defer></script>
```

---

## 4. JavaScript (`js/script.js`)

### Hovedlogikk:
- **Hent Pokémon-data** fra [PokéAPI](https://pokeapi.co/)
- **Vis kort** for hver Pokémon, med typeinfo i et `data-types`-attributt
- **Filtrer** på type (fra typebar eller URL-parameter)
- **Søk** på navn eller nummer (sanntidsfiltrering)
- **Sorter** på nummer, navn eller stats
- **Paginering/lazy loading** (vis flere etter hvert som du blar/klikker)
- **Vis popup** med detaljer når et kort klikkes
- **Legg til/fjern favoritter** (teambygger, lagres i localStorage)
- **Vis typekart** i en modal
- **Håndter lasting og feil** på en god måte
- **Bruk typebasert stil** på popup

Sidedeteksjon er automatisk: hvis `#pokedex` finnes, lastes data og filtrering i siden aktiveres; på forsiden navigerer klikk på type til Pokédex med `type`-parameter. Dupliserte `DOMContentLoaded`-blokker er slått sammen for å unngå dobbelt-binding og konflikt.

**Eksempel: Filtrering på type**
```js
function filterPokemonByType(type) {
  const cards = document.querySelectorAll(".pokemoncard");
  cards.forEach(card => {
    const cardTypes = card.dataset.types.split(",");
    card.style.display = cardTypes.includes(type) ? "block" : "none";
  });
}
```

**Eksempel: Modal-stil etter type**
```js
const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', // osv.
};
function showPokemonModal(id) {
  const poke = allPokemonData.find(p => p.id === id);
  const mainType = poke.types[0].type.name;
  modalContent.style.background = TYPE_COLORS[mainType] || '#fff';
  // ...vis modal-innhold...
}
```

---

## 5. CSS (`css/pokedex.css` og `css/style.css`)

- **Moderne, rent utseende** med flexbox/grid-layout
- **Typebar** er sentrert, har mellomrom og er visuelt tydelig
- **Pokémon-kort** har skygge, avrundede hjørner og hover-effekt
- **Popups** er stilige og responsive, med typebasert bakgrunn
- **Kontrollfelt** er tilgjengelig og mobilvennlig

---

## 6. Bilder (`img/`)

- Typeikoner: `POKEMON_TYPE_FIRE.png`, `POKEMON_TYPE_WATER.png`, osv. (lagret direkte under `img/`)
- Pokémon-logo og andre ressurser

---

## 7. Tilgjengelighet og responsivitet

- Alle interaktive elementer har `aria-label` og kan brukes med tastatur
- Layout tilpasser seg mobil og desktop

---

## 8. Publisering

- Du kan publisere dette som et statisk nettsted (f.eks. GitHub Pages, Netlify, Vercel)
- Ingen backend kreves; all data hentes fra offentlig PokéAPI
- Velg ett sett med innsteg (rot eller `html/`) og hold stier konsistente. Vurder å fjerne det ubrukte settet før publisering for å unngå forvirring.

---

## 9. Feilsøking

- Hvis typeikoner ikke fungerer, sjekk event listener i `js/script.js`
- Hvis filtrering ikke fungerer, sjekk at `data-types`-attributtet er satt på hvert kort
- Hvis popup ikke vises, sjekk modal-HTML og JS-logikk

---

## 10. Referanse

- [MalinDT/web3-pokemon-API på GitHub](https://github.com/MalinDT/web3-pokemon-API)

---

**Hvis du har spørsmål eller trenger mer detaljer om en funksjon, er det bare å spørre!** 