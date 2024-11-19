//Gère les boutons de la modale 
function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";// Affiche la modale d'ajout 
        modal1.style.display = "none";// Masque la première modale
        resetFormFields(); // Reset les champs lorsque la modale est ouverte
        resetFileInput(); // Reset le champ de fichier
    });
//Gère le retour à la première modale 
    modalArrow.addEventListener("click", () => {
        resetFormFields();// Réinitialise les champs
        resetFileInput();// Réinitialise le champ de fichier
        modalAddWorks.style.display = "none";// Masque la modale d'ajout
        modal1.style.display = "flex";// Affiche la première modale 
    });
    // Gère la fermeture de la modale d'ajout
    modalAddClose.addEventListener("click", () => {
        resetFormFields(); // Réinitialise les champs
        containerModal.style.display = "none";// Masque le conteneur de la modale 
    });
} 
// Appel de la fonction pour activer les boutons de la modale d'ajout
displayAddModal();

//Ecouteur d'évenement pour télécharger une image/ajouter un projet dans la modale
inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]; // Récupère le premier fichier sélectionné
    if (file) {
        const reader = new FileReader(); // Crée un nouvel objet FileReader
        reader.onload = function (e) { 
            previewImg.src = e.target.result; // Affiche l'aperçu de l'image
            previewImg.style.display = "flex"; // Affiche l'aperçu de l'image
            labelFile.style.display = "none"; // Cache le label après sélection de l'imag
            modalAddPhoto.style.display = "none"; // Cache l'élément d'ajout de photo
            modalAddp.style.display = "none"; // Cache le mini texte   
        };
        reader.readAsDataURL(file); // Lit le fichier et déclenche l'événement onload
        } else {
            resetFileInput(); // Réinitialise l'aperçu si aucun fichier n'est sélectionné
        }
        checkFormValidity(); // Vérifie l'état global des champs après modification
    });
        
    
//fonction pour enlever l'aperçu de l'image
function resetFileInput() {
    inputFile.value = ""; // Réinitialise le champ file
    previewImg.src = "";  // Supprime l'aperçu de l'image
    previewImg.style.display = "none"; // Cache l'élément d'aperçu
    labelFile.style.display = "flex"; // Réaffiche le label du fichier
    modalAddPhoto.style.display = "flex"; // Réaffiche l'icône de photo
    modalAddp.style.display = "flex"; // Réaffiche le texte "jpg, png : 4mo max"
}
// Fonction pour réinitialiser les champs du formulaire
function resetFormFields() {
    document.getElementById("title").value = ""; // Réinitialise le titre
    document.getElementById("modalCategory").selectedIndex = 0; // Réinitialise la catégorie à l'option vide
    resetFileInput(); // Réinitialise l'input file et l'aperçu de l'image
}

//chargement de la modale pour soumettre un nouveau projet 
modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();// Empèche l'envoi par défaut du formulaire
// Réinitialiser le message d'erreur avant la soumission
    const errorMessage = document.getElementById("form-error-message");
    errorMessage.style.display = "none"; // Cache le message d'erreur au début


    const title = document.getElementById("title").value;// Récupère le titre du projet 
    const category = document.getElementById("modalCategory").value;// Récupère la catégorie sélectionnée
    const imageFile = document.getElementById("file").files[0];// Récupère le fichier d'image sélectionné
    
// Initialisez formData avant d'entrer dans le bloc try
    const formData = new FormData();
    formData.append("title", title);// Ajout le titre au FormData
    formData.append("category", category); //Ajoute la catégorie au FormData
    formData.append("image", imageFile); // Ajoute l'image au FormData

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",// Envoi une requete POST
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem("token")}`// Inclut le token d'authentification
            },
            body: formData // Envoi les données du formulaire 
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Non autorisé. Veuillez vous connecter.");
            } else {
                throw new Error("Erreur lors de l'ajout du projet.");
            }
        }

        const data = await response.json();// Récupère la reponse JSON 
        console.log("Projet ajouté:", data);// log le projet ajouté 

        displayModalWorks();// Met à jour l'affichage des travaux 
        displayWorks();// Rafraichit l'affichage des travaux 
// Après une soumission réussie, réinitialiser le formulaire
        resetFormFields();
        modalAddWorks.style.display = "none";//Masque la modale D'ajout
        modal1.style.display = "flex";// Affiche la première modale
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        const errorMessage = document.getElementById("form-error-message");
        errorMessage.textContent = "Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.";
        }
});   
displayWorks(); // rafraichir la galerie principale

// Sélection des éléments du formulaire
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("modalCategory");
const imageInput = document.getElementById("file");
const btnValidForm = document.querySelector(".btnValider");

// Fonction pour vérifier si tous les champs sont remplis
function checkFormValidity() {
// Réinitialiser le message d'erreur 
    const errorMessage = document.getElementById("form-error-message");
    errorMessage.style.display = "none"; // Cache le message d'erreur par défaut

// Vérifier que le titre, la catégorie et l'image sont remplis
    const isTitleFilled = titleInput.value.trim() !== "";// Vérifie que le titre n'est pas vide
    const isCategorySelected = categorySelect.value !== "";// Vérifie qu'une catégorie est sélectionnée
    const isImageSelected = imageInput.files.length > 0;// Vérifie qu'une image est sélectionnée

// Si tous les champs sont remplis, activer le bouton ; sinon, le désactiver
      btnValidForm.disabled = !(isTitleFilled && isCategorySelected && isImageSelected);
// Afficher le message d'erreur si un champ est manquant
    if (!isTitleFilled) {
        errorMessage.textContent = "Le titre est requis.";
        errorMessage.style.display = "block";
    } else if (!isCategorySelected) {
        errorMessage.textContent = "La catégorie est requise.";
        errorMessage.style.display = "block";
    } else if (!isImageSelected) {
        errorMessage.textContent = "L'image est requise.";
        errorMessage.style.display = "block";
    }
// Si tous les champs sont valides, retirer le message d'erreur
    if (isTitleFilled && isCategorySelected && isImageSelected) {
        errorMessage.style.display = "none"; // Cache le message d'erreur
    }
// Activer ou désactiver le bouton "Valider" en fonction des champs remplis
      if (!btnValidForm.disabled) {
        btnValidForm.classList.add("valid");// Ajoute la classe "valid" si le bouton est actif
    } else {
        btnValidForm.classList.remove("valid");// Retire la classe "valid" si le bouton est désactivé
    }
}
// Désactiver le bouton et réinitialiser les champs lorsque la modale s'ouvre
function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";// Affiche la modale d'ajout 
        modal1.style.display = "none";// Masque la première modale 
        resetFormFields(); // Réinitialiser les champs du formulaire
        btnValidForm.disabled = true; // Désactiver le bouton "Valider"
    });

// Gérer la fermeture de la modale
    modalArrow.addEventListener("click", () => {
        resetFormFields();
        modalAddWorks.style.display = "none";//Masque la modale d'ajout
        modal1.style.display = "flex";// Affiche la première modale 
    });

    modalAddClose.addEventListener("click", () => {
        resetFormFields();
        containerModal.style.display = "none";// Masque le conteneur de la modale 
    });
}

// Ajout des écouteurs d'événements pour chaque champ du formulaire
titleInput.addEventListener("input", checkFormValidity);// Vérifie la validité du titre
categorySelect.addEventListener("change", checkFormValidity);// Vérifie la validité de la catégorie
imageInput.addEventListener("change", checkFormValidity);// Vérifie la validité de l'image


// Appeler displayAddModal pour mettre en place la modale et les règles de désactivation
displayAddModal(); // Appel de la fonction pour activer les boutons de la modale
