export let PageMetadata = {}

window.addEventListener("load", () => {
    document.querySelector('#editBtn-portfolio').style.display = 'none'
    loadPageMetadata()
    DoesUserAdmin()
});


async function loadPageMetadata() {    
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
            const event = new Event('PageMetadataLoaded');
            window.dispatchEvent(event);

            ProjectContainerInitialization()
            ProjectFiltersInitialization()
        })
}


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

function DoesUserAdmin() {
    if (localStorage.getItem('token') !== null) {
        document.querySelector('#editionMode-notification').style.display = 'flex'
        document.querySelector('.portfolio-filters').style.display = 'none'

        let coucou = new Event('coucou');

        let editBtn = document.querySelector('#editBtn-portfolio')
        editBtn.style.display = 'flex'
        editBtn.addEventListener('click', () => { window.dispatchEvent(coucou); })
        

        let LogoutBtn = document.querySelector('#loginBtn')
        LogoutBtn.textContent = 'Logout'
        LogoutBtn.addEventListener('click', () => { localStorage.removeItem('token'); location.reload() })
    }
}

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
