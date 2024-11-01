// Log pour confirmer que le script JavaScript est chargé correctement
console.log('script chargé'); 
// Exécution lorsque le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM complètement chargé'); // Vérifie que le DOM est prêt à être manipulé

    // Récupération du formulaire de connexion par son ID
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Le formulaire de connexion n\'existe pas.');
        return;
    }

    // Si le formulaire n'est pas trouvé, loggez une erreur et arrêtez l'exécution
    if (!loginForm) {
        console.error('Le formulaire de connexion n\'existe pas.');  // Erreur si le formulaire n'existe pas
        return; // Arrêt du script si le formulaire n'est pas présent
    }

     // Ajout d'un écouteur d'événement sur le formulaire pour gérer la soumission
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

        // Récupération des valeurs des champs "email" et "password"
        const email = document.getElementById('email').value; //champ email 
        const password = document.getElementById('password').value; // champ mot de passe
         // Vérification si les champs ne sont pas vides
         if (!email || !password) {
            showError('Veuillez remplir tous les champs.');
            return;
        }

    // Vérification du format de l'email via une expression régulière 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('error-message').textContent = 'Veuillez entrer une adresse email valide.';// Message d'erreur si l'email est invalide
        document.getElementById('error-message').style.display = 'block';
        return;// Sortir si l'email n'est pas valide
    }

        try {
            // Envoi de la requête à l'API avec les identifiants (email et password)
            let response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',// Méthode POST pour envoyer les données
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, password: password })// Convertit les données en JSON
            });
                // Parse la réponse en JSON
            let data = await response.json();
            console.log('Réponse de l\'API:', data); //Log de la réponse API
                // Si la requête a réussi (status 200)
            if (response.ok) {
                 // Masquer le message d'erreur
                 document.getElementById('error-message').style.display = 'none';
                 // Stocker le token reçu dans le localStorage
                localStorage.setItem('token', data.token); // Stocker le token                  
                console.log('Token stocké:', data.token); // Vérifie le token

                // Afficher le bouton de déconnexion qui était caché
                document.getElementById('logoutBtn').style.display = 'block'; 
                 // Redirection vers la page d'accueil après la connexion réussie
                window.location.href = 'index.html'; // Redirige vers la page d'accueil
            } else {
                 // En cas d'erreur (ex: identifiants incorrects), afficher un message d'erreur
                document.getElementById('error-message').textContent = 'Erreur dans l’identifiant ou le mot de passe';
                document.getElementById('error-message').style.display = 'block';
            }

        } catch (error) {
            // Gestion des erreurs de la requête (ex : problème serveur, réseau)
            console.error('Erreur lors de la requête', error);
            document.getElementById('error-message').textContent = 'Une erreur est survenue. Veuillez réessayer.'; // Affiche un message générique en cas d'erreur
            document.getElementById('error-message').style.display = 'block';// Affichage du message d'erreur
        }
    });
});