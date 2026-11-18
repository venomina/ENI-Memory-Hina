const form = document.getElementById(form-inscription);
const password = document.getElementById("password");

const champs = {
    input: document.getElementById("name"),
    error: document.getElementById("error-name"),
    test: (v) => /^[A-Za-z]{3,}$/.test(v),
    message: "3 lettres minimum, sans chiffre, ni symbole",
},

