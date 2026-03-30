// app.js
window.APS = window.APS || { state: {} };

window.APS.app = {
    init: () => {
        const sidebar = document.getElementById('sidebar-container');
        const main = document.querySelector('main');
        
        // Escondemos el menú lateral cuando estamos en la pantalla de inicio
        if (sidebar) sidebar.innerHTML = '';
        if (main) main.classList.remove('lg:ml-72');

        // Disparamos la nueva pantalla de inicio profesional
        if (window.APS.landing && typeof window.APS.landing.init === 'function') {
            window.APS.landing.init();
        } else {
            console.error("No se pudo cargar modules_landing.js. Revisa tu index.html");
        }
    }
};

// Arrancamos la app cuando carga la página
document.addEventListener('DOMContentLoaded', window.APS.app.init);