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

function setState(input, isGood, message = "") {
  const group = input.closest(".group");
  const error = group.querySelector(".error");

  group.classList.toggle("valide", isGood === true);
  group.classList.toggle("invalide", isGood === false);

  if (isGood === null) {
    input.removeAttribute("aria-invalid");
  } else {
    input.setAttribute("aria-invalid", String(isGood === false));
  }

  error.textContent = isGood === false ? message : "";
}

function validateName() {
  const isGood = userName.value.trim().length >= 3;
  setState(userName, isGood, "Rentrez au moins 3 caractères.");
  return isGood;
}

function validateMail() {
  const isGood = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
  setState(mail, isGood, "Merci d'entrer une adresse mail valide.");
  return isGood;
}

function validatePassword() {
  const value = password.value;
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^\p{L}\p{N}]/u.test(value);
  const isGood = value.length >= 6 && hasNumber && hasSymbol;
  setState(
    password,
    isGood,
    "Rentrez un mot de passe valide (6 caractères, un chiffre, un symbole).",
  );
  return isGood;
}

function validatePasswordConfirm() {
  const isGood =
    passwordConfirm.value !== "" && passwordConfirm.value === password.value;
  setState(passwordConfirm, isGood, "Les mots de passe ne correspondent pas.");
  return isGood;
}

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

userName.addEventListener("input", () => {
  if (userName.value === "") return setState(userName, null);
  validateName();
});

mail.addEventListener("input", () => {
  if (mail.value === "") return setState(mail, null);
  validateMail();
});

passwordConfirm.addEventListener("input", () => {
  if (passwordConfirm.value === "") return setState(passwordConfirm, null);
  validatePasswordConfirm();
});

password.addEventListener("input", () => {
  updateStrength();
  if (password.value === "") {
    setState(password, null);
  } else {
    validatePassword();
  }

  if (passwordConfirm.value !== "") validatePasswordConfirm();
});

form.addEventListener("submit", (event) => {
  const results = [
    [userName, validateName()],
    [mail, validateMail()],
    [password, validatePassword()],
    [passwordConfirm, validatePasswordConfirm()],
  ];

  const firstError = results.find(([, isGood]) => !isGood);
  if (firstError) {
    event.preventDefault();
    firstError[0].focus();
  }
});

form.addEventListener("reset", () => {
  [userName, mail, password, passwordConfirm].forEach((input) =>
    setState(input, null),
  );
  strength.dataset.level = "";
  strengthText.textContent = "";
});
