// app.js
window.APS = window.APS || { state: {} };

window.APS.app = {
    init: () => {
        const sidebar = document.getElementById('sidebar-container');
        const main = document.querySelector('main');
        
        if (sidebar) sidebar.innerHTML = '';
        
        // CORRECCIÓN: Solo apagamos el margen izquierdo, sin borrar los paddings
        if (main) {
            main.classList.remove('lg:ml-72');
        }

        if (window.APS.landing && typeof window.APS.landing.init === 'function') {
            window.APS.landing.init();
        } else {
            console.error("No se pudo cargar modules_landing.js. Revisa tu index.html");
        }
    }
};

document.addEventListener('DOMContentLoaded', window.APS.app.init);