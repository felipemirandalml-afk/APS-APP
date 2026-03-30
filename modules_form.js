window.APS.form = {
    getModuleDefinition: (moduleName = window.APS.state.module) => {
        return window.APS.formModules?.[moduleName] || window.APS.formModules?.cardiovascular;
    },

    render: (moduleName = window.APS.state.module, typeName = window.APS.state.type) => {
        const moduleDef = window.APS.form.getModuleDefinition(moduleName);
        if (!moduleDef) return;

        const current = window.APS.state || {};
        const contextChanged = current.module !== moduleName || current.type !== typeName || !current.__initialized;

        if (contextChanged) {
            const initial = moduleDef.getInitialState(typeName);
            window.APS.state = {
                ...initial,
                module: moduleName,
                type: typeName,
                activeTab: moduleDef.getTabs()[0].id,
                show_modal: false,
                __initialized: true
            };
        }

        const tabs = moduleDef.getTabs();
        const sidebarContainer = document.getElementById('sidebar-container');
        const appContainer = document.getElementById('app-container');
        const main = document.querySelector('main'); // Buscamos el main

        // NUEVO: Agregamos el margen izquierdo en pantallas grandes para que el menú no tape
        if (main) {
            main.className = 'w-full min-h-screen transition-all duration-300 lg:ml-72';
        }

        sidebarContainer.innerHTML = `
            <aside class="w-full lg:w-72 lg:fixed lg:top-0 lg:bottom-0 bg-slate-900 text-white flex flex-col z-50 overflow-hidden shadow-2xl">
                <div class="p-8 border-b border-slate-800">
                    <button onclick="window.APS.app.init()" class="text-left group transition-all hover:scale-105 origin-left w-full">
                        <h1 class="font-display font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">APS COPILOT</h1>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 group-hover:text-white transition-colors">Volver al Inicio</p>
                    </button>
                    <div class="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                         <p class="text-xs text-slate-300 font-bold tracking-widest uppercase">${moduleDef.sidebarSubtitle}</p>
                    </div>
                </div>
                <nav class="flex-grow py-6 overflow-y-auto">
                    <ul class="space-y-1 px-4">
                        ${tabs.map(tab => window.APS.form.createNavItem(tab.id, tab.label, tab.sub)).join('')}
                    </ul>
                </nav>
            </aside>
        `;

        appContainer.innerHTML = `
            ${tabs.map(tab => `
                <div id="tab-${tab.id}" class="tab-content ${window.APS.state.activeTab === tab.id ? '' : 'hidden'}">
                    ${moduleDef.renderTab(tab.id)}
                </div>
            `).join('')}
            ${window.APS.form.renderModal()}
        `;

        window.APS.form.bindEvents(moduleDef);
        window.APS.form.updateOutput();
    },

    createNavItem: (id, label, sub) => {
        const active = window.APS.state.activeTab === id;
        return `
            <li>
                <button data-tab="${id}" class="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}">
                    <div class="text-left">
                        <p class="text-sm font-bold leading-none">${label}</p>
                        <p class="text-xs mt-1 opacity-60 font-medium">${sub}</p>
                    </div>
                </button>
            </li>
        `;
    },

    renderModal: () => `
        <div id="note-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" id="modal-overlay"></div>
            <div class="bg-white rounded-[40px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative z-[110] border border-slate-200">
                <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 class="text-xs font-black tracking-[0.2em] uppercase text-slate-500">Preview Reporte Clínico</h2>
                    <button id="btn-close-modal" class="text-slate-300 hover:text-red-500 transition-colors p-2 text-3xl font-light">&times;</button>
                </div>
                <div class="p-8 overflow-y-auto bg-slate-50/30">
                    <pre id="full-note-display" class="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-700 bg-white p-8 rounded-3xl border border-slate-200 shadow-inner min-h-[400px]"></pre>
                </div>
                <div class="p-8 border-t border-slate-100 flex justify-center gap-4">
                    <button id="btn-copy-modal" class="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-12 rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">Copiar y Cerrar</button>
                </div>
            </div>
        </div>
    `,

    bindEvents: (moduleDef) => {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.APS.state.activeTab = btn.getAttribute('data-tab');
                window.APS.form.render();
            });
        });

        const app = document.getElementById('app-container');
        
        // NUEVO: Validamos si el evento global ya existe para evitar la fuga de memoria
        if (!window.APS.form.__globalInputBound) {
            app.addEventListener('input', (e) => {
                const { name, value, type, checked } = e.target;
                if (!name) return;
                window.APS.state[name] = type === 'checkbox' ? checked : value;

                // Lógica genérica compartida
                if (name === 'peso' || name === 'talla') {
                    window.APS.state.imc = window.APS.helpers.calculateBMI(window.APS.state.peso, window.APS.state.talla);
                }

                // IMPORTANTE: Obtenemos el módulo actual en tiempo real
                const currentModuleDef = window.APS.form.getModuleDefinition();

                // Hook: Dejar que el módulo actual maneje sus propias reglas
                if (currentModuleDef && typeof currentModuleDef.onStateChange === 'function') {
                    currentModuleDef.onStateChange(name, window.APS.state);
                }

                if (currentModuleDef && typeof currentModuleDef.onInput === 'function') {
                    currentModuleDef.onInput(name);
                }
                
                window.APS.form.updateOutput();
            });
            // Marcamos que ya amarramos este evento para que no se duplique jamás
            window.APS.form.__globalInputBound = true; 
        }

        moduleDef.bindEvents?.();

        const btnOpen = document.getElementById('btn-toggle-modal');
        const btnClose = document.getElementById('btn-close-modal');
        const overlay = document.getElementById('modal-overlay');
        const modal = document.getElementById('note-modal');
        const toggleModal = (show) => {
            window.APS.state.show_modal = show;
            if (show) { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
            else { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; }
        };

        if (btnOpen) btnOpen.addEventListener('click', () => toggleModal(true));
        if (btnClose) btnClose.addEventListener('click', () => toggleModal(false));
        if (overlay) overlay.addEventListener('click', () => toggleModal(false));

        const btnCopyMain = document.getElementById('btn-copy-main');
        if (btnCopyMain) btnCopyMain.addEventListener('click', () => {
            const text = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(text);
            const originalHtml = btnCopyMain.innerHTML;
            btnCopyMain.innerHTML = '<span class="text-xl">✅</span> ¡COPIADO!';
            setTimeout(() => btnCopyMain.innerHTML = originalHtml, 1500);
        });

        const btnCopyMod = document.getElementById('btn-copy-modal');
        if (btnCopyMod) btnCopyMod.addEventListener('click', () => {
            const text = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(text);
            toggleModal(false);
        });
    },

    updateOutput: () => {
        const data = window.APS.state;
        const moduleDef = window.APS.form.getModuleDefinition();

        const imcVal = document.getElementById('imc-display-val');
        const imcDesc = document.getElementById('imc-desc');
        if (imcVal) imcVal.innerText = data.imc || '--';
        if (imcDesc) {
            const cat = window.APS.helpers.getIMCCategory(data.imc, data.edad);
            imcDesc.innerText = cat.label;
            imcDesc.className = `text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight mt-1 ${cat.color === 'red' ? 'bg-red-500' : (cat.color === 'yellow' ? 'bg-amber-400' : 'bg-green-400')}`;
        }

        moduleDef.updateOutput?.(data);

        const modalNote = document.getElementById('full-note-display');
        if (modalNote) modalNote.innerText = window.APS.generator.generateText(data);
    }
};
