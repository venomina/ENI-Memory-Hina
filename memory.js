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

const tilesBack = "ressources/question_bleus_pastel.svg";

console.log(tabFaces);
console.log(tilesBack);

function mixGrid(tabFaces) {
  for (let i = 0; i < tabFaces.length - 1; i++) {
    const j = i + Math.floor(Math.random() * (tabFaces.length - i));
    [tabFaces[i], tabFaces[j]] = [tabFaces[j], tabFaces[i]];
  }
}

mixGrid(tabFaces);
console.log(tabFaces);

const tiles = document.querySelectorAll("td");

tiles.forEach((oneTile, index) => {
  oneTile.addEventListener("click", () => {
    console.log("oneTile :", index);
    const img = oneTile.querySelector("img");
    img.src = tabFaces[index];
  });
});

let firstIndex = null;
let locked = false;

mixGrid(tabFaces);

tiles.forEach((oneTile, index) => {
  oneTile.addEventListener("click", () => {
    if (locked || index === firstIndex || oneTile.classList.contains("found")) {
      return;
    }

    const img = oneTile.querySelector("img");
    img.src = tabFaces[index];

    if (firstIndex === null) {
      firstIndex = index;
      return;
    }

    const firstTile = tiles[firstIndex];

    if (tabFaces[firstIndex] === tabFaces[index]) {
      firstTile.classList.add("found");
      oneTile.classList.add("found");
      firstIndex = null;
    } else {
      locked = true;
      setTimeout(() => {
        firstTile.querySelector("img").src = tilesBack;
        img.src = tilesBack;
        firstIndex = null;
        locked = false;
      }, 3000);
    }
  });
});
