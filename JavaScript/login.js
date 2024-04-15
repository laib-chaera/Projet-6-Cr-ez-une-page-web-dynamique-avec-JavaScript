


// Ajouter l'écouteur d'événements au formulaire
const formulaireLogin = document.querySelector(".formulaire-login");

if (formulaireLogin) {
    formulaireLogin.addEventListener("submit", listenerEnvoyerLogin);
}

//Fonction pour gérer l'envoi du formulaire de connexion
async function listenerEnvoyerLogin(event) {
    event.preventDefault()  //empécher le chargement de la page et à la place exécuter les instruction qui suivent)

        //Création d'un objet javascript qui récupère les valeur saisie et les envoyer à l'API 
        const emailPassword = {
            email: event.target.querySelector("[name=email]").value, 
            password: event.target.querySelector("[name=password]").value
        }
        // Transforme l'objet JavaScript en une chaîne de caractère (format JSON) pour l'envoyer au serveur 
        const loginUser=JSON.stringify(emailPassword)

        //Appeler API avec la fonction fetch(URL)
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers:{
                    "Content-Type": "application/json"
                },
            body: loginUser
        })
        
        let result = await response.json()// convertit la réponse du serveur (de JSON en un objet JavaScript.) 

        // vérification si token d'authentification ok et statut = 200 
        if (result.token || response.status === 200) {
            
            // Enregistrer le token avec localStorage et rediriger vers la page index en mode connecté
            localStorage.setItem('token', result.token);
            window.location.href = 'index.html'; 
                    
        } else {
            // Si le token est null ou si la réponse n'est pas égale à 200
            // Afficher une erreur
            alert('Erreur dans l’identifiant ou le mot de passe.');
        }
            
}






