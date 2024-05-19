window.addEventListener('load', () => {
    let myDialog = document.querySelector("#modalWindow");
    /* myDialog.showModal(); */
    ModalWindowInitialization()
})


function CloseModalWindow() {
}

function OpenModalWindow() {
}

function ModalWindowInitialization() {
    let mwCloseButton = document.querySelector('#modalWindow-closeBtn')
    let mwReturnButton = document.querySelector('#modalWindow-returnBtn')
    
    mwCloseButton.addEventListener('click', () => {
        let mw = document.querySelector("#modalWindow")
        mw.close()
        document.querySelector('.modalWindow-overlay').style.display = 'none'
    })
}