export let PageMetadata = {}


/* Fonction permettant de demander et de récupérer des éléments depuis l'API. */
export async function loadPageData(triggerEvent) {    
    const works = await fetch('http://localhost:5678/api/works')
    const worksData = await works.json()
    PageMetadata.works = worksData

    const categories = await fetch('http://localhost:5678/api/categories')
    const categoriesData = await categories.json()
    PageMetadata.categories = categoriesData

    /* Appel de l'event "pageDataLoaded" pour initialiser la fenêtre modale avec tous les éléments de la page. */
    if (triggerEvent) {
        const event = new Event('pageDataLoaded');
        window.dispatchEvent(event);
    }

    /* Initialisation des filtres de catégories et du conteneur de projets. */
    projectContainerInitialization()
    projectFiltersInitialization()
}


/* Fonction permettant la mise en place du conteneur de projets. */
function projectContainerInitialization() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    /* Création et intégration des projets dans le conteneur. */
    PageMetadata.works.forEach((element) => {
        let project = createProjetElement(element)
        gallery.appendChild(project)
    });
}

/* Fonction permettant d'afficher les projets sur la page en fonction de leurs catégories. */
function loadProjectsFromCategory(categoryID) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    /* Création et intégration des projets ayant un certain "categoryID" dans le conteneur de projets. */
    let filteredWorks = PageMetadata.works.filter(element => element.categoryId === categoryID)
    filteredWorks.forEach((element) => {
        let project = createProjetElement(element)
        gallery.appendChild(project)
    })
}

/* Fonction permettant la création d'un élément de projet. */
function createProjetElement(data) {
    if (typeof data.title !== 'string' || typeof data.imageUrl !== 'string') { return console.error('Mauvaise utilisation de la fonction "createProjetElement"!') }

    let figure = document.createElement('figure')
    
    let image = document.createElement('img')
    image.setAttribute('src', data.imageUrl)
    image.setAttribute('alt', "Photographie d'une prestation réalisée par Sophie Bluel")
    
    let figcaption = document.createElement('figcaption')
    figcaption.textContent = data.title
    
    figure.appendChild(image)
    figure.appendChild(figcaption)

    return figure
}



/* Fonction permettant la mise en place des filtres de catégories. */
function projectFiltersInitialization() {
    const filters = document.querySelector(".portfolio-filters");
    filters.innerHTML = "";

    /* Création du bouton "Tous" pour afficher tout les projets. */
    let filter = createFilterElement('Tous', projectContainerInitialization)
    filters.appendChild(filter)

    /* Création des différents boutons de filtres de catégories. */
    PageMetadata.categories.forEach((element) => {
        let filter = createFilterElement(element.name, loadProjectsFromCategory, element.id)
        filters.appendChild(filter)
    });  
}

/* Fonction de création de filtres de catégorie */
function createFilterElement(textContent, callback, callbackArg) {
    let button = document.createElement('button')
    button.textContent = textContent
    button.addEventListener("click", () => { callback(callbackArg); });

    return button
}



/* Fonction modifiant l'affichage en fonction de l'item "Token". */
function doesUserAdmin() {
    if (localStorage.getItem('token') === null) { return } /* Vérification de la présence du token. */

    /* Modification du style de la page afin de faire apparaitre les éléments administratifs. */
    document.querySelector('#editionMode-notification').style.display = 'flex'
    document.querySelector('header').style.marginTop = '70px'
    document.querySelector('.portfolio-filters').style.display = 'none'

    
    /* Modification & Création de l'event du bouton permettant d'ouvrir la fenêtre modal. */
    let editBtn = document.querySelector('#editBtn-portfolio')
    editBtn.style.display = 'flex'

    let openModalWindow = new Event('openModalWindow');
    editBtn.addEventListener('click', () => {
        window.dispatchEvent(openModalWindow);
    })

    /* Modification du bouton "Login" afin d'utiliser celui-ci entant que "Logout". */
    let LogoutBtn = document.querySelector('#loginBtn a')
    LogoutBtn.setAttribute('href', '')
    LogoutBtn.textContent = 'Logout'

    LogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
    })
}



/* Fonction permettant d'afficher une petite notification ayant une animation. */
export function notification(text, type) {
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



window.addEventListener("load", () => {
    document.querySelector('#editBtn-portfolio').style.display = 'none'
    loadPageData(true)
    doesUserAdmin()
});