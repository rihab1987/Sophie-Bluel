console.log("Chargement de la version mise à jour de script.js");
// Sélection des éléments DOM
let LogoutBtn=document.querySelector("#logoutBtn")// Sélectionne le bouton "logout" dans le DOM
let gallery = document.querySelector('.gallery');// Sélectionne la galerie dans le DOM
let buttonContainer = document.querySelector('.button-container');
const containerModal = document.getElementById("containerModal"); //fond des 2 modales 
const modal1 = document.getElementById("modal1"); //modale galerie photo ou 1ere modale
const modalClose = document.getElementById("modalClose"); // croix pour fermer la 1ere modale
const modalTitle = document.getElementById("modalTitle"); // titre de la 1ere modale
const modalContent = document.getElementById("modalContent"); // div pour contenir la galerie de la modale
const modalBtn = document.getElementById("modalBtn"); //bouton ajouter une photo de la 1ere modale
const modalArrow = document.getElementById("modalArrowLeft");
const modalAddClose = document.getElementById("modalAddClose");
const previewImg = document.getElementById("containerFileImg");
const inputFile = document.getElementById("file");
const labelFile = document.querySelector("#containerFile label");
const modalAddPhoto = document.getElementById("modalAddPhoto");
const modalAddp = document.getElementById("modalAddp");
const modalForm = document.querySelector("#modalAddWorks Form");
const token = localStorage.getItem('token');
const editBar = document.querySelector('.edit-bar'); 
const openGalleryBtn = document.getElementById("openGalleryBtn");

function logout(event){
    event.preventDefault()// Empêche le comportement par défaut du lien (ne pas rediriger immédiatement)
    localStorage.clear() // Vide le localStorage pour déconnecter l'utilisateur
    location.href=event.target.href// Redirige l'utilisateur vers l'URL du lien cliqué (logout)         
}
LogoutBtn.addEventListener("click",logout)// Associe la fonction logout au clic sur le bouton

// Récupération des catégories depuis l'API
async function getCategories() {
    try {
        let response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des catégories");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        return [];
    }
}
// Création des boutons de filtre avec les catégories récupérées
async function createFilterButtons() {
    const categories = await getCategories();
    buttonContainer.innerHTML = ''; // Réinitialise le conteneur des boutons

    // fonction pour définir le bouton actif pour qu'elle change du couleur au moment du click 
    function setActiveButton(activeButton){
        const buttons = buttonContainer.querySelectorAll('button');
        buttons.forEach(button =>button.classList.remove('button-active'));
        activeButton.classList.add('button-active');
    }
    // Ajouter le bouton "Tous"
    const allButton = document.createElement('button');
    allButton.id = 'filter-all';
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', () => {
        displayWorks('tous');
        setActiveButton(allButton);
    });
    buttonContainer.appendChild(allButton);
      // Créer des boutons pour chaque catégorie
      categories.forEach(({ id, name }) => {
        let button = document.createElement('button');
        button.id = `filter-${name.toLowerCase().replace(/ /g, '-')}`;
        button.textContent = name;
        button.addEventListener('click', () =>{
            displayWorks(name);
            setActiveButton(button);
        });
        buttonContainer.appendChild(button);
    });
}
// Remplit la liste déroulante de catégories dans le formulaire d'ajout 
async function populateCategorySelect() {
    const categories = await getCategories();
    const select = document.getElementById("modalCategory");
    select.innerHTML = '';

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.textContent = "Choisir une catégorie";
    select.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}
// Appel des fonctions pour initialiser les éléments avec les catégories
createFilterButtons();
populateCategorySelect();


// Récupération des travaux depuis l'API
async function getWorks() {
    try {
        let response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur de chargement des travaux:", error);
        alert("Erreur de chargement des travaux. Veuillez réessayer.");
        return []; // Renvoie un tableau vide en cas d'erreur
    }
}

 

// Fonction pour afficher les travaux sur la page principale
async function displayWorks(filter = 'tous') {
    let works = await getWorks(); // Récupérer les travaux depuis l'API
    gallery.innerHTML = ''; // Vide la galerie avant d'ajouter les nouveaux éléments

    let filteredWorks = works;// Par défaut, aucun filtrage (affiche tous les travaux)

    if (filter !== 'tous') {
        // Filtre les travaux par catégorie si un filtre est appliqué
        filteredWorks = works.filter(work => work.category && work.category.name.toLowerCase() === filter.toLowerCase());
    }

    for (let work of filteredWorks) {
        let figure = document.createElement('figure');// Crée un élément <figure> pour chaque travail
        figure.setAttribute('data-id',work.id);// Ajoute l'ID du travail comme attribut data-id
        let img = document.createElement('img');// Crée un élément <img> pour l'image du travail
        img.src = work.imageUrl;// Définit la source de l'image
        img.alt = work.title;// Ajoute un texte alternatif à l'image
        let figcaption = document.createElement('figcaption');// Crée une légende pour la figure
        figcaption.textContent = work.title;// Définit le texte de la légende comme étant le titre du travail

        figure.appendChild(img);// Ajoute l'image à la figure
        figure.appendChild(figcaption);// Ajoute la légende à la figure
        gallery.appendChild(figure);// Ajoute la figure à la galerie
    }
    checkLoginStatus(); // Vérifier le statut de connexion après l'affichage des travaux
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


// Modale

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
    if (token) {
        editBar.style.display = 'flex'; // Afficher la bande noire si l'utilisateur est connecté
    } else {
        editBar.style.display = 'none'; // Masquer la bande noire si l'utilisateur n'est pas connecté
    }
}

// Appeler la fonction lors du chargement de la page
updateEditBarVisibility();

// appeler cette fonction après la déconnexion
function logout() {
    localStorage.removeItem('token'); // Supprimer le token
    updateEditBarVisibility(); // Mettre à jour la visibilité après la déconnexion
}
// fonction ouverture de la modale 
console.log("openGalleryBtn")
function displayModal() {
    openGalleryBtn.addEventListener("click", () => {      
        containerModal.style.display = "flex";
        displayModalWorks(); // Appeler la fonction pour afficher les travaux de l'architecte
    });
    
    modalClose.addEventListener("click", () => {
        console.log("modalClose")
        containerModal.style.display = "none";
    });

    //si on clique en dehors de la modale, containerModal disparait/se ferme
    containerModal.addEventListener("click", (e) => {
        if (e.target.id === "containerModal") {
            resetFormFields();
            resetFileInput();
            containerModal.style.display = "none";
        }
    });
   
}
displayModal();
// fonction pour supprimer un projet 
function deleteProject(projectId, figureElement) {
    console.log(`Tentative de suppression du projet avec l'ID: ${projectId}`); // Ajout d'un log pour vérifier l'ID

    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Le projet avec l'id ${projectId} a été supprimé.`);
            console.log('Élément à supprimer:', figureElement); // Vérifie que l'élément existe
            // Supprimer l'élément du DOM
            if (figureElement) {
                figureElement.remove(); // Retirer l'élément du DOM
            } else {
                console.error("L'élément à supprimer n'a pas été trouvé.");
            }
            // Mettre à jour la galerie principale
            updateMainGallery(projectId);
        } else {
            console.error("Le delete a échoué. Code erreur:", response.status);
            alert("Erreur lors de la suppression du projet. Vérifiez si le projet existe.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression. Veuillez réessayer.");
    });
}    
// Fonction pour mettre à jour la galerie principale après suppression
function updateMainGallery(projectId) {
    const gallery = document.querySelector('.gallery');
    const workElement = gallery.querySelector(`[data-id='${projectId}']`);
 // Rechercher l'élément correspondant à l'ID du projet

    if (workElement) {
        workElement.remove(); // Supprimer l'élément de la galerie principale
    } else{
        console.error("L'élément à supprimer n'a pas été trouvé dans la galerie principale.");
    }
}
//gère les boutons de la modale 
function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";
        modal1.style.display = "none";
        resetFormFields(); // Reset les champs lorsque la modale est ouverte
        resetFileInput(); // Reset le champ de fichier
    });
    modalArrow.addEventListener("click", () => {
        resetFormFields();
        resetFileInput();
        modalAddWorks.style.display = "none";
        modal1.style.display = "flex";
    });
    modalAddClose.addEventListener("click", () => {
        resetFormFields();
        containerModal.style.display = "none";
    });
} 

displayAddModal();

//Event pour télécharger une image/ajouter un projet dans la modale
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

//chargement de la modale
modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("modalCategory").value;
    const imageFile = document.getElementById("file").files[0];

    if (!title || !category || !imageFile) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // Initialisez formData avant d'entrer dans le bloc try
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", imageFile); // Assurez-vous d'utiliser le bon nom de champ attendu

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${window.localStorage.getItem("token")}`
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Non autorisé. Veuillez vous connecter.");
            } else {
                throw new Error("Erreur lors de l'ajout du projet.");
            }
        }

        const data = await response.json();
        console.log("Projet ajouté:", data);

        displayModalWorks();
        displayWorks();
        resetFormFields();
        modalAddWorks.style.display = "none";
        modal1.style.display = "flex"; 
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet:", error);
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
            errorMessage.textContent = "Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.";
        } else {
            alert("Une erreur est survenue lors de l'ajout du projet. Veuillez réessayer.");
        }
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
    // Vérifier que le titre, la catégorie et l'image sont remplis
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";
    const isImageSelected = imageInput.files.length > 0;

      // Si tous les champs sont remplis, activer le bouton ; sinon, le désactiver
      btnValidForm.disabled = !(isTitleFilled && isCategorySelected && isImageSelected);
    

    // Activer ou désactiver le bouton "Valider" en fonction des champs remplis
      // Ajouter ou retirer la classe "valid" pour le style visuel
      if (!btnValidForm.disabled) {
        btnValidForm.classList.add("valid");
    } else {
        btnValidForm.classList.remove("valid");
    }
}

// Désactiver le bouton et réinitialiser les champs lorsque la modale s'ouvre
function displayAddModal() {
    modalBtn.addEventListener("click", () => {
        modalAddWorks.style.display = "flex";
        modal1.style.display = "none";
        resetFormFields(); // Réinitialiser les champs du formulaire
        btnValidForm.disabled = true; // Désactiver le bouton "Valider"
    });

    // Gérer la fermeture de la modale
    modalArrow.addEventListener("click", () => {
        resetFormFields();
        modalAddWorks.style.display = "none";
        modal1.style.display = "flex";
    });

    modalAddClose.addEventListener("click", () => {
        resetFormFields();
        containerModal.style.display = "none";
    });
}

// Ajout des écouteurs d'événements pour chaque champ du formulaire
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);
imageInput.addEventListener("change", checkFormValidity);


// Appeler displayAddModal pour mettre en place la modale et les règles de désactivation
displayAddModal();
