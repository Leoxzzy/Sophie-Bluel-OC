export let PageMetadata = {}

window.addEventListener("load", () => {
    document.querySelector('#editBtn-portfolio').style.display = 'none'
    loadPageMetadata(true)
    DoesUserAdmin()
});


/* Fonction permettant de charger les Metadonnées de la page */
export async function loadPageMetadata(firtTime) {    
    fetch("http://localhost:5678/api/works")
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            PageMetadata.works = response
        })
    
    fetch("http://localhost:5678/api/categories")
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            PageMetadata.categories = response

            // Dispatch a custom event indicating data is ready
            if (firtTime) {
                const event = new Event('PageMetadataLoaded');
                window.dispatchEvent(event);
            }

            ProjectContainerInitialization()
            ProjectFiltersInitialization()
        })
}


/* Fonction permettant d'initialiser le container de projets */
function ProjectContainerInitialization() {
    /* Réinitialisation de la div ayant la classe ".gallery" */
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    /* Création des différents projets */
    PageMetadata.works.forEach((element) => {
        let figure = document.createElement('figure')
        gallery.appendChild(figure)

        let image = document.createElement('img')
        image.src = element.imageUrl
        image.alt = "Photographie d'une prestation réalisée par Sophie Bluel";

        let figcaption = document.createElement('figcaption')
        figcaption.textContent = element.title

        figure.appendChild(image)
        figure.appendChild(figcaption)
    });
}


/* Fonction permettant d'initialiser les filtres de projets */
function ProjectFiltersInitialization() {
    /* Réinitialisation de la div ayant la classe ".portfolio-filters" */
    const filters = document.querySelector(".portfolio-filters");
    filters.innerHTML = "";

    /* Création du bouton "Tous" pour réafficher tout les projets */
    let button = document.createElement('button')
    button.textContent = 'Tous'
    filters.appendChild(button)
    button.addEventListener("click", () => { ProjectContainerInitialization(); });

    /* Création des différents boutons "filtres" */
    PageMetadata.categories.forEach((element) => {
        let button = document.createElement('button');
        button.id = element.id
        button.textContent = element.name
        filters.appendChild(button)
        button.addEventListener('click', () => { LoadProjectsFromCategory(element.id); })
    });  
}


/* Fonction permettant d'afficher ou non l'interface administrateur */
function DoesUserAdmin() {
    if (localStorage.getItem('token') !== null) {
        document.querySelector('#editionMode-notification').style.display = 'flex'
        document.querySelector('.portfolio-filters').style.display = 'none'
        document.querySelector('header').style.marginTop = '70px'

        let openModalWindow = new Event('openModalWindow');

        let editBtn = document.querySelector('#editBtn-portfolio')
        editBtn.style.display = 'flex'
        editBtn.addEventListener('click', () => { window.dispatchEvent(openModalWindow); })
        

        let LogoutBtn = document.querySelector('#loginBtn a')
        LogoutBtn.href = ''
        LogoutBtn.textContent = 'Logout'
        LogoutBtn.addEventListener('click', () => { localStorage.removeItem('token'); location.reload() })
    }
}


/* Fonction permettant d'afficher les projets sur la page en fonction de leurs catégories */
function LoadProjectsFromCategory(categoryID) {
    /* Réinitialisation de la div ayant la classe ".gallery" */
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    /* Création des différents projets ayant un ID spécifique*/
    PageMetadata.works.forEach((element) => {
        if (element.categoryId === categoryID) {
            let figure = document.createElement('figure')
            gallery.appendChild(figure)

            let image = document.createElement('img')
            image.src = element.imageUrl
            image.alt = "Photographie d'une prestation réalisée par Sophie Bluel";

            let figcaption = document.createElement('figcaption')
            figcaption.textContent = element.title

            figure.appendChild(image)
            figure.appendChild(figcaption)
        }
    });
}


/* Fonction permettant d'afficher une petite notification ayant une animation */
export function notification(text, type) {
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
