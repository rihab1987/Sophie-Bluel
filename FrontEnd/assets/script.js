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

// Fonction de déconnexion
function logout(event){
    event.preventDefault()// Empêche le comportement par défaut du lien (ne pas rediriger immédiatement)
    localStorage.clear() // Supprime le token et toutes les autres données du localstorage 
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
        return await response.json();// Retourne les catégoriesau format JSON  
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
        return await response.json();// Retourne les travaux au format JSON 
    } catch (error) {
        console.error("Erreur de chargement des travaux:", error);// Affiche l'erreur dans la console
        alert("Erreur de chargement des travaux. Veuillez réessayer.");// Affiche une alerte en cas d'erreur
        return []; // Renvoie un tableau vide en cas d'erreur
    }
}
// Remplir la liste déroulante des catégories dans le formulaire d'ajout 
async function populateCategorySelect() {
    const categories = await getCategories();// Récupère les catégories via la fonction get catégories
    const select = document.getElementById("modalCategory");// Sélectionne la liste déroulante de catégories dans la modale
    select.innerHTML = '';// vide la liste déroulante
    const defaultOption = document.createElement("option");// Crée une option par défaut
    defaultOption.value = "";// Aucune valeur par défaut
    defaultOption.selected = true;// Définit cette option comme sélectionnée par défaut
    defaultOption.disabled = true;// Désactive l'option par défaut
    select.appendChild(defaultOption);// Ajoute l'option par défaut à la liste déroulante
    categories.forEach(category => {// Parcourt chaque catégorie et l'ajoute à la liste déroulante 
    const option = document.createElement("option");// Crée une nouvelle option pour la catégorie
    option.value = category.id;// Définit l'ID de la catégorie comme valeur
    option.textContent = category.name;// Définit le nom de la catégorie comme texte 
    select.appendChild(option);// Ajoute l'option à la liste déroulante
    });
}
// Appel des fonctions pour initialiser les éléments avec les catégories
createFilterButtons();// Crée les boutons de filtre 
populateCategorySelect();// Remplit la liste déroulante des catégories 

// Fonction pour afficher les travaux sur la page principale
async function displayWorks(filter = 'tous') {
    let works = await getWorks(); // Récupérer les travaux depuis l'API
    gallery.innerHTML = ''; // Vide la galerie avant d'afficher de nouveaux travaux
    let filteredWorks = works;// si aucun filtre, tous les travaux sont affichés
    if (filter !== 'tous') { // cette condition vérifie si un filtre spécifique est appliqué (par catégorie)
 // Filtre les travaux par catégorie si un filtre est appliqué
        filteredWorks = []; //initialise un tableau vide pour stocker les travaux qui correspondent au filtre appliquée
        for(let i = 0;i < works.length;i++) {// Boucle for pour parcourir tous les travaux récupérés dans le tableau works
            const work = works[i];// A chaque itération de la boucle, on récupère un travail spécifique à partir du tableau works à l'index i
            if (work.category && work.category.name.toLowerCase()=== filter.toLowerCase()) {// la condition vérifie si le travail a bien une catégorie
                //Si le nom de la catégorie du travail correspond au filtre // la condition est vrai, le travail est ajouté aux résultats filtrés
                filteredWorks.push(work) // Si la condition est vrai on ajoute le travail au tableau "filteredWorks" à l'aide de la méthode push()
            }

        }

    }

    for (let work of filteredWorks) {// Parcourt les travaux  filtrés et les ajoute à la galerie
        let figure = document.createElement('figure');// Crée un élément <figure> pour chaque travail
        figure.setAttribute('data-id',work.id);// Ajoute l'ID du travail comme attribut data-id
        let img = document.createElement('img');// Crée un élément <img> pour l'image du travail
        img.src = work.imageUrl;// Définit l'url de l'image
        img.alt = work.title;// Ajoute un texte alternatif à l'image
        let figcaption = document.createElement('figcaption');// Crée une légende pour chaque image
        figcaption.textContent = work.title;// Définit le texte de la légende comme étant le titre du travail
        figure.appendChild(img);// Ajoute l'image à l'élément <figure>
        figure.appendChild(figcaption);// Ajoute la légende à l'élément <figure>
        gallery.appendChild(figure);// Ajoute l'élément <figure> à la galerie
    }
    checkLoginStatus(); // Vérifier le statut de connexion de l'utilisateur après l'affichage des travaux
}
// Création des boutons de filtre avec les catégories récupérées
async function createFilterButtons() {
    const categories = await getCategories(); // Récupère les catégories via la fonction getcategories
    buttonContainer.innerHTML = ''; // Réinitialise le conteneur des boutons

// fonction pour définir le bouton actif pour qu'elle change du couleur au moment du click 
    function setActiveButton(activeButton){
        const buttons = buttonContainer.querySelectorAll('button');// Sélectionne tous les boutons 
        buttons.forEach(button =>button.classList.remove('button-active'));// Retire la classe active de tous les boutons 
        activeButton.classList.add('button-active');// Ajoute la classe active uniqument au bouton cliqué
    }
// Ajouter le bouton "Tous"
    const allButton = document.createElement('button');// Crée un bouton "tous"
    allButton.id = 'filter-all'; // Définit l'ID du bouton 
    allButton.classList.add('button-active');
    allButton.textContent = 'Tous';// Définit le texte du bouton 
    allButton.addEventListener('click', () => {// Ajoute un écouteur d'événement pour filtrer tous les travaux
        displayWorks('tous');// Affiche tous les travaux 
        setActiveButton(allButton);// Définit ce bouton comme actif 
    });
    buttonContainer.appendChild(allButton);// Ajoute le bouton "tous" au conteneur 
// Créer des boutons pour chaque catégorie
      categories.forEach(({ id, name }) => {// Parcourt chaque catégorie
        let button = document.createElement('button');// Crée un bouton pour la catégorie
        button.id = `filter-${name.toLowerCase().replace(/ /g, '-')}`;// Définit l'ID du bouton en remplaçant les espaces par des tirets
        button.textContent = name;// Définit le texte du bouton comme le nom de la catégorie
        button.addEventListener('click', () =>{ // Ajoute un écouteur d'événement pour le clic
            displayWorks(name); // Ajoute un écouteur d'événement pour filtrer les travaux par catégories
            setActiveButton(button); // Définit ce bouton comme actif
        });
        buttonContainer.appendChild(button); // Ajoute chaque bouton de catégories au conteneur
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
// Gérer l'affichage des filtres et du bouton "modifier"(gérer dynamiquement l'interface utilisateur en fonction de l'état de connexion)

     const filterContainer = document.querySelector('.button-container'); // Sélectionne le conteneur des filtres
     const modifyButton = document.getElementById('openGalleryBtn'); // Sélectionne le bouton "modifier"
// Si l'utilisateur est connecté 
     if (isLoggedIn) {
         filterContainer.style.display = 'none'; // Cacher les filtres si l'utilisateur est connecté
         openGalleryBtn.style.display = 'inline-block'; // Afficher le bouton modifier
// Si l'utlisateur n'est pas connecté 
     } else {
         filterContainer.style.display = 'flex' ; // Afficher les filtres si l'utilisateur n'est pas connecté
         modifyButton.style.display = 'none'; // Cacher le bouton modifier
     }
// Ajouter la classe logged-in au body si l'utilisateur est connecté

     if (isLoggedIn) {
        document.body.classList.add('logged-in');// Appliquer des styles spécifiques pour les utilisateurs connectés(afficher des éléments réservés)
    } else {
        document.body.classList.remove('logged-in');// Retirer les styles pour utilisateurs non connectés 
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
