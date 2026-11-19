const form = document.getElementById("form-inscription");

const name = document.getElementById("name");
const mail = document.getElementById("mail");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password-confirm");

const strength = document.getElementById("passStrength");
const strengthText = document.getElementById("strength-text");

function getStrength(value) {
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^\p{L}\p{N}]/u.test(value);

  if (value.length < 6) {
    return "faible";
  }

  if (value.length > 9 && hasNumber && hasSymbol) {
    return "fort";
  }

  if (hasNumber || hasSymbol) {
    return "moyen";
  }
  return "faible";
}

function updateStrength() {
  if (password.value === "") {
    strength.dataset.level = "";
    strengthText.textContent = "";
    return;
  }

  const getLevel = getStrength(password.value);
  strength.dataset.level = getLevel;
  strengthText.textContent =
    "Niveau de sécurité : " +
    getLevel.charAt(0).toUpperCase() +
    getLevel.slice(1);
}

password.addEventListener("input", updateStrength);

form.addEventListener("reset", () => {
  strength.dataset.level = "";
  strengthText.textContent = "";
});
