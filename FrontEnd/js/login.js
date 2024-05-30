
window.addEventListener('load', () => {
    document.querySelector('#loginButton').addEventListener('click', () => {
        let userData = {}
        userData.email = document.querySelector('#mailInput').value
        userData.password = document.querySelector('#passwordInput').value
        loginUser(userData)
    })
})

function loginUser(userData) {
    let params = {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(userData)
    }


    fetch("http://localhost:5678/api/users/login", params)
        .then(function (response) {
            if (response.ok) { return response.json(); } // Vérifier si la réponse est OK (code de statut 200) / Parser la réponse JSON
            throw new Error("Error retrieving projects: " + response.statusText);
        })
        .then(function (data) {
            localStorage.setItem('token', data.token)
            window.location.href = "index.html"
        })
        .catch(function (error) {
            notification('Identifiants de connexion incorrects!', 'error')
        });

}


function notification(text, type) {
    if (text === undefined && typeof text !== 'string' || type === undefined && typeof type !== 'string') { console.error('Mauvaise utilisation de la fonction "notification"!') }

    const notification = document.querySelector('.notification')
    notification.innerHTML = ""

    let symbolClass = null
    let symbolColor = null
    if (type == 'success') { symbolClass = "fa-regular fa-circle-check"; symbolColor = 'green'; } else if (type == 'error') { symbolClass = "fa-solid fa-ban"; symbolColor = 'red'; }

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
