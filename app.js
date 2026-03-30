// app.js
window.APS = window.APS || { state: {} };

window.APS.app = {
    init: () => {
        const sidebar = document.getElementById('sidebar-container');
        const main = document.querySelector('main');
        
        if (sidebar) sidebar.innerHTML = '';
        if (main) main.className = 'w-full min-h-screen transition-all duration-300'; // Reseteamos clases en el inicio

        if (window.APS.landing && typeof window.APS.landing.init === 'function') {
            window.APS.landing.init();
        } else {
            console.error("No se pudo cargar modules_landing.js. Revisa tu index.html");
        }
    }
};

document.addEventListener('DOMContentLoaded', window.APS.app.init);