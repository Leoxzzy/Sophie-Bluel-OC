window.addEventListener('load', () => {
    document.querySelector('#loginButton').addEventListener('click', () => {
        let userData = {}
        userData.email = document.querySelector('#mailInput').value
        userData.password = document.querySelector('#passwordInput').value
        loginUser(userData)
    })
})

function loginUser(userData) {
    console.log(userData)
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
            document.querySelector('#mailInput').value = ""
            document.querySelector('#passwordInput').value = ""
            document.querySelector('#mailInput').style.outline = "1px solid red"
            document.querySelector('#passwordInput').style.outline = "1px solid red"


            console.error("ERROR:", error);
        });

}

