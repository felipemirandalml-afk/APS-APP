// modules_landing.js
// Gestión de la pantalla de inicio profesional y minimalista

window.APS.landing = {
    // Inicialización
    init: () => {
        const app = document.getElementById('app-container');
        app.innerHTML = window.APS.landing.render();
        window.APS.landing.bindEvents();
    },

    // Generación del HTML con tarjetas completamente clickables (sin botones)
    render: () => {
        // Clases base para todas las tarjetas: interactivas, con sombra, transición y cursor de mano
        const cardBaseClasses = "bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-900/5 group relative overflow-hidden flex flex-col h-full transform transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300 select-none";
        
        // Clases para los contenedores de los íconos SVGs
        const iconContainerClasses = "w-32 h-32 mx-auto mb-8 rounded-[32px] flex items-center justify-center transition-colors duration-300";

        return `
            <div class="min-h-screen bg-slate-50 font-sans p-6 md:p-12 lg:p-16 animate-in fade-in duration-700">
                <header class="text-center mb-16 space-y-4">
                    <div class="inline-block p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
                        <h1 class="font-display font-black text-4xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">APS COPILOT</h1>
                        <p class="text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Asistente de Registro Clínico v2.0</p>
                    </div>
                    <p class="text-slate-600 max-w-lg mx-auto leading-relaxed text-sm">Gestione el cuidado del paciente con herramientas integradas de registro y análisis clínico.</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto pb-24">
                    
                    <div data-module="morbilidad" class="${cardBaseClasses}">
                        <div class="p-8 flex-grow text-center flex flex-col justify-center">
                            <div class="${iconContainerClasses} bg-emerald-50 group-hover:bg-emerald-100">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-16 h-16 text-emerald-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                            <h3 class="font-display text-2xl font-black text-slate-950 mb-4 tracking-tight">Morbilidad</h3>
                            <p class="text-slate-500 text-sm leading-relaxed font-medium">Manejo integral de patologías agudas y crónicas; generación eficiente de notas clínicas.</p>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 h-2 bg-emerald-500 rounded-b-full transition-all duration-300 group-hover:h-3"></div>
                    </div>

                    <div data-module="salud-mental" class="${cardBaseClasses}">
                        <div class="p-8 flex-grow text-center flex flex-col justify-center">
                            <div class="${iconContainerClasses} bg-blue-50 group-hover:bg-blue-100">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-16 h-16 text-blue-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                                </svg>
                            </div>
                            <h3 class="font-display text-2xl font-black text-slate-950 mb-4 tracking-tight">Salud Mental</h3>
                            <p class="text-slate-500 text-sm leading-relaxed font-medium">Seguimiento de programas, tamizaje emocional y planificación terapéutica de pacientes.</p>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 h-2 bg-blue-500 rounded-b-full transition-all duration-300 group-hover:h-3"></div>
                    </div>

                    <div data-module="cardiovascular" class="${cardBaseClasses}">
                        <div class="p-8 flex-grow text-center flex flex-col justify-center">
                            <div class="${iconContainerClasses} bg-red-50 group-hover:bg-red-100">
                                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-16 h-16 text-red-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </div>
                            <h3 class="font-display text-2xl font-black text-slate-950 mb-4 tracking-tight">Cardiovascular</h3>
                            <p class="text-slate-500 text-sm leading-relaxed font-medium">Control de metas terapéuticas (HEARTS), estratificación de RCV y gestión de exámenes.</p>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 h-2 bg-red-500 rounded-b-full transition-all duration-300 group-hover:h-3"></div>
                    </div>

                </div>
            </div>
        `;
    },

    // Asignación de eventos optimizada para tarjetas completas
    bindEvents: () => {
        const app = document.getElementById('app-container');
        app.addEventListener('click', (e) => {
            // CORRECCIÓN IMPORTANTE: Buscamos el ancestro más cercano que tenga el atributo data-module.
            // Esto asegura que el clic funcione sin importar si tocan el ícono, el título o el texto.
            const card = e.target.closest('[data-module]');
            
            if (card) {
                const moduleName = card.getAttribute('data-module');
                // Asumimos que window.APS.form.render existe en el contexto global
                // como se definió en instrucciones previas.
                window.APS.form.render(moduleName, 'control'); 
            }
        });
    }
};
