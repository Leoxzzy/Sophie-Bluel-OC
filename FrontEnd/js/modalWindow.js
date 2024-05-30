
import { PageMetadata, loadPageMetadata, notification } from './home.js';
let ModalWindow = {}
let AddImageMetadata = {}
let canValidPicture = false

window.addEventListener('PageMetadataLoaded', () => {
    /* Déclarations du corp de la fenêtre modale */
    ModalWindow.overlay = document.querySelector('.modalWindow-overlay')
    ModalWindow.dialogWindow = document.querySelector("#modalWindow");
    ModalWindow.overlay.style.display = 'none'
    
    /* Déclarations des différents menus de la fenêtre modale */
    ModalWindow.galleryManagement = document.querySelector('.modalWindow-galleryManagement')
    ModalWindow.addPicture = document.querySelector('.modalWindow-addPicture')
    ModalWindow.galleryManagement.style.display = 'none'
    ModalWindow.addPicture.style.display = 'none'

    /* Déclarations des différents boutons de navigation de la fenêtre modale */
    ModalWindow.returnBtn = document.querySelector('#modalWindow-returnBtn')
    ModalWindow.exitBtn = document.querySelector('#modalWindow-exitBtn')
    ModalWindow.returnBtn.style.visibility = 'hidden'

    /* Déclarations des différents composants concernant le menu d'ajouts de photos */
    ModalWindow.imageInput = document.querySelector('.imageInput')
    ModalWindow.addPictureBtn = document.querySelector('#modalwindow-addPictureBtn')
    ModalWindow.imagePreview = document.querySelector('#addPicture-preview')

    /* Déclarations des différents inputs et bouton concernant l'ajouts de photos */
    ModalWindow.addPictureInput = document.querySelector('#addPicture-fileInput')
    ModalWindow.imageTitle = document.querySelector('#addPicture-Titleinput')
    ModalWindow.imageCategory = document.querySelector('#addPicture-categorieSelect')
    ModalWindow.validPictureBtn = document.querySelector('#modalwindow-validPictureBtn')
    

    /* Ajouts d'événements sur les différents boutons de la fenêtre modale */
    ModalWindow.exitBtn.addEventListener('click', () => { closeModalWindow() })
    ModalWindow.addPictureBtn.addEventListener('click', () => { menuToShow('addPicture') })  
    ModalWindow.returnBtn.addEventListener('click', () => { menuToShow('galleryManagement') })


    /* Ecoute d'un changement sur l'input d'image. Lorsqu'une image est ajoutée, celle-ci obtient une preview. */
    ModalWindow.addPictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        /* Vérification du type de fichier ajouté et de sa taille. Retourne une erreur si incorrect. */
        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') { return notification("Format d'image incorrect!", 'error') }
        if (file.size > 4 * 1024 * 1024) { return notification("Image trop lourde!", 'error') }

        /* Ajout de l'image ajoutée en preview */
        const reader = new FileReader();
        reader.onload = function(event) {
            ModalWindow.imagePreview.src = event.target.result;
            ModalWindow.imagePreview.style.display = 'block';
            ModalWindow.imageInput.style.display = 'none';
            
            AddImageMetadata.image = file
        };
        reader.readAsDataURL(file);
    })

    
    /* Ecoute des différents input de l'ajout d'image */
    ModalWindow.dialogWindow.addEventListener('input', (event) => {
        AddImageMetadata.title = ModalWindow.imageTitle.value
        AddImageMetadata.category = ModalWindow.imageCategory.value

        if (ModalWindow.imageTitle.value !== '' && ModalWindow.imageCategory.value !== '') {
            ModalWindow.validPictureBtn.style.backgroundColor = 'rgba(29, 97, 84, 1)';
            canValidPicture = true

        } else {
            ModalWindow.validPictureBtn.style.backgroundColor = 'rgba(167, 167, 167, 1)';
            canValidPicture = false

        }
    })
    ModalWindow.validPictureBtn.addEventListener('click', (event) => {
        if (canValidPicture) {
            event.preventDefault()
            addPictureToProjets(AddImageMetadata)
        } else {
            notification("Informations manquantes!", 'error')
        } 
    })


    galleryManagementInitialization()
})

window.addEventListener('openModalWindow', () => {
    openModalWindow()
})


/* Mise en place des différents travaux dans la fenêtre modale */
function galleryManagementInitialization() {
    /* Réinitialisation de la div ayant la classe ".galleryManagement-pictures" */
    const gallery = document.querySelector('.galleryManagement-pictures');
    gallery.innerHTML = "";

    /* Création des différents projets */
    PageMetadata.works.forEach((element) => {
        let div = document.createElement('div')
        div.className = 'galleryManagement-picture'
        gallery.appendChild(div)

        let deleteBtn = document.createElement('button')
        let symbole = document.createElement('i')
        symbole.className = 'fa-solid fa-trash-can'
        deleteBtn.appendChild(symbole)

        let image = document.createElement('img')
        image.src = element.imageUrl
        image.alt = "Photographie d'une prestation réalisée par Sophie Bluel";

        div.appendChild(deleteBtn)
        div.appendChild(image)

        deleteBtn.addEventListener('click', (event) => {
            deletePictureFromProjets(element.id)
        })
    });
}


/* Fonction d'ouverture de la fenêtre modale */
function openModalWindow() {
    ModalWindow.overlay.style.display = 'block'
    menuToShow('galleryManagement')
    ModalWindow.dialogWindow.showModal();
}

/* Fonction de fermeture de la fenêtre modale */
function closeModalWindow() {
    ModalWindow.overlay.style.display = 'none'
    ModalWindow.dialogWindow.close();
    menuToShow('galleryManagement')

    AddImageMetadata = {}
    ModalWindow.imageInput.value = ''
    ModalWindow.imageTitle.value = ''
    ModalWindow.imageCategory.value = ''

    ModalWindow.imageInput.style.display = 'flex';
    ModalWindow.imagePreview.style.display = 'none';
}


/* Fonction de gestion de visibilités des menus */
function menuToShow(menu) {
    if (menu === undefined || typeof menu !== 'string') { return console.error('Mauvaise utilisation de la fonction "menuToShow"!') }

    if (menu === 'galleryManagement') {
        ModalWindow.galleryManagement.style.display = 'flex'
        ModalWindow.returnBtn.style.visibility = 'hidden'
        ModalWindow.addPicture.style.display = 'none'

    } else if (menu === 'addPicture') {
        ModalWindow.galleryManagement.style.display = 'none'
        ModalWindow.returnBtn.style.visibility = 'visible'
        ModalWindow.addPicture.style.display = 'flex'

    } else {
        console.error('Mauvais nom de menu appelé à la fonction "menuToShow"!')
    }
}


/* Fonction d'ajouts d'image aux projets */
function addPictureToProjets(data) {
    let formData = new FormData();
    formData.append('image', data.image)
    formData.append('title', data.title)
    formData.append('category', data.category)

    let params = {
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token')},
        body: formData
    }

    fetch('http://localhost:5678/api/works', params)
        .then((response) => {
            console.log(response)
            loadPageMetadata(false)
            setTimeout(() => {
                galleryManagementInitialization()
                closeModalWindow()
                notification('Photo bien ajoutée aux projets!', 'success')
            }, 1000);
        })
        .catch((error) => {
            console.log(error)
        })
}

/* Fonction de suppressions d'image aux projets */
function deletePictureFromProjets(pictureID) {
    let params = {
        method: "DELETE",
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token')},
    }

    fetch(`http://localhost:5678/api/works/${pictureID}`, params)
        .then((response) => {
            console.log(response)
            loadPageMetadata(false)
            setTimeout(() => {
                galleryManagementInitialization()
                notification('Photo bien supprimée des projets!', 'success')
            }, 1000);
        })
        .catch((error) => {
            console.log(error)
        })
}



