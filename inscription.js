// ==========================================================================
// inscription.js : page d'inscription (inscription.html)
// - Validation en direct des 4 champs (icône, couleur de bordure, message)
// - Indicateur de force du mot de passe (barre faible / moyen / fort)
// - Blocage de l'envoi du formulaire s'il reste une erreur
// ==========================================================================

// --------------------------------------------------------------------------
// Éléments de la page
// --------------------------------------------------------------------------

// Formulaire et champs de saisie
const form = document.getElementById("formInscription");
const userName = document.getElementById("name");
const mail = document.getElementById("mail");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");

// Indicateur de force : le conteneur (porte data-level) et son texte
const strength = document.getElementById("passStrength");
const strengthText = document.getElementById("strengthText");

// --------------------------------------------------------------------------
// Affichage de l'état d'un champ
// --------------------------------------------------------------------------

// Applique l'état d'un champ (le CSS affiche ensuite la bordure et l'icône
// selon la classe du groupe) :
// - isGood === true  : classe "valide"   (bordure verte + icône ✔)
// - isGood === false : classe "invalide" (bordure rouge + icône ! + message)
// - isGood === null  : aucun état (champ vide ou formulaire réinitialisé)
function setState(input, isGood, message = "") {
  // Le groupe est le <li class="group"> qui contient le champ, ses icônes
  // et son message d'erreur
  const group = input.closest(".group");
  const error = group.querySelector(".error");

  // toggle(classe, condition) : ajoute la classe si la condition est vraie,
  // la retire sinon
  group.classList.toggle("valide", isGood === true);
  group.classList.toggle("invalide", isGood === false);

  // aria-invalid prévient les lecteurs d'écran qu'un champ est incorrect
  if (isGood === null) {
    input.removeAttribute("aria-invalid");
  } else {
    input.setAttribute("aria-invalid", String(isGood === false));
  }

  // Le message n'est affiché que si le champ est invalide
  error.textContent = isGood === false ? message : "";
}

// --------------------------------------------------------------------------
// Règles de validation
// Chaque fonction affiche l'état du champ et retourne true s'il est valide
// --------------------------------------------------------------------------

// Nom d'utilisateur : 3 caractères minimum (espaces autour ignorés)
function validateName() {
  const isGood = userName.value.trim().length >= 3;
  setState(userName, isGood, "Rentrez au moins 3 caractères.");
  return isGood;
}

// Email : format texte@texte.extension, sans espace
function validateMail() {
  const isGood = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
  setState(mail, isGood, "Merci d'entrer une adresse mail valide.");
  return isGood;
}

// Mot de passe : 6 caractères minimum, avec un chiffre et un symbole
function validatePassword() {
  const value = password.value;
  const hasNumber = /\d/.test(value);
  // Symbole = tout caractère qui n'est ni une lettre ni un chiffre
  const hasSymbol = /[^\p{L}\p{N}]/u.test(value);
  const isGood = value.length >= 6 && hasNumber && hasSymbol;
  setState(
    password,
    isGood,
    "Rentrez un mot de passe valide (6 caractères, un chiffre, un symbole).",
  );
  return isGood;
}

// Confirmation : non vide et identique au mot de passe
function validatePasswordConfirm() {
  const isGood =
    passwordConfirm.value !== "" && passwordConfirm.value === password.value;
  setState(passwordConfirm, isGood, "Les mots de passe ne correspondent pas.");
  return isGood;
}

// --------------------------------------------------------------------------
// Force du mot de passe
// --------------------------------------------------------------------------

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
  // Champ vide : on cache l'indicateur
  if (password.value === "") {
    strength.dataset.level = "";
    strengthText.textContent = "";
    return;
  }

  const level = getStrength(password.value);
  strength.dataset.level = level;
  // Première lettre en majuscule : "faible" devient "Faible"
  strengthText.textContent =
    "Niveau de sécurité : " + level.charAt(0).toUpperCase() + level.slice(1);
}

// --------------------------------------------------------------------------
// Événements
// --------------------------------------------------------------------------

// Validation en direct pendant la saisie.
// Un champ vide n'a pas d'état : ni erreur, ni icône.

// Nom d'utilisateur
userName.addEventListener("input", () => {
  if (userName.value === "") return setState(userName, null);
  validateName();
});

// Email
mail.addEventListener("input", () => {
  if (mail.value === "") return setState(mail, null);
  validateMail();
});

// Confirmation du mot de passe
passwordConfirm.addEventListener("input", () => {
  if (passwordConfirm.value === "") return setState(passwordConfirm, null);
  validatePasswordConfirm();
});

// Mot de passe : indicateur de force + validation
password.addEventListener("input", () => {
  updateStrength();
  if (password.value === "") {
    setState(password, null);
  } else {
    validatePassword();
  }

  // Le mot de passe a changé : on revérifie la confirmation si elle est remplie
  if (passwordConfirm.value !== "") validatePasswordConfirm();
});

// À l'envoi : on valide tous les champs, et on bloque l'envoi
// s'il reste une erreur
form.addEventListener("submit", (event) => {
  // Chaque entrée associe un champ au résultat de sa validation.
  // Tous les champs sont validés pour afficher toutes les erreurs d'un coup.
  const results = [
    [userName, validateName()],
    [mail, validateMail()],
    [password, validatePassword()],
    [passwordConfirm, validatePasswordConfirm()],
  ];

  // Premier champ invalide (undefined si tout est valide)
  const firstError = results.find(([, isGood]) => !isGood);
  if (firstError) {
    event.preventDefault(); // empêche l'envoi du formulaire
    firstError[0].focus(); // place le curseur sur le premier champ en erreur
  }
});

// Bouton "Annuler" : on efface l'état de tous les champs et l'indicateur
form.addEventListener("reset", () => {
  [userName, mail, password, passwordConfirm].forEach((input) =>
    setState(input, null),
  );
  strength.dataset.level = "";
  strengthText.textContent = "";
});
