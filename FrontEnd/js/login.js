/* Fonction permettant d'afficher une petite notification ayant une animation. */
function notification(text, type) {
    if (text === null && typeof text !== 'string' || type === null && typeof type !== 'string') {
        return console.error('Mauvaise utilisation de la fonction "notification"!')
    }

    const notification = document.querySelector('.notification')
    notification.innerHTML = ""

    let symbolClass = null
    let symbolColor = null
    if (type == 'success') { symbolClass = "fa-regular fa-circle-check"; symbolColor = 'green'; }
    else if (type == 'error') { symbolClass = "fa-solid fa-ban"; symbolColor = 'red'; }

    let notificationSymbol = document.createElement('i')
    notificationSymbol.className = symbolClass
    notificationSymbol.style.color = symbolColor

    let notificationContent = document.createElement('p')
    notificationContent.textContent = text

    notification.appendChild(notificationSymbol)
    notification.appendChild(notificationContent)

    notification.classList.add('show');
    setTimeout(() => { notification.classList.remove('show'); }, 3000)
}


/* Fonction permettant d'exécuter une requête de connexion à l'API en utilisant les identifiants saisis par l'utilisateur. */
async function loginUser() {
    let userData = {}
    userData.email = document.querySelector('#mailInput').value
    userData.password = document.querySelector('#passwordInput').value

    let params = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(userData)
    }

    try {
        const loginRequest = await fetch("http://localhost:5678/api/users/login", params)
        const loginResponse = await loginRequest.json()

        if (loginResponse.token !== null && loginResponse.token !== undefined) {
            localStorage.setItem('token', loginResponse.token)
            window.location.href = "index.html"
        } else {
            notification('Identifiants de connexion incorrects!', 'error')
        }

    } catch(error) {
        console.error('Une erreur est survenue lors de la connexion:', error)
    }
}


/* Ecoute de l'événement "submit" du formulaire de connexion. */
window.addEventListener('load', () => {
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loginUser();
    });
});

