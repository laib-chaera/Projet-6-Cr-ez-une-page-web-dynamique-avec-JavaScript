// I) POUR LA PAGE D'ACCUEIL NON CONNECTE

const worksApi = 'http://localhost:5678/api/works'
const categoriesApi = 'http://localhost:5678/api/categories'

const galleryContainer = document.querySelector('.gallery')
const filtersContainer = document.querySelector('.filters')

async function getWorks() {
    try {
        const responseJson = await fetch(worksApi)
        return await responseJson.json()
    } catch (error) {
        console.error(error)
    }
}

let allWorks = []

async function displayWork() {
    allWorks = await getWorks()
    galleryContainer.innerHTML = ''
    allWorks.forEach((work) => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        img.src = work.imageUrl
        img.id = work.id
        figcaption.textContent = work.title
        img.alt = figcaption.textContent

        figure.appendChild(img)
        figure.appendChild(figcaption)
        galleryContainer.appendChild(figure)
    })
}
displayWork()

async function getCategories() {
    try {
        const categoriesJson = await fetch(categoriesApi)
        return await categoriesJson.json()
    } catch (error) {
        console.error(error)
    }
}

let allCategories = []

async function displayCategories() {
    allCategories = await getCategories()
    allCategories.forEach((category) => {
        const btn = document.createElement('button')
        btn.textContent = category.name.toUpperCase()
        btn.id = category.id
        filtersContainer.appendChild(btn)

        if (btn) {
            btn.addEventListener('click', () => {
                filterWorksByCategory(btn.id)
            })
        }
    })
}
displayCategories()

async function filterWorksByCategory(buttonId) {
    let filteredWorks = allWorks.filter(
        (work) => work.categoryId.toString() === buttonId.toString()
    )
    galleryContainer.innerHTML = ''
    filteredWorks.forEach((work) => {
        const figure = document.createElement('figure')
        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')
        img.src = work.imageUrl
        figcaption.textContent = work.title
        img.alt = figcaption.textContent

        figure.appendChild(img)
        figure.appendChild(figcaption)
        galleryContainer.appendChild(figure)
    })
}

function creatBtnAll() {
    const allBtn = document.createElement('button')
    allBtn.setAttribute('data-id', '0')
    allBtn.textContent = 'Tous'
    filtersContainer.appendChild(allBtn)

    if (allBtn) {
        allBtn.addEventListener('click', () => {
            if (allWorks.length > 0) {
                galleryContainer.innerHTML = ''
                allWorks.forEach((work) => {
                    const figure = document.createElement('figure')
                    const img = document.createElement('img')
                    const figcaption = document.createElement('figcaption')
                    img.src = work.imageUrl
                    img.id = work.id
                    figcaption.textContent = work.title
                    img.alt = figcaption.textContent

                    figure.appendChild(img)
                    figure.appendChild(figcaption)
                    galleryContainer.appendChild(figure)
                })
            } else {
                displayWork()
            }
        })
    }
}
creatBtnAll()

// II) PAGE UTILISATEUR CONNECTER

const userToken = localStorage.getItem('token')

const loginButton = document.getElementById('loginNav')
const iconModify = document.querySelector('.iconModify')
const modeEdition = document.querySelector('.modeEdition')

if (userToken) {
    loginButton.innerText = 'logout'
    iconModify.style = 'visibility:visible'
    filtersContainer.style.display = 'none'
    modeEdition.style.display = 'flex'
}

if (loginButton) {
    loginButton.addEventListener('click', function () {
        localStorage.removeItem('token')
        window.location.href = 'index.html'
    })
}

// GESTION DES MODALES POUR L'AJOUT ET LA SUPPRESSION DES TRAVAUX

let modal = document.querySelector('.modal-container')

iconModify.addEventListener('click', () => {
    modal.style.display = null
    displayWorksModal(allWorks)
})

function displayWorksModal(allWorksData) {
    const containerWorksModal1 = document.getElementById('works-modal')
    containerWorksModal1.innerHTML = ''

    if (Array.isArray(allWorksData)) {
        allWorksData.forEach((work) => {
            const figure = document.createElement('figure')
            const img = document.createElement('img')
            const iconTrash = document.createElement('i')
            const divTrash = document.createElement('div')

            img.src = work.imageUrl
            img.setAttribute('data-id', work.id)

            iconTrash.classList.add('fa', 'fa-trash-can')
            iconTrash.setAttribute('data-id', work.id)
            divTrash.classList.add('divTrash')
            divTrash.setAttribute('data-id', work.id)
            figure.classList.add('figureParent')
            figure.setAttribute('data-id', work.id)

            divTrash.appendChild(iconTrash)
            figure.appendChild(img)
            figure.appendChild(divTrash)
            containerWorksModal1.appendChild(figure)

            iconTrash.addEventListener('click', async function () {
                const workId = this.getAttribute('data-id')
                const userConfirmed = confirm(
                    'Voulez-vous vraiment supprimer ce projet ?'
                )
                if (userConfirmed) {
                    await deleteWorks(workId)
                }
            })
        })
    }
}

async function deleteWorks(workId) {
    try {
        const authToken = localStorage.getItem('token')
        const response = await fetch(`${worksApi}/${workId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })

        if (response.ok) {
            document.getElementById(workId).parentNode.remove(workId)
            const deleteWorkModal = document.querySelector(
                `#works-modal [data-id="${workId}"]`
            )
            if (deleteWorkModal) {
                deleteWorkModal.parentNode.removeChild(deleteWorkModal)
            }
            allWorks = allWorks.filter((work) => work.id !== parseInt(workId)) // Update allWorks array
        } else {
            alert("Erreur lors de la suppression de l'élement.")
        }
    } catch (error) {
        console.error('Erreur lors de la suppression :', error)
    }
}

function closeModal1() {
    const closeModalButton = document.querySelector('.close-modal-button')
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none'
    })

    modal.addEventListener('click', function () {
        modal.style.display = 'none'
    })

    const windowModal1 = document.querySelector('.window-modal')
    windowModal1.addEventListener('click', function (event) {
        event.stopPropagation()
    })
}
closeModal1()

const btnAddModal1 = document.getElementById('add-picture')
btnAddModal1.addEventListener('click', function () {
    displayMoadal2()
    form.reset()
    initInputFile()
    generateCategoryOptions()
})

function displayMoadal2() {
    const modal1 = document.getElementById('modal1')
    modal1.style.display = 'none'
    const modal2 = document.querySelector('.modal-container2')
    modal2.style.display = 'flex'
}

function initInputFile() {
    const inputFile = document.getElementById('plusAjoutPhoto')
    inputFile.value = ''
    const imagePreview = document.getElementById('imagePreview')
    imagePreview.style.display = 'none'
    imagePreview.src = ''

    const ajoutPhoto = document.getElementById('ajoutPhotoSpace')
    ajoutPhoto.style.display = 'flex'
}

function closeModal2() {
    const closeModal2Button = document.querySelector('.close-modal2-button')
    closeModal2Button.addEventListener('click', function () {
        const modal2 = document.querySelector('.modal-container2')
        modal2.style.display = 'none'
    })

    const modal2 = document.getElementById('modal2')
    modal2.addEventListener('click', function () {
        modal2.style.display = 'none'
    })
    const windowModal2 = document.querySelector('.window-modal2')
    windowModal2.addEventListener('click', function (event) {
        event.stopPropagation()
    })
}
closeModal2()

const arrowLeft = document.querySelector('.arrow-left')
arrowLeft.addEventListener('click', function () {
    displayModal1()
})

function displayModal1() {
    modal.style.display = 'flex'
    const modal2 = document.querySelector('.modal-container2')
    modal2.style.display = 'none'
}

// FORMULAIRE: ENVOYER UNE IMAGE AU SERVEUR DEPUIS UN FORMULAIRE VIA LA MODALE 2

// Création des options "select " pour générer une liste déroulante des catégories
async function generateCategoryOptions() {
    let categorySelect = document.getElementById('selectOptions')
    categorySelect.innerHTML = ''
    // Parcours la liste des catégories et créer une option pour chaque catégorie
    allCategories.forEach((category) => {
        const option = document.createElement('option')
        option.value = category.id
        option.textContent = category.name
        categorySelect.appendChild(option)
    })
}

// Fonction pour ajouter un fichier (image) dans le formulaire modale 2
function addFileImg() {
    const inputFile = document.getElementById('plusAjoutPhoto')
    const imagePreview = document.getElementById('imagePreview')

    inputFile.addEventListener('change', () => {
        const file = inputFile.files[0]

        if (file) {
            // Créer un URL pour l'image sélectionné
            const imageUrl = URL.createObjectURL(file)
            //// Définissez l'URL comme source de l'élément img pour afficher l'image
            imagePreview.src = imageUrl
            imagePreview.style.display = 'block' // afficher l'élément img avec le src

            const ajoutPhoto = document.getElementById('ajoutPhotoSpace')
            ajoutPhoto.style.display = 'none'
        }
    })
}
addFileImg()

// PREPARATION DU FORMULAIRE POUR L'ENVOI d'un projet

// Ajout d'une image dans DOM et dans la modale 1 après soumission du formulaire

const form = document.getElementById('form-add-picture')
form.addEventListener('submit', async function (event) {
    event.preventDefault()

    //Récupération des valeurs saisie dans les inputs du formulaire
    const title = document.getElementById('title').value
    const categoryId = document.getElementById('selectOptions').value
    const inputFile = document.getElementById('plusAjoutPhoto')
    const imageFile = inputFile.files[0] //récupère le fichier (image)

    //Vérifier s'il y a bien des valeurs retournées pour les champs si non, retourner une erreur
    if (!title || !categoryId || !imageFile) {
        // Affichage d'un message d'erreur
        alert('Veuillez remplir tous les champs du formulaire.')
        return
    }
    //si pas d'erreur, créer un objet FormData
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', categoryId)
    formData.append('image', imageFile)

    //Récupérer le token pour s'identifier
    const authToken = localStorage.getItem('token')

    //Envoie du formData au serveur
    try {
        const response = await fetch(worksApi, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })

        if (!response.ok) {
            throw new Error(
                "La réponse du serveur indique un échec lors de l'ajout de l'image."
            )
        } else {
            let resultwork = await response.json()
            allWorks.push(resultwork) //mettre à jour le tableau, il contien l'image ajoutée uniquement
            // Création et ajout d'un work dans la galerie sans recharger la page
            const figure = document.createElement('figure')
            const img = document.createElement('img')
            const figcaption = document.createElement('figcaption')
            img.src = resultwork.imageUrl
            img.id = resultwork.id
            figcaption.textContent = resultwork.title
            img.alt = figcaption.textContent

            figure.appendChild(img)
            figure.appendChild(figcaption)
            galleryContainer.appendChild(figure)

            // Création d'un work dans la modale sans recharger la page
            const figureModal = document.createElement('figure')
            const imgModal = document.createElement('img')
            const iconTrash = document.createElement('i')
            const divTrash = document.createElement('div')

            // Configuration de l'image
            imgModal.src = resultwork.imageUrl
            imgModal.setAttribute('data-id', resultwork.id)

            // Configuration de l'icône de suppression
            iconTrash.classList.add('fa', 'fa-trash-can') // Ajouter les classes FontAwesome
            iconTrash.setAttribute('data-id', resultwork.id)
            divTrash.classList.add('divTrash')
            divTrash.setAttribute('data-id', resultwork.id)
            figureModal.classList.add('figureParent')
            figureModal.setAttribute('data-id', resultwork.id)

            // Ajout du work dans la modale
            const containerWorks = document.getElementById('works-modal')
            figureModal.appendChild(imgModal)
            figureModal.appendChild(divTrash)
            divTrash.appendChild(iconTrash)
            containerWorks.appendChild(figureModal)

            iconTrash.addEventListener('click', async function () {
                const allworkId = this.getAttribute('data-id')

                //Demander confirmation avant d'envoyer la requête DELETE
                const userConfirmed = confirm(
                    'Voulez-vous vraiment supprimer ce projet ?'
                )
                if (userConfirmed) {
                    deleteWorks(allworkId)
                }
            })
        }
    } catch (error) {
        console.log(error, 'erreur')
    }

    displayModal1()
})
