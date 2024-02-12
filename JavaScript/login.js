
const formulaireLogin = document.querySelector(".formulaire-login")


async function listenerEnvoyerLogin(event) {//pour gérer l'envoi du formulaire de connexion
    event.preventDefault()  //Pour bloquer le comportement du navigateur par défaut
        const emailPassword = {
            email: event.target.querySelector("[name=email]").value, 
            password: event.target.querySelector("[name=password]").value
        }

        //Création dela charge utile sous forme de chaîne (transforme l'objet JavaScript en une chaîne JSON)
        const loginUser=JSON.stringify(emailPassword)

        //Appeler la fonction fetch
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers:{
                 "Content-Type": "application/json"
                },
            body: loginUser
        })

        let result = await response.json()// convertit la réponse du serveur de JSON en un objet JavaScript. 

         // Gérer la valeur du token et effectuer des actions conditionnelles ( La présence d'un token signifie que l'utilisateur a été authentifié avec succès)
    if (result.token || response.status === 200) {
        // Si le serveur a renvoyé un token d'authentification et que le statut de la réponse est égal à 200
        // Enregistrer le token avec localStorage et rediriger vers la page index en mode connecté
        localStorage.setItem('token', result.token);
        window.location.href = 'index.html'; 
    } else {
        // Si le token est null ou si la réponse n'est pas égale à 200
        // Afficher une erreur
        alert('Erreur, Email ou mot passe incorrecte .');
    }
        
}
// Attachement de l'écouteur d'événements au formulaire:
formulaireLogin.addEventListener("submit", listenerEnvoyerLogin)
    
    

