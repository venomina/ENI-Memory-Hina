// ==========================================================================
// memory.js : logique du jeu de Memory (page play.html)
// ==========================================================================

// Image affichée sur le dos d'une tuile (face cachée)
const tilesBack = "ressources/question_bleus_pastel.svg";

// Images des faces : 6 légumes, chacun présent 2 fois (= 6 paires)
const tabFaces = [
  "ressources/memory-legume/1.svg",
  "ressources/memory-legume/2.svg",
  "ressources/memory-legume/3.svg",
  "ressources/memory-legume/4.svg",
  "ressources/memory-legume/5.svg",
  "ressources/memory-legume/6.svg",
  "ressources/memory-legume/1.svg",
  "ressources/memory-legume/2.svg",
  "ressources/memory-legume/3.svg",
  "ressources/memory-legume/4.svg",
  "ressources/memory-legume/5.svg",
  "ressources/memory-legume/6.svg",
];

// Nom de chaque image, lu par les lecteurs d'écran (accessibilité)
const faceNames = {
  "ressources/memory-legume/1.svg": "pomme",
  "ressources/memory-legume/2.svg": "banane",
  "ressources/memory-legume/3.svg": "brocoli",
  "ressources/memory-legume/4.svg": "cerise",
  "ressources/memory-legume/5.svg": "piment",
  "ressources/memory-legume/6.svg": "fraise",
};

// Mélange le tableau sur place (algorithme de Fisher-Yates) :
// à chaque position i, on échange avec une position j tirée entre i et la fin
function mixGrid(tabFaces) {
  for (let i = 0; i < tabFaces.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (tabFaces.length - i));
    [tabFaces[i], tabFaces[j]] = [tabFaces[j], tabFaces[i]];
  }
}

// Éléments de la page
const tiles = document.querySelectorAll("td"); // les 12 tuiles du plateau
const attemptsDisplay = document.querySelector(".nbAttempts");
const finalMessage = document.querySelector(".finalMessage");

// État de la partie
let firstIndex = null; // index de la première tuile retournée (null si aucune)
let locked = false; // true tant que deux tuiles différentes sont visibles
let nbAttempts = 0; // nombre de coups joués
let nbFound = 0; // nombre de tuiles déjà trouvées
let gameOver = false; // true quand toutes les paires sont trouvées

// Affiche le nombre de coups dans le compteur
function updateAttempts() {
  attemptsDisplay.textContent = "Nombre de coups : " + nbAttempts;
}

// Met à jour le nom accessible du bouton d'une tuile
// (les images ont un alt vide : c'est ce nom que lit le lecteur d'écran)
function updateTileLabel(index, faceSrc) {
  const state = faceSrc === tilesBack ? "face cachée" : faceNames[faceSrc];
  tiles[index]
    .querySelector("button")
    .setAttribute("aria-label", "Tuile " + (index + 1) + ", " + state);
}

// Retourne une tuile : la classe "flipping" réduit l'image (CSS),
// puis on change l'image au bout de 200 ms et l'image reprend sa taille
function tileFlip(img, newImg) {
  img.classList.add("flipping");
  setTimeout(() => {
    img.src = newImg;
    img.classList.remove("flipping");
  }, 200);
}

// Mélange les tuiles au chargement de la page
mixGrid(tabFaces);

// Nom accessible initial : toutes les tuiles sont face cachée
tiles.forEach((tile, index) => updateTileLabel(index, tilesBack));

// Clic sur une tuile
tiles.forEach((oneTile, index) => {
  oneTile.addEventListener("click", () => {
    // Clic ignoré : jeu verrouillé, même tuile que la première, ou déjà trouvée
    if (locked || index === firstIndex || oneTile.classList.contains("found")) {
      return;
    }

    const img = oneTile.querySelector("img");
    tileFlip(img, tabFaces[index]);
    updateTileLabel(index, tabFaces[index]);

    // Première tuile du coup : on mémorise son index et on attend la seconde
    if (firstIndex === null) {
      firstIndex = index;
      return;
    }

    // Seconde tuile : un coup est joué
    nbAttempts++;
    updateAttempts();

    const firstTileIndex = firstIndex;
    const firstTile = tiles[firstTileIndex];

    if (tabFaces[firstIndex] === tabFaces[index]) {
      // Paire trouvée : les deux tuiles restent visibles
      firstTile.classList.add("found");
      oneTile.classList.add("found");
      firstIndex = null;

      // Toutes les paires sont trouvées : victoire
      nbFound += 2;
      if (nbFound === tiles.length) {
        gameOver = true;
        finalMessage.textContent =
          "Bravo ! Vous avez gagné en " + nbAttempts + " coups !";
      }
    } else {
      // Paire différente : on verrouille le jeu 2 secondes,
      // puis on remet les deux tuiles face cachée
      locked = true;
      setTimeout(() => {
        tileFlip(firstTile.querySelector("img"), tilesBack);
        tileFlip(img, tilesBack);
        updateTileLabel(firstTileIndex, tilesBack);
        updateTileLabel(index, tilesBack);
        firstIndex = null;
        locked = false;
      }, 2000);
    }
  });
});

// Remet la partie à zéro : tuiles cachées, compteurs à 0, nouveau mélange
function gameReset() {
  tiles.forEach((tile, index) => {
    tile.classList.remove("found");
    tile.querySelector("img").src = tilesBack;
    updateTileLabel(index, tilesBack);
  });

  firstIndex = null;
  locked = false;
  nbAttempts = 0;
  nbFound = 0;
  gameOver = false;
  finalMessage.textContent = "";
  updateAttempts();
  mixGrid(tabFaces);
}

// Barre espace : relance une partie, seulement si la partie est terminée
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && gameOver) {
    event.preventDefault(); // empêche le défilement de la page
    gameReset();
  }
});
