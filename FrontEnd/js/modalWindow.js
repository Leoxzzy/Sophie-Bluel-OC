
import { PageData, loadPageData, notification } from './index.js';
let modalWindow = {}
let addImageMetadata = {}

window.addEventListener('pageDataLoaded', () => {
    /* Déclarations du corp de la fenêtre modale. */
    modalWindow.overlay = document.querySelector('.modalWindow-overlay')
    modalWindow.dialogWindow = document.querySelector("#modalWindow");
    modalWindow.overlay.style.display = 'none'
    
    /* Déclarations des différents menus de la fenêtre modale. */
    modalWindow.galleryManagement = document.querySelector('.modalWindow-galleryManagement')
    modalWindow.addPicture = document.querySelector('.modalWindow-addPicture')
    modalWindow.galleryManagement.style.display = 'none'
    modalWindow.addPicture.style.display = 'none'

    /* Déclarations des différents boutons de navigation de la fenêtre modale. */
    modalWindow.returnBtn = document.querySelector('#modalWindow-returnBtn')
    modalWindow.exitBtn = document.querySelector('#modalWindow-exitBtn')
    modalWindow.returnBtn.style.visibility = 'hidden'

    /* Déclarations des différents composants concernant le menu d'ajouts de photos. */
    modalWindow.addPictureForm = document.getElementById('addPicture-form')
    modalWindow.imageInput = document.querySelector('.imageInput')
    modalWindow.addPictureBtn = document.querySelector('#modalwindow-addPictureBtn')
    modalWindow.imagePreview = document.querySelector('#addPicture-preview')

    /* Déclarations des différents inputs et bouton concernant l'ajouts de photos. */
    modalWindow.addPictureInput = document.querySelector('#addPicture-fileInput')
    modalWindow.imageTitle = document.querySelector('#addPicture-Titleinput')
    modalWindow.imageCategory = document.querySelector('#addPicture-categorieSelect')
    modalWindow.validPictureBtn = document.querySelector('#modalwindow-validPictureBtn')
    

    /* Ajouts d'événements sur les différents boutons de la fenêtre modale. */
    modalWindow.exitBtn.addEventListener('click', () => { closeModalWindow() })
    modalWindow.addPictureBtn.addEventListener('click', () => { menuToShow('addPicture') })  
    modalWindow.returnBtn.addEventListener('click', () => { menuToShow('galleryManagement') })


    /* Ecoute d'un changement sur l'input d'image. Lorsqu'une image est ajoutée, celle-ci obtient une preview. */
    modalWindow.addPictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        /* Vérification du type de fichier ajouté et de sa taille. Retourne une erreur si incorrect. */
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') { return notification("Format d'image incorrect!", 'error') }
        if (file.size > 4 * 1024 * 1024) { return notification("Image trop lourde!", 'error') }

        /* Ajout de l'image ajoutée en preview */
        const reader = new FileReader();
        reader.onload = function(event) {
            modalWindow.imagePreview.setAttribute('src', event.target.result)
            modalWindow.imagePreview.style.display = 'block';
            modalWindow.imageInput.style.display = 'none';
            
            addImageMetadata.image = file
        };
        reader.readAsDataURL(file);
    })


    /* Ecoute des différents input de l'ajout d'image */
    modalWindow.dialogWindow.addEventListener('input', (event) => {
        addImageMetadata.title = modalWindow.imageTitle.value
        addImageMetadata.category = modalWindow.imageCategory.value

        if (modalWindow.imageTitle.value !== '' && modalWindow.imageCategory.value !== '') {
            modalWindow.validPictureBtn.style.backgroundColor = 'rgba(29, 97, 84, 1)';
        } else {
            modalWindow.validPictureBtn.style.backgroundColor = 'rgba(167, 167, 167, 1)';
        }
    })
    modalWindow.addPictureForm.addEventListener('submit', (event) => {
        event.preventDefault()
        addPictureToProjets(addImageMetadata)
    })


    galleryManagementInitialization()
})




/* Initialisation du conteneur de gestion de projets. */
function galleryManagementInitialization() {
    const gallery = document.querySelector('.galleryManagement-pictures');
    gallery.innerHTML = "";

    /* Création des différents projets */
    PageData.works.forEach((element) => {
        let div = document.createElement('div')
        div.setAttribute('class', 'galleryManagement-picture')

        let deleteBtn = document.createElement('button')
        let symbole = document.createElement('i')
        symbole.setAttribute('class', 'fa-solid fa-trash-can')
        deleteBtn.appendChild(symbole)

        
        let image = document.createElement('img')
        image.setAttribute('src', element.imageUrl)
        image.setAttribute('alt', "Photographie d'une prestation réalisée par Sophie Bluel")

        div.appendChild(deleteBtn)
        div.appendChild(image)
        gallery.appendChild(div)

        deleteBtn.addEventListener('click', () => { deletePictureFromProjets(element.id) })
    });
}


/* Fonction de gestion de visibilités des menus */
function menuToShow(menu) {
    if (typeof menu !== 'string') { return console.error('Mauvaise utilisation de la fonction "menuToShow"!') }

    if (menu === 'galleryManagement') {
        modalWindow.galleryManagement.style.display = 'flex'
        modalWindow.returnBtn.style.visibility = 'hidden'
        modalWindow.addPicture.style.display = 'none'

    } else if (menu === 'addPicture') {
        modalWindow.galleryManagement.style.display = 'none'
        modalWindow.returnBtn.style.visibility = 'visible'
        modalWindow.addPicture.style.display = 'flex'

    } else {
        console.error('Mauvais nom de menu appelé à la fonction "menuToShow"!')
    }
}



/* Fonction / Event d'ouverture de la fenêtre modale */
function openModalWindow() {
    modalWindow.overlay.style.display = 'block'
    menuToShow('galleryManagement')
    modalWindow.dialogWindow.showModal();
}
window.addEventListener('openModalWindow', () => {
    openModalWindow()
})


/* Fonction de fermeture de la fenêtre modale */
function closeModalWindow() {
    modalWindow.overlay.style.display = 'none'
    modalWindow.dialogWindow.close();
    menuToShow('galleryManagement')

    addImageMetadata = {}
    modalWindow.imageInput.value = ''
    modalWindow.imageTitle.value = ''
    modalWindow.imageCategory.value = ''

    modalWindow.imageInput.style.display = 'flex';
    modalWindow.imagePreview.style.display = 'none';
}



/* Fonction d'ajout de projet */
async function addPictureToProjets(data) {
    let formData = new FormData();
    formData.append('image', data.image)
    formData.append('title', data.title)
    formData.append('category', data.category)

    let params = {
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token')},
        body: formData
    }

    try {
        await fetch(`http://localhost:5678/api/works`, params)
        await loadPageData(false)
        galleryManagementInitialization()
        closeModalWindow()
        notification('Photo bien ajoutée aux projets!', 'success')
    } catch(error) {
        console.error(error)
    }
}

/* Fonction de suppression de projet */
async function deletePictureFromProjets(pictureID) {
    let params = {
        method: "DELETE",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token')},
    }

    try {
        await fetch(`http://localhost:5678/api/works/${pictureID}`, params)
        await loadPageData(false)
        galleryManagementInitialization()
        notification('Photo bien supprimée des projets!', 'success')

    } catch(error) {
        console.error(error)
    }
}