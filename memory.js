const tilesBack = "ressources/question_bleus_pastel.svg";
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

function mixGrid(tabFaces) {
  for (let i = 0; i < tabFaces.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (tabFaces.length - i));
    [tabFaces[i], tabFaces[j]] = [tabFaces[j], tabFaces[i]];
  }
}

const tiles = document.querySelectorAll("td");
const attemptsDisplay = document.querySelector(".nbAttempts");
const finalMessage = document.querySelector(".finalMessage");

let firstIndex = null;
let locked = false;
let nbAttempts = 0;
let nbFound = 0;
let gameOver = false;

function updateAttempts() {
  attemptsDisplay.textContent = "Nombre de coups : " + nbAttempts;
}

function gameReset() {
  tiles.forEach((tile) => {
    tile.classList.remove("found");
    tile.querySelector("img").src = tilesBack;
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

function cardFlip(img, newImg) {
  img.classList.add("flipping");
  setTimeout(() => {
    img.src = newImg;
    img.classList.remove("flipping");
  }, 200);
}

mixGrid(tabFaces);

tiles.forEach((oneTile, index) => {
  oneTile.addEventListener("click", () => {
    if (locked || index === firstIndex || oneTile.classList.contains("found")) {
      return;
    }

    const img = oneTile.querySelector("img");
    cardFlip(img, tabFaces[index]);

    if (firstIndex === null) {
      firstIndex = index;
      return;
    }

    nbAttempts++;
    updateAttempts();

    const firstTile = tiles[firstIndex];

    if (tabFaces[firstIndex] === tabFaces[index]) {
      firstTile.classList.add("found");
      oneTile.classList.add("found");
      firstIndex = null;

      nbFound += 2;
      if (nbFound === tiles.length) {
        gameOver = true;
        finalMessage.textContent =
          "Bravo ! Vous avez gagné en " + nbAttempts + " coups !";
      }
    } else {
      locked = true;
      setTimeout(() => {
        cardFlip(firstTile.querySelector("img"), tilesBack);
        cardFlip(img, tilesBack);
        firstIndex = null;
        locked = false;
      }, 1000);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && gameOver) {
    event.preventDefault();
    gameReset();
  }
});
