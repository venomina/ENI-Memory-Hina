// ==========================================================================
// inscription.js : page d'inscription (inscription.html)
// Pour l'instant : indicateur de force du mot de passe uniquement.
// La validation des autres champs reste à faire.
// ==========================================================================

// Formulaire et champs de la page
const form = document.getElementById("formInscription");
const password = document.getElementById("password");

// Champs préparés pour la validation à venir (pas encore utilisés)
const userName = document.getElementById("name");
const mail = document.getElementById("mail");
const passwordConfirm = document.getElementById("passwordConfirm");

// Indicateur de force : le conteneur (porte data-level) et son texte
const strength = document.getElementById("passStrength");
const strengthText = document.getElementById("strengthText");

// Calcule le niveau du mot de passe : "faible", "moyen" ou "fort"
function getStrength(value) {
  const hasNumber = /\d/.test(value);
  // Symbole = tout caractère qui n'est ni une lettre ni un chiffre
  const hasSymbol = /[^\p{L}\p{N}]/u.test(value);

  // Fort : plus de 9 caractères, avec un chiffre et un symbole
  if (value.length > 9 && hasNumber && hasSymbol) {
    return "fort";
  }

  // Moyen : plus de 6 caractères, avec un chiffre ou un symbole
  if (value.length > 6 && (hasNumber || hasSymbol)) {
    return "moyen";
  }

  // Faible : tout le reste (6 caractères ou moins, ou lettres seulement)
  return "faible";
}

// Met à jour l'indicateur : data-level pilote la couleur et la longueur
// de la barre dans le CSS, le texte affiche le niveau
function updateStrength() {
  if (password.value === "") {
    strength.dataset.level = "";
    strengthText.textContent = "";
    return;
  }

  const level = getStrength(password.value);
  strength.dataset.level = level;
  strengthText.textContent =
    "Niveau de sécurité : " + level.charAt(0).toUpperCase() + level.slice(1);
}

// Recalcule l'indicateur à chaque caractère saisi
password.addEventListener("input", updateStrength);

// Efface l'indicateur quand on clique sur "Annuler"
form.addEventListener("reset", () => {
  strength.dataset.level = "";
  strengthText.textContent = "";
});
