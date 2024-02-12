
//Récupérer les travaux depuis une API back-end/ Faire l'appel à l'API avec fetch(URL)
const worksApi = "http://localhost:5678/api/works" // l'URL de la route du backend permettant de récupérer les travaux.
const galleryContainer = document.querySelector(".gallery")//Sélectionne la DIV qui a la classe .gallery où les travaux seront affichés.

const categoriesApi = "http://localhost:5678/api/categories"
const filtersContainer = document.querySelector(".filters")

//fonction asynchrone pour récupérer les travaux depuis l'API

async function getWorks() { 
   try{
    const responseJson = await fetch(worksApi, {
        methode:"get"
    }) 
    return await responseJson.json() 
    
    }   catch   (error) { 
            console.error(error)
        } 
        
}

//Créer dynamiquement les éléments HTML (les travaux de sophie) et les afficher sur la page web.
async function displayWork() { 
    const allWorks = await getWorks()
        console.log(allWorks)

    galleryContainer.innerHTML = '' 
    
    allWorks.forEach((work) => {//Parcourt chaque élément (travail) dans les données récupérées.
            const figure = document.createElement("figure")
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption")
            figure.appendChild(img)
            figure.appendChild(figcaption)
            img.src = work.imageUrl;
            figcaption.textContent = work.title
            img.alt = figcaption.textContent
            galleryContainer.appendChild(figure)
    })
    console.log(galleryContainer) 
}
displayWork()


//fonction asynchrone pour récupérer les catégories depuis l'API
async function getCategories() {
        try{
            const categoriesJson = await fetch(categoriesApi,{
                methode:"get"
            })
            return await categoriesJson.json()

        }   catch   (error) {
                console.error(error)
            }  
    }
    
//créer dynamiquement les catégories pour les afficher

async function displayCategoryBtn() {
    
    const allCategories = await getCategories()
    console.log(allCategories)
    
    allCategories.forEach((category) =>{
        const btn = document.createElement("button")
        btn.textContent = category.name.toUpperCase()
        btn.id = category.id
        filtersContainer.appendChild(btn)
        console.log(filtersContainer)

        //A jouter l'événement click sur chaque bouton
        btn.addEventListener("click", ()=>{
            filterWorksByCategory(btn.id.toString())//// Appeler la fonction filterWorksByCategory avec l'id de la catégorie comme argument

        })
    })   
}
displayCategoryBtn()

async function filterWorksByCategory(buttonId) {
    const allWorks = await getWorks();

    let filteredWorks; // variable pour stocker les travaux filtrés
    if (buttonId === "0") {
        filteredWorks = allWorks; // Si l'ID est 0, affichez tous les travaux.
    } else {
        filteredWorks = allWorks.filter(work => work.categoryId.toString() === buttonId);
    }
    galleryContainer.innerHTML = ''; // Vide le container avant d'afficher les travaux filtrés.
    
    filteredWorks.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        img.src = work.imageUrl;
        figcaption.textContent = work.title;
        img.alt = figcaption.textContent;
        galleryContainer.appendChild(figure);
    });
}



