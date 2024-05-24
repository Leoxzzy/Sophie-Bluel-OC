
import { PageMetadata } from './home.js';
let ModalWindow = {}
let AddImageMetadata = {}

window.addEventListener('PageMetadataLoaded', () => {
    ModalWindow.overlay = document.querySelector('.modalWindow-overlay')
    ModalWindow.dialogWindow = document.querySelector("#modalWindow");
    ModalWindow.overlay.style.display = 'none'

    ModalWindow.galleryManagement = document.querySelector('.modalWindow-galleryManagement')
    ModalWindow.addPicture = document.querySelector('.modalWindow-addPicture')
    ModalWindow.galleryManagement.style.display = 'none'
    ModalWindow.addPicture.style.display = 'none'

    ModalWindow.returnBtn = document.querySelector('#modalWindow-returnBtn')
    ModalWindow.exitBtn = document.querySelector('#modalWindow-exitBtn')
    ModalWindow.returnBtn.style.visibility = 'hidden'

    ModalWindow.addPictureBtn = document.querySelector('#modalwindow-addPictureBtn')
    ModalWindow.addPictureInput = document.querySelector('#addPicture-fileInput')
    ModalWindow.validPictureBtn = document.querySelector('#modalwindow-validPictureBtn')

    ModalWindow.imageInput = document.querySelector('.imageInput')
    ModalWindow.imagePreview = document.querySelector('#addPicture-preview')
    ModalWindow.imageTitle = document.querySelector('#addPicture-Titleinput')
    ModalWindow.imageCategorie = document.querySelector('#addPicture-categorieSelect')


    ModalWindow.exitBtn.addEventListener('click', () => { CloseModalWindow() })
    ModalWindow.addPictureBtn.addEventListener('click', () => { MenuToShow('addPicture') })  
    ModalWindow.returnBtn.addEventListener('click', () => { MenuToShow('galleryManagement') })



    ModalWindow.addPictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file.type.startsWith('image/')) { return alert('Non'); }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            ModalWindow.imagePreview.src = event.target.result;
            ModalWindow.imagePreview.style.display = 'block';
            ModalWindow.imageInput.style.display = 'none'
            
            AddImageMetadata.image = file
        };
        reader.readAsDataURL(file);
    })


    ModalWindow.validPictureBtn.addEventListener('click', () => {
        AddImageMetadata.title = ModalWindow.imageTitle.value
        AddImageMetadata.category = ModalWindow.imageCategorie.value

        if (AddImageMetadata.image === undefined || AddImageMetadata.title === '' || AddImageMetadata.Categorie === '') { alert('ERROR') }
        AddPictureToProjets(AddImageMetadata)
    })

    /* OpenModalWindow() */
    GalleryManagementInitialization()
})


window.addEventListener('coucou', () => {
    OpenModalWindow()
})


function GalleryManagementInitialization() {
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

        deleteBtn.addEventListener('click', () => {
            DeletePictureFromProjets(element.id)
        })
    });
}



function OpenModalWindow() {
    ModalWindow.overlay.style.display = 'block'
    MenuToShow('galleryManagement')
    ModalWindow.dialogWindow.showModal();
}

function MenuToShow(menu) {
    if (menu === undefined || typeof menu !== 'string') { return console.error('Mauvaise utilisation de la fonction "MenuToShow"!') }

    if (menu === 'galleryManagement') {
        ModalWindow.galleryManagement.style.display = 'flex'
        ModalWindow.returnBtn.style.visibility = 'hidden'
        ModalWindow.addPicture.style.display = 'none'

    } else if (menu === 'addPicture') {
        ModalWindow.galleryManagement.style.display = 'none'
        ModalWindow.returnBtn.style.visibility = 'visible'
        ModalWindow.addPicture.style.display = 'flex'

    } else {
        console.error('Mauvais nom de menu appelé à la fonction "MenuToShow"!')
    }
}

function CloseModalWindow() {
    ModalWindow.overlay.style.display = 'none'
    ModalWindow.dialogWindow.close();
    MenuToShow('galleryManagement')

    AddImageMetadata = {}
    ModalWindow.imageInput.value = ''
    ModalWindow.imageTitle.value = ''
    ModalWindow.imageCategorie.value = ''
}



function AddPictureToProjets(data) {
    let formData = new FormData();
    formData.append('image', data.image)
    formData.append('title', data.title)
    formData.append('category', data.category)

    let params = {
        method: "POST",
        headers: { 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNjUxMzY2NywiZXhwIjoxNzE2NjAwMDY3fQ.mGy_5mieYkQvX0lHNOmzS5X-32nTdeFhpiTkDjR3IGI` },
        body: formData
    }

    fetch('http://localhost:5678/api/works', params)
        .then((response) => {
            console.log(response)
            location.reload();
        })
        .catch((error) => {
            console.log(error)
        })
}

function DeletePictureFromProjets(pictureID) {
    console.log(pictureID)

    let params = {
        method: "DELETE",
        headers: { 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNjUxMzY2NywiZXhwIjoxNzE2NjAwMDY3fQ.mGy_5mieYkQvX0lHNOmzS5X-32nTdeFhpiTkDjR3IGI` },
    }
    fetch(`http://localhost:5678/api/works/${pictureID}`, params)
        .then((response) => {
            console.log(response)
            location.reload();
        })
        .catch((error) => {
            console.log(error)
        })
}



