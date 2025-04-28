document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments du DOM nécessaires pour la gestion du thème
    const themeToggle = document.getElementById('theme-toggle'); 
    const themeIcon = document.getElementById('theme-icon'); 
    const favicon = document.getElementById('favicon'); 
    const logo = document.getElementById('logo');
    const logoFooter = document.getElementById('logoFooter');
    const html = document.documentElement; 

    // On commence par récupérer le thème depuis localStorage, ou si inexistant, utiliser la préférence du système
    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // On applique le thème sur l'élément HTML (attribut "data-theme")
    html.setAttribute('data-theme', currentTheme);

    // Mise à jour des assets (favicon, logo, etc.) en fonction du thème
    updateAssets(currentTheme);

    // Si le bouton de changement de thème existe, on ajoute un gestionnaire d'événements pour le clic
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Si le thème actuel est "dark", on passe à "light", et inversement
            const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            // On met à jour l'attribut "data-theme" sur l'élément HTML
            html.setAttribute('data-theme', newTheme);
            // On sauvegarde ce nouveau thème dans le localStorage pour qu'il soit persistant
            localStorage.setItem('theme', newTheme);
            // On met à jour les assets en fonction du nouveau thème
            updateAssets(newTheme);
        });
    }

    // Fonction pour mettre à jour les assets (favicon, logo, etc.)
    function updateAssets(theme) {
        // Si un des éléments nécessaires est manquant, on arrête la fonction
        if (!themeIcon || !favicon || !logo || !logoFooter) return;

        // Si le thème est "dark", on applique les assets du thème sombre
        if (theme === 'dark') {
            themeIcon.textContent = 'brightness_4'; // Lune
            favicon.href = './images/dark-favicon.png'; // Favicon sombre
            logo.src = './images/dark-logo.png'; // Logo sombre
            logoFooter.src = './images/dark-logo.png'; // Logo sombre dans le footer
        } else {
            // Sinon, c'est le thème "light" et on applique les assets du thème clair
            themeIcon.textContent = 'brightness_7'; // Soleil
            favicon.href = './images/light-favicon.png'; // Favicon clair
            logo.src = './images/light-logo.png'; // Logo clair
            logoFooter.src = './images/light-logo.png'; // Logo clair dans le footer
        }
    }

    // Fonction pour gérer le scroll horizontal dans le conteneur des cartes
    const cardsContainer = document.querySelector('.cards'); 
    const leftButton = document.querySelector('.left-button'); 
    const rightButton = document.querySelector('.right-button');
    const cardWidth = 320; // Largeur d'une carte + marges éventuelles
    let scrollAmount = 0; // Compteur de la position du scroll

    // Si le conteneur et les boutons existent, on ajoute des événements pour les flèches
    if (cardsContainer && leftButton && rightButton) {
        // Action pour faire défiler vers la gauche
        leftButton.addEventListener('click', () => {
            // On empêche de scroller avant le début du conteneur
            scrollAmount = Math.max(scrollAmount - cardWidth, 0);
            cardsContainer.scrollTo({
                left: scrollAmount,
                behavior: 'smooth' // Transition fluide
            });
        });

        // Action pour faire défiler vers la droite
        rightButton.addEventListener('click', () => {
            // On calcule la limite maximale de scroll
            const maxScroll = cardsContainer.scrollWidth - cardsContainer.clientWidth;
            // On empêche de scroller après la fin du conteneur
            scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
            cardsContainer.scrollTo({
                left: scrollAmount,
                behavior: 'smooth' // Transition fluide
            });
        });
    }

    // Initialisation des carrousels d'images dans chaque carte
    document.querySelectorAll('.image-carousel').forEach(carousel => {
        const images = carousel.querySelectorAll('img'); // Sélectionne toutes les images du carrousel
        let currentIndex = 0; // Index de l'image actuellement affichée

        // Si aucune image n'est présente dans le carrousel, on arrête la fonction
        if (images.length === 0) return;

        // Création du bouton gauche du carrousel
        const leftBtn = document.createElement('button');
        leftBtn.className = 'card-nav-button card-left-button'; // Classe du bouton
        leftBtn.innerHTML = '&#10094;'; // Flèche gauche
        // Gestion du clic sur le bouton gauche
        leftBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length; // Navigation circulaire
            updateCarousel(images, currentIndex);
        });

        // Création du bouton droit du carrousel
        const rightBtn = document.createElement('button');
        rightBtn.className = 'card-nav-button card-right-button'; // Classe du bouton
        rightBtn.innerHTML = '&#10095;'; // Flèche droite
        // Gestion du clic sur le bouton droit
        rightBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length; // Navigation circulaire
            updateCarousel(images, currentIndex);
        });

        // Ajout des boutons au carrousel dans le DOM
        carousel.appendChild(leftBtn);
        carousel.appendChild(rightBtn);

        // Affichage de la première image du carrousel
        updateCarousel(images, currentIndex);
    });

    // Fonction pour déplacer les images dans le carrousel
    function updateCarousel(images, index) {
        // On met à jour la position de chaque image du carrousel en fonction de l'index actuel
        images.forEach((img, i) => {
            img.style.transform = `translateX(${-index * 100}%)`; // Déplacement horizontal
            img.style.transition = 'transform 0.5s ease-in-out'; 
        });
    }
});