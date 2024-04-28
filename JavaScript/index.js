// I) POUR LA PAGE D'ACCUEIL NON CONNECTE 

//Récupérer les travaux depuis une API avec l'URL de la route du backend
const worksApi = "http://localhost:5678/api/works" 
const categoriesApi = "http://localhost:5678/api/categories"

//Sélectionne l'élément là où les travaux et gatégories seront affichés dans le DOM
const galleryContainer = document.querySelector(".gallery")
const filtersContainer = document.querySelector(".filters")

console.log(galleryContainer)
console.log(filtersContainer)
//fonction asynchrone pour récupérer les travaux depuis l'API (envoyer une requête à l'URL de l'API avec fetch(URL))
async function getWorks() { 
   try{
    const responseJson = await fetch(worksApi)  
      return await responseJson.json() 
    }  
    catch   (error) { 
            console.error(error)
    } 
}

let allWorks = []
    //Créer dynamiquement les éléments HTML (les travaux ) et les afficher sur la page web.
    async function displayWork() { 
        allWorks = await getWorks()
        console.log(allWorks)

        galleryContainer.innerHTML = '' 
        
        allWorks.forEach((work) => {//Parcourt chaque objet dans le tableau (les données récupérées.) pour créer les éléments
                const figure = document.createElement("figure")
                const img = document.createElement("img")
                const figcaption = document.createElement("figcaption")
                
                img.src = work.imageUrl
                img.id = work.id
                figcaption.textContent = work.title
                img.alt = figcaption.textContent

                // Assemblage des éléments et ajout à la galerie
                figure.appendChild(img)
                figure.appendChild(figcaption)
                galleryContainer.appendChild(figure)
        }) 
        
    }
   
    displayWork()

//AJOUTER LES FILTRES POUR AFFICHER LES TRAVAUX PAR CATÉGORIE

//fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
   try{
      const categoriesJson = await fetch(categoriesApi)    
        return await categoriesJson.json()
    }   
    catch   (error) {
            console.error(error)
    }  
}

let allCategories =[]
// Fonction asynchrone pour créer dynamiquement les boutons de catégorie
    async function displayCategories() {
      allCategories = await getCategories()
        
        // Création d'un bouton pour chaque catégorie récupérée
        allCategories.forEach((category) =>{
            const btn = document.createElement("button")
            btn.textContent = category.name.toUpperCase()
            btn.id = category.id
            filtersContainer.appendChild(btn)

            // Ajout d'un écouteur d'événement sur le bouton pour filtrer
            if (btn) {
              btn.addEventListener("click", () => {
                  filterWorksByCategory(btn.id)
                            
              })
              console.log(btn)
              console.log(filterWorksByCategory)  
            }
        })   
    }
    displayCategories()


//Fonction pour filtrer les travaux par catégorie avec filter()
      async function filterWorksByCategory(buttonId) {
        
          let filteredWorks;
          filteredWorks = allWorks.filter(work => work.categoryId.toString() === buttonId.toString()) // récupère la valeur des id catégorie qui sont égale à la valeur des id btn 
          
          galleryContainer.innerHTML = '' // vide le conteneur galleryContainer avant l'affichage des résultats filtrés
          
          // Création et affichage dynamique des travaux filtrés
          filteredWorks.forEach((work) => {
              const figure = document.createElement("figure")
              const img = document.createElement("img")
              const figcaption = document.createElement("figcaption")
            
              img.src = work.imageUrl
              figcaption.textContent = work.title
              img.alt = figcaption.textContent

              figure.appendChild(img)
              figure.appendChild(figcaption)
              galleryContainer.appendChild(figure)
          })
      }

// Création du bouton "Tous" pour afficher tous les travaux

function creatBtnAll() { 
  const allBtn = document.createElement("button");
  allBtn.setAttribute("data-id", "0");
  allBtn.textContent = "Tous";
  filtersContainer.appendChild(allBtn);

  // Ajouter l'événement click sur le bouton "Tous"
  if (allBtn) {
      allBtn.addEventListener('click', () => { 
          // Vérifier si le tableau allWorks contient des éléments avant d'exécuter le code 
          if (allWorks.length > 0) {
              // Utiliser directement les travaux déjà récupérés
              galleryContainer.innerHTML = '' 
              allWorks.forEach((work) => {
                  const figure = document.createElement("figure")
                  const img = document.createElement("img")
                  const figcaption = document.createElement("figcaption")
                  
                  img.src = work.imageUrl
                  img.id = work.id
                  figcaption.textContent = work.title
                  img.alt = figcaption.textContent

                  figure.appendChild(img)
                  figure.appendChild(figcaption)
                  galleryContainer.appendChild(figure)
              });
          } else {
              // Si les travaux ne sont pas encore récupérés, alors les récupérer et afficher
              displayWork();
          }
      });
  }
}
creatBtnAll()



//  II) PAGE UTILISATEUR CONNECTER

// Récupération du token d'authentification 
    const userToken=localStorage.getItem('token') 
    
//Condition pour afficher/masquer certains éléments qand connecté
    const loginButton = document.getElementById("loginNav")
    const iconModify = document.querySelector(".iconModify")
    const modeEdition = document.querySelector(".modeEdition")

    if (userToken) {
        loginButton.innerText = "logout"
        iconModify.style="visibility:visible"
        filtersContainer.style.display="none"
        modeEdition.style.display='flex'
        
     } 
    
//Déconnexion
    if (loginButton) {
          loginButton.addEventListener('click', function(){
          localStorage.removeItem('token')
          window.location.href = 'index.html'

      })
      
    }
      



// GESTION DES MODALES POUR L'AJOUT ET LA SUPPRESSION DES TRAVAUX

//MODALE 1 QUI AFFICHE LES TRAVAUX
        let modal = document.querySelector('.modal-container')

        iconModify.addEventListener('click', () => {
            modal.style.display = null //affiche la modale 1
            displayWorksModal(allWorks) //  les données contenues dans allWorks sont passées au paramètre allWorksData.
            console.log(allWorks)
           
        })

        let modalOpened = false; // Ajoutez cette variable pour suivre l'état de la modale
    
    // iconModify.addEventListener('click', () => {
    //     modal.style.display = null; // Affiche la modale 1
    //     if (!modalOpened) {
    //         displayWorksModal(allWorks); // Appelle la fonction pour charger le contenu de la modale seulement si elle n'a pas été ouverte précédemment
    //         modalOpened = true; // Marque la modale comme ouverte
    //     }
    // });

//fonction asynchrone pour récupérer et afficher les works dans la modal 1
    function displayWorksModal(allWorksData) {
        
        const containerWorksModal1 = document.getElementById("works-modal")
        containerWorksModal1.innerHTML = ''
        // const allWorks= await getWorks()

console.log("display",allWorksData)
        if (Array.isArray(allWorksData)){
          //Création dynamique des éléments HTML
        allWorksData.forEach((work) => {
          
          const figure =  document.createElement("figure") 
          const img = document.createElement("img")
          const iconTrash = document.createElement("i")
          const divTrash = document.createElement("div")

      // Configuration de l'image
          img.src = work.imageUrl
          img.setAttribute('data-id', work.id) 

      // Configuration de l'icône de suppression
          iconTrash.classList.add("fa", "fa-trash-can") 
          iconTrash.setAttribute('data-id', work.id)
          
          divTrash.classList.add('divTrash')
          divTrash.setAttribute('data-id', work.id)
          

          figure.classList.add('figureParent')
          figure.setAttribute('data-id',work.id)
          

      //Rattacher les éléments crées à leurs parents 

          divTrash.appendChild(iconTrash)
          figure.appendChild(img)
          figure.appendChild(divTrash)
          containerWorksModal1.appendChild(figure)


    // APPELLE API POUR SUPPRIMER UN WORK DANS LA MODALE ET LE DOM

          iconTrash.addEventListener('click', async function() {
            // Récupération de l'ID de l'élément iconTrash à supprimer
            const workId = this.getAttribute('data-id')
            console.log(workId)
        
            // Demander confirmation avant d'envoyer la requête DELETE A LA BASE DE DONNEES
            const userConfirmed = confirm("Voulez-vous vraiment supprimer ce projet ?")
            if (userConfirmed) {
              deleteWorks(workId)             
            }
          }) //fin suppression 
          
        })

        }
      
     }
     async function deleteWorks(workId) {
              try {
                // Récupérer le token avant d'envoyer la requête
                const authToken = localStorage.getItem('token')
                
                // Envoyez une requête  DELETE à l'API pour supprimer l'image
                const response = await fetch(`${worksApi}/${workId}`, {

                    method: 'DELETE',
                    headers: {
                        // Inclure le token d'authentification dans les en-têtes de la requête
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (response.ok) {
                  // Suppression du work de la page d'accueil DOM

                    document.getElementById(workId).parentNode.remove(workId);

                  //  Suppression du work de la modale
                  const deleteWorkModal = document.querySelector(`#works-modal [data-id="${workId}"]`);
                  
                    if (deleteWorkModal) {
                        // deleteWorkModal.remove();
                        deleteWorkModal.parentNode.removeChild(deleteWorkModal)
                    }
                } else {
                    alert('Erreur lors de la suppression de l\'élement.')
                  }

            } catch (error) {
                console.error('Erreur lors de la suppression :', error)
              }
    }

// FONCTION POUR FERMER LA MODALE 1
          function closeModal1(){
              //fermeture de la modale en cliquant sur le bouton Xmark
              const closeModalButton = document.querySelector('.close-modal-button')
              closeModalButton.addEventListener('click', function() {
                  modal.style.display = 'none' // Fermer la modale
              });

              //fermeture de la modale en cliquant  en dehors de la modale
              modal.addEventListener('click', function() {
                  modal.style.display = 'none' // Fermer la modale
              });


              // Empêche l'événement de clic de se propager sur la modale
              const windowModal1 = document.querySelector('.window-modal') 
              windowModal1.addEventListener('click', function(event) {
                  event.stopPropagation() 
              });
          }
          closeModal1()


//SE REDIRIGER VERS LA MODALE 2 et  réinitialiser le formulaire 
          const btnAddModal1 = document.getElementById('add-picture')
            btnAddModal1.addEventListener('click', function(){
              displayMoadal2()
              form.reset() //réinitialisé le titre du formulaire.
              initInputFile()
              generateCategoryOptions()
              
          })

  // Fonction pour afficher la modale 2 et cacher la modale 1
          function displayMoadal2() {
          
            const modal1 = document.getElementById('modal1')
            modal1.style.display = 'none'
            const modal2 = document.querySelector('.modal-container2')
            modal2.style.display='flex'
          }

   // Fonction pour réinitialiser le champ de fichier quand je click sur précédent
          function initInputFile() {
            const inputFile = document.getElementById('plusAjoutPhoto')
            
            inputFile.value = ''
            
            // Réinitialiser l'aperçu de l'image
            const imagePreview = document.getElementById('imagePreview')
            imagePreview.style.display = 'none';
            imagePreview.src = ''

            // Réafficher le bouton "+ Ajouter photo"
            const ajoutPhoto = document.getElementById("ajoutPhotoSpace")
            ajoutPhoto.style.display = 'flex'

          }
  
  //Fonction pour fermer la modale 2
          function closeModal2(){
            const closeModal2Button = document.querySelector('.close-modal2-button') 
            closeModal2Button.addEventListener('click', function() {
              const modal2 = document.querySelector('.modal-container2')
                modal2.style.display = 'none'
            })

          //fermeture de la modale2 en cliquant  en dehors de la fenêtre modale
              const modal2 = document.getElementById('modal2')
              modal2.addEventListener('click', function() {
                modal2.style.display = 'none' 
            })
          // Empêcher la propagation de l'événement de clic à partir du contenu de la modale.
              const windowModal2 = document.querySelector('.window-modal2')
              windowModal2.addEventListener('click', function(event) {
                  event.stopPropagation() 
            });
          }
          closeModal2()

// Retour  vers modale 1 avec la flèche
        const arrowLeft = document.querySelector('.arrow-left')
            arrowLeft.addEventListener('click', function(){
              displayModal1()
          })

        function displayModal1() {
            modal.style.display = 'flex' 
            const modal2 = document.querySelector('.modal-container2')
            modal2.style.display='none'
          }

// FORMULAIRE: ENVOYER UNE IMAGE AU SERVEUR DEPUIS UN FORMULAIRE VIA LA MODALE 2

// Création des options "select " pour générer une liste déroulante des catégories
        async function generateCategoryOptions() {
          
           let categorySelect = document.getElementById("selectOptions")
              categorySelect.innerHTML=''
          // Parcours la liste des catégories et créer une option pour chaque catégorie
              allCategories.forEach((category)=> {
             
              const option = document.createElement("option")
                  option.value = category.id
                  option.textContent = category.name;
                  categorySelect.appendChild(option);
              });

        }


// Fonction pour ajouter un fichier (image) dans le formulaire  modale 2
        function addFileImg() {
          const inputFile=document.getElementById('plusAjoutPhoto')
          const imagePreview = document.getElementById('imagePreview')

        inputFile.addEventListener('change', ()=>{
          const file = inputFile.files[0]

            if (file) {
            //  Créer un URL pour l'image sélectionné
            const imageUrl = URL.createObjectURL(file)
            //// Définissez l'URL comme source de l'élément img pour afficher l'image
            imagePreview.src = imageUrl
            imagePreview.style.display = 'block' // afficher l'élément img avec le src

            const ajoutPhoto =document.getElementById("ajoutPhotoSpace") 
            ajoutPhoto.style.display='none' 
            }
          })
        }
        addFileImg()


// PREPARATION DU FORMULAIRE POUR L'ENVOI d'un projet

// Ajout d'une image dans DOM et dans la modale 1 après soumission du formulaire

const form = document.getElementById('form-add-picture')
form.addEventListener('submit', async function(event) {
  event.preventDefault()

    //Récupération des valeurs saisie dans les inputs du formulaire 
    const title = document.getElementById("title").value
    const categoryId = document.getElementById("selectOptions").value
    const inputFile = document.getElementById("plusAjoutPhoto")
    const imageFile = inputFile.files[0]//récupère le fichier (image) 

      //Vérifier s'il y a bien des valeurs retournées pour les champs si non, retourner une erreur
       if (!title || !categoryId || !imageFile) {
        // Affichage d'un message d'erreur
        alert("Veuillez remplir tous les champs du formulaire.")
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
                'Authorization': `Bearer ${authToken}`
              }
            });

          if (!response.ok) {
            throw new Error('La réponse du serveur indique un échec lors de l\'ajout de l\'image.');
          }else{
            let resultwork = await response.json();
            
               
            allWorks.push(resultwork ) //mettre à jour le tableau, il contien l'image ajoutée uniquement
           
          // Création et ajout d'un work dans la galerie sans recharger la page
                const figure = document.createElement("figure")
                const img = document.createElement("img");
                const figcaption = document.createElement("figcaption")
                
                img.src =resultwork.imageUrl
                img.id = resultwork.id
                figcaption.textContent = resultwork.title
                img.alt = figcaption.textContent

                figure.appendChild(img)
                figure.appendChild(figcaption)
                galleryContainer.appendChild(figure)

             

          // Création d'un work dans la modale sans recharger la page
                const figureModal =  document.createElement("figure") 
                const imgModal = document.createElement("img")
                const iconTrash = document.createElement("i")
                const divTrash = document.createElement("div")

              // Configuration de l'image
                imgModal.src = resultwork.imageUrl
                imgModal.setAttribute('data-id', resultwork.id) 

                // Configuration de l'icône de suppression
                iconTrash.classList.add("fa", "fa-trash-can") // Ajouter les classes FontAwesome
                iconTrash.setAttribute('data-id', resultwork.id)
                divTrash.classList.add('divTrash')
                divTrash.setAttribute('data-id', resultwork.id)
                figureModal.classList.add('figureParent')
                figureModal.setAttribute('data-id',resultwork.id)
                

              // Ajout du work dans la modale
              const containerWorks = document.getElementById('works-modal')
                
                figureModal.appendChild(imgModal)
                figureModal.appendChild(divTrash)
                divTrash.appendChild(iconTrash)
                containerWorks.appendChild(figureModal)

                iconTrash.addEventListener('click', async function() {
                  const allworkId = this.getAttribute('data-id')

                  //Demander confirmation avant d'envoyer la requête DELETE
                      const userConfirmed = confirm("Voulez-vous vraiment supprimer ce projet ?")
                      if (userConfirmed) {
                          deleteWorks(allworkId) 
                      }
                })
  
              }
            }
      catch(error){
        console.log(error, "erreur")
      }

       displayModal1()
      //  displayWorksModal()
    })

    // let modal = document.querySelector('.modal-container');
    

  
 