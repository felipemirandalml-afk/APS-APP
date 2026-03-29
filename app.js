// app.js
window.APS.app = {
    init: () => {
        const container = document.getElementById('app-container');
        const sidebar = document.getElementById('sidebar-container');
        const main = document.querySelector('main');

        const renderHome = () => {
            if (sidebar) sidebar.innerHTML = '';
            if (main) main.classList.remove('lg:ml-72'); // Reset margin if no sidebar

            container.innerHTML = `
                <div class="max-w-4xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-700">
                    <header class="text-center mb-16">
                        <div class="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40">
                            <span class="text-4xl">🩺</span>
                        </div>
                        <h1 class="font-display text-4xl font-extrabold text-slate-900 tracking-tighter sm:text-5xl">APS COPILOT</h1>
                        <p class="text-slate-500 mt-4 text-lg font-medium max-w-xl mx-auto opacity-70">Plataforma inteligente de apoyo a la toma de decisiones clínicas y generación de reportes para atención primaria.</p>
                    </header>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${window.APS.app.moduleCard('cardiovascular', '❤️', 'Cardiovascular', 'Control PSCV - HEARTS')}
                        ${window.APS.app.moduleCard('salud-mental', '🧠', 'Salud Mental', 'Evaluación Depresión/Ansiedad')}
                        ${window.APS.app.moduleCard('morbilidad', '🩺', 'Morbilidad', 'Respiratorios & General')}
                    </div>
                </div>
            `;
        };

        window.APS.app.moduleCard = (id, icon, title, subtitle) => {
            return `
                <button onclick="window.APS.app.selectType('${id}', '${title}')" class="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 transition-all text-center group">
                    <div class="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">${icon}</div>
                    <h3 class="font-display font-black text-slate-800 text-lg group-hover:text-blue-600">${title}</h3>
                    <p class="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">${subtitle}</p>
                </button>
            `;
        };

        window.APS.app.selectType = (id, moduleName) => {
            container.innerHTML = `
                <div class="max-w-2xl mx-auto py-20 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div class="text-center mb-12">
                         <button onclick="window.APS.app.init()" class="mb-8 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-widest flex items-center gap-2 mx-auto justify-center">
                            ← Volver al Portal de Módulos
                         </button>
                         <h2 class="font-display text-3xl font-extrabold text-slate-900">Tipo de Atención: ${moduleName}</h2>
                         <p class="text-slate-500 mt-2">Personalice el generador de nota clínica</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button onclick="window.APS.app.startApp('${id}', 'ingreso')" class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:bg-slate-50 text-center transition-all group">
                             <div class="text-2xl mb-2 opacity-40">📄</div>
                             <p class="text-sm font-black text-slate-800">Ingreso Nuevo</p>
                             <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Primer control anual</p>
                        </button>
                        <button onclick="window.APS.app.startApp('${id}', 'control')" class="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:bg-slate-50 text-center transition-all group">
                             <div class="text-2xl mb-2 opacity-40">🔄</div>
                             <p class="text-sm font-black text-slate-800">Control de Seguimiento</p>
                             <p class="text-[10px] text-slate-400 font-bold uppercase mt-1">Crónicos & Compensados</p>
                        </button>
                    </div>
                </div>
            `;
        };

        window.APS.app.startApp = (moduleName, typeName) => {
            if (main) main.classList.add('lg:ml-72'); // Aplica margen si hay sidebar
            window.APS.form.render(moduleName, typeName);
        };

        renderHome();
    }
};

document.addEventListener('DOMContentLoaded', window.APS.app.init);