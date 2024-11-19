// Fonction pour afficher les travaux dans la modale

async function displayModalWorks() {
    const works = await getWorks(); // Récupérer les travaux depuis l'API
    console.log("travaux récupérés:",works); // pour voir si les travaux sont bien récupérés
    const galleryModal = document.getElementById('galleryModal'); // Sélectionner la galerie dans la modale
    galleryModal.innerHTML = ''; // Vide la galerie avant d'ajouter les nouveaux éléments

// Parcourt tous les travaux et les ajoute à la modale

    for (let work of works) {
        const figure = document.createElement('figure');// Crée une figure pour chaque travail
        const img = document.createElement('img');// crée une image 
        img.src = work.imageUrl; // Définie la source de l'image 
        img.alt = work.title; // Ajoute un texte alternatif à l'image
        const figcaption = document.createElement('figcaption');// Crée une légende pour la figure 
        figcaption.textContent = work.title;// Définit le texte de la légende comme étant le titre du travail

// Création du bouton de suppression pour chaque travail 

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>'; // Icône de suppression
        deleteButton.classList.add('delete-button'); // Classe pour styliser le bouton

// Écouteur d'événements pour supprimer le projet

        deleteButton.addEventListener('click', () => {
            deleteProject(work.id,figure); // Passe l'ID et la figure à la fonction de suppression
        });

        figure.appendChild(img);// Ajoute l'image à la figure 
        figure.appendChild(figcaption);// Ajoute la légende à la figure 
        figure.appendChild(deleteButton); // Ajouter le bouton de suppression à la figure
        galleryModal.appendChild(figure);// Ajoute la figure à la galerie de la modale 
    }
}
// fonction pour gérer l'ouverture de la modale de galerie
function displayModal() {
    openGalleryBtn.addEventListener("click", () => { // Ajoute un écouteur d'évenement pour le bouton d'ouverture de la galerie     
        containerModal.style.display = "flex";// Affiche le conteneur de la modale 
        displayModalWorks(); // Appeler la fonction pour afficher les travaux de l'architecte
    });
// Ajout d'un écouteur d'évenement pour fermer la modale     
    modalClose.addEventListener("click", () => {
        console.log("modalClose")
        containerModal.style.display = "none";// Masquer le conteneur de la modale 
    });

//si on clique en dehors de la modale, containerModal disparait/se ferme
    containerModal.addEventListener("click", (e) => {
        if (e.target.id === "containerModal") {// Vérifie si l'élément cliqué est le conteneur de la modale
            resetFormFields(); // Réinitialise les champs du formulaire
            resetFileInput();// Réinitialise le champ de fichier
            containerModal.style.display = "none";// Masque le conteneur de la modale 
        }
    });
}
// Appel de la fonction pour activer l'affichage de la modale
displayModal();
// fonction pour supprimer un projet 
function deleteProject(projectId, figureElement) {
    console.log(`Tentative de suppression du projet avec l'ID: ${projectId}`); // log l'ID du projet à supprimer 
// Envoie une requête de suppression à l'API
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${window.localStorage.getItem("token")}`// Inclut le token d'authentification
        }
    })
    .then(response => {
        if (response.ok) {// Vérifie si la réponse est correcte 
            console.log(`Le projet avec l'id ${projectId} a été supprimé.`);// Log succès de la suppression
            console.log('Élément à supprimer:', figureElement); // Log l'élément à supprimer
// Supprimer l'élément du DOM
            if (figureElement) {
                figureElement.remove(); // Retirer l'élément du DOM
            } else {
                console.error("L'élément à supprimer n'a pas été trouvé.");// Log erreur si l'élément n'existe pas
            }
// Mettre à jour la galerie principale
            updateMainGallery(projectId);
        } else {
            console.error("Le delete a échoué. Code erreur:", response.status);// Log l'erreur
            alert("Erreur lors de la suppression du projet. Vérifiez si le projet existe.");// Alerte utilisateur
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression. Veuillez réessayer.");
    });
}    
// Fonction pour mettre à jour la galerie principale après suppression
function updateMainGallery(projectId) {
    const gallery = document.querySelector('.gallery');// Sélectionne la galerie 
    const workElement = gallery.querySelector(`[data-id='${projectId}']`);// Rechercher l'élément correspondant à l'ID du projet
// Rechercher l'élément correspondant à l'ID du projet

    if (workElement) {
        workElement.remove(); // Supprimer l'élément de la galerie principale
    } else{
        console.error("L'élément à supprimer n'a pas été trouvé dans la galerie principale.");
    }
}