// Sélection des éléments DOM
let LogoutBtn=document.querySelector("#logoutBtn")// Sélectionne le bouton "logout" dans le DOM
let gallery = document.querySelector('.gallery');// Sélectionne la galerie dans le DOM
let buttonContainer = document.querySelector('.button-container');//Sélectionner le conteneur des boutons de filtrage
const containerModal = document.getElementById("containerModal"); //fond des 2 modales 
const modal1 = document.getElementById("modal1"); // Sélectionner la première modale galerie photos
const modalClose = document.getElementById("modalClose"); // Sélectionne le bouton de fermeture de la 1ere modale
const modalTitle = document.getElementById("modalTitle"); // Sélectionne le titre de la 1ere modale
const modalContent = document.getElementById("modalContent"); // Sélectionne la div pour le contenu de la  modale
const modalBtn = document.getElementById("modalBtn"); // Sélectioone le bouton ajouter une photo
const modalArrow = document.getElementById("modalArrowLeft");// Sélectionne la flèche pour naviguer dans les modales
const modalAddClose = document.getElementById("modalAddClose");// Sélectionne le bouton de fermeture pour ajouter une photo
const previewImg = document.getElementById("containerFileImg");// Sélectionne le conteneur pour l'aperçu de l'image
const inputFile = document.getElementById("file");// Sélectionne le champ d'entrée pour le fichier
const labelFile = document.querySelector("#containerFile label");// Sélectionne le label associé à l'entrée de fichier
const modalAddPhoto = document.getElementById("modalAddPhoto");// Sélectionne l'élément pour ajouter une photo
const modalAddp = document.getElementById("modalAddp"); // Sélectionne le texte d'information pour l'ajout de photo
const modalForm = document.querySelector("#modalAddWorks Form");// Sélectionne le formulaire d'ajout
const token = localStorage.getItem('token');// Récupère le token de session de l'utilisateur dans le stockage local
const editBar = document.querySelector('.edit-bar'); // Sélectionne la barre d'édition
const openGalleryBtn = document.getElementById("openGalleryBtn");// Sélectionne le bouton pour ouvrir la galerie


function logout(event){
    event.preventDefault()// Empêche le comportement par défaut du lien (ne pas rediriger immédiatement)
    localStorage.clear() // Vide le localStorage pour déconnecter l'utilisateur
    location.href=event.target.href// Redirige l'utilisateur vers l'URL du lien cliqué (logout)         
}
LogoutBtn.addEventListener("click",logout)// Ajoute un écouteur d'évenement pour le clic sur le bouton de déconnexion

// Récupération des catégories depuis l'API
async function getCategories() {
    try {
        let response = await fetch("http://localhost:5678/api/categories");// Envoie une requete GET à l'API pour récupérer les catégories
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des catégories");// Lève une erreur si la réponse n'est pas ok 
        }
        return await response.json();// Retourne les données JSON récupérées 
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);// Affiche l'erreur dans la console 
        return []; // Retourne un tableau vide en cas d'erreur 
    }
}
// Récupération des travaux depuis l'API
async function getWorks() {
    try {
        let response = await fetch("http://localhost:5678/api/works"); // Envoie une requete GET pour récupérer les travaux 
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`); // Lève une erreur si la réponse n'est pas OK
        }
        return await response.json();// Retourne les données JSON des travaux
    } catch (error) {
        console.error("Erreur de chargement des travaux:", error);// Affiche l'erreur dans la console
        alert("Erreur de chargement des travaux. Veuillez réessayer.");// Affiche une alerte en cas d'erreur
        return []; // Renvoie un tableau vide en cas d'erreur
    }
}
// Remplit la liste déroulante de catégories dans le formulaire d'ajout 
async function populateCategorySelect() {
    const categories = await getCategories();// Récupère les catégories
    const select = document.getElementById("modalCategory");// Sélectionne la liste déroulante de catégories
    select.innerHTML = '';// Réinitialise la liste déroulante
    const defaultOption = document.createElement("option");// Crée une option par défaut
    defaultOption.value = "";// Aucune valeur par défaut
    defaultOption.selected = true;// Définit cette option comme sélectionnée par défaut
    defaultOption.disabled = true;// Désactive l'option par défaut
    select.appendChild(defaultOption);// Ajoute l'option par défaut à la liste déroulante
    categories.forEach(category => {// Parcourt chaque catégorie
    const option = document.createElement("option");// Crée une nouvelle option pour la catégorie
    option.value = category.id;// Définit l'ID de la catégorie comme valeur
    option.textContent = category.name;// Définit le nom de la catégorie comme texte de l'option
    select.appendChild(option);// Ajoute l'option à la liste déroulante
    });
}
// Appel des fonctions pour initialiser les éléments avec les catégories
createFilterButtons();// Crée les boutons de filtre 
populateCategorySelect();// Remplit la liste déroulante des catégories 

// Fonction pour afficher les travaux sur la page principale
async function displayWorks(filter = 'tous') {
    let works = await getWorks(); // Récupérer les travaux depuis l'API
    gallery.innerHTML = ''; // Vide la galerie avant d'ajouter les nouveaux éléments
    let filteredWorks = works;// Par défaut, aucun filtrage (affiche tous les travaux)
    if (filter !== 'tous') {
 // Filtre les travaux par catégorie si un filtre est appliqué
        filteredWorks = works.filter(work => work.category && work.category.name.toLowerCase() === filter.toLowerCase());
    }

    for (let work of filteredWorks) {// Parcourt chaque travail filtré
        let figure = document.createElement('figure');// Crée un élément <figure> pour chaque travail
        figure.setAttribute('data-id',work.id);// Ajoute l'ID du travail comme attribut data-id
        let img = document.createElement('img');// Crée un élément <img> pour l'image du travail
        img.src = work.imageUrl;// Définit la source de l'image
        img.alt = work.title;// Ajoute un texte alternatif à l'image
        let figcaption = document.createElement('figcaption');// Crée une légende pour la figure
        figcaption.textContent = work.title;// Définit le texte de la légende comme étant le titre du travail
        figure.appendChild(img);// Ajoute l'image à l'élément <figure>
        figure.appendChild(figcaption);// Ajoute la légende à l'élément <figure>
        gallery.appendChild(figure);// Ajoute l'élément <figure> à la galerie
    }
    checkLoginStatus(); // Vérifier le statut de connexion après l'affichage des travaux
}
// Création des boutons de filtre avec les catégories récupérées
async function createFilterButtons() {
    const categories = await getCategories(); // Récupère les catégories 
    buttonContainer.innerHTML = ''; // Réinitialise le conteneur des boutons

// fonction pour définir le bouton actif pour qu'elle change du couleur au moment du click 
    function setActiveButton(activeButton){
        const buttons = buttonContainer.querySelectorAll('button');// Sélectionne tous les boutons 
        buttons.forEach(button =>button.classList.remove('button-active'));// Retire la classe active de tous les boutons 
        activeButton.classList.add('button-active');// Ajoute la classe active uniqument au bouton cliqué
    }
// Ajouter le bouton "Tous"
    const allButton = document.createElement('button');// Crée un nouveau bouton 
    allButton.id = 'filter-all'; // Définit l'ID du bouton 
    allButton.classList.add('button-active');
    allButton.textContent = 'Tous';// Définit le texte du bouton 
    allButton.addEventListener('click', () => {// Ajoute un écouteur d'événement pour le clic
        displayWorks('tous');// Affiche tous les travaux 
        setActiveButton(allButton);// Définit ce bouton comme actif 
    });
    buttonContainer.appendChild(allButton);// Ajoute le bouton au conteneur 
// Créer des boutons pour chaque catégorie
      categories.forEach(({ id, name }) => {// Parcourt chaque catégorie
        let button = document.createElement('button');// Crée un bouton pour la catégorie
        button.id = `filter-${name.toLowerCase().replace(/ /g, '-')}`;// Définit l'ID du bouton en remplaçant les espaces par des tirets
        button.textContent = name;// Définit le texte du bouton comme le nom de la catégorie
        button.addEventListener('click', () =>{ // Ajoute un écouteur d'événement pour le clic
            displayWorks(name); // Ajoute un écouteur d'événement pour le clic
            setActiveButton(button); // Définit ce bouton comme actif
        });
        buttonContainer.appendChild(button); // Ajoute le bouton au conteneur
    });
}
// Vérification du statut de connexion et initialisation
document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn'); // Sélectionne le bouton "login" dans le DOM
    const logoutBtn = document.getElementById('logoutBtn');// Sélectionne le bouton "logout"

    checkLoginStatus(); // Vérifier si l'utilisateur est connecté
    createFilterButtons(); // Crée les boutons de filtre
    displayWorks(); // Affiche les travaux sans filtre au chargement de la page
});

// Fonction pour vérifier si l'utilisateur est connecté

function checkLoginStatus() {
    const token = localStorage.getItem('token');// Récupère le token du localStorage
    const isLoggedIn = !!token;// Vérifie si un token est présent (l'utilisateur est connecté)
// Gérer l'affichage des boutons login et logout

    loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
    LogoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
    document.getElementById('openGalleryBtn').style.display = isLoggedIn ? 'inline-block' : 'none';
// Gérer l'affichage des filtres et du bouton "modifier"

     const filterContainer = document.querySelector('.button-container'); // Sélectionne le conteneur des filtres
     const modifyButton = document.getElementById('openGalleryBtn'); // Sélectionne le bouton "modifier"
 
     if (isLoggedIn) {
         filterContainer.style.display = 'none'; // Cacher les filtres si l'utilisateur est connecté
         openGalleryBtn.style.display = 'inline-block'; // Afficher le bouton modifier
     } else {
         filterContainer.style.display = 'flex' ; // Afficher les filtres si l'utilisateur n'est pas connecté
         modifyButton.style.display = 'none'; // Cacher le bouton modifier
     }
// Ajouter la classe logged-in au body si l'utilisateur est connecté

     if (isLoggedIn) {
        document.body.classList.add('logged-in');
    } else {
        document.body.classList.remove('logged-in');
    }
}
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

// Fonction pour mettre à jour la visibilité de la bande noire

function updateEditBarVisibility() {
    if (token) {// Vérifie si l'utilisateur est connecté (si un token est présent)
        editBar.style.display = 'flex'; // Afficher la bande noire si l'utilisateur est connecté
    } else {
        editBar.style.display = 'none'; // Masquer la bande noire si l'utilisateur n'est pas connecté
    }
}

// Appeler la fonction lors du chargement de la page
updateEditBarVisibility();

// appeler cette fonction après la déconnexion pour mettre à jour l'interface 
function logout() {
    localStorage.removeItem('token'); // Supprimer le token d'authentification 
    updateEditBarVisibility(); // Mettre à jour la visibilité de la bande noir après la déconnexion
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
