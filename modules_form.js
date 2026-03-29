// modules_form.js
window.APS.form = {
    render: (moduleName, typeName) => {
        window.APS.state = { 
            module: moduleName, 
            type: typeName, 
            show_exam: false, 
            rcv: 'Bajo', 
            diagnostico_hta: 'pendiente',
            show_pa2: false, 
            show_pa3: false,
            show_danio: false,
            examen_fisico: '',
            peso: 0,
            talla: 0,
            cintura: 0,
            hallazgo_edema: false,
            hallazgo_edema_tipo: 'bilateral',
            hallazgo_crepitos: false,
            hallazgo_crepitos_tipo: 'bilateral',
            hallazgo_acantosis: false,
            // Exámenes iniciales
            ex_hematocrito: true,
            ex_orina: true,
            ex_glicemia: true,
            ex_electrolitos: true,
            ex_lipidos: true,
            ex_creatinina: true,
            ex_uricemia: true,
            ex_ecg: true,
            ex_rac: false,
            ex_hba1c: false,
            ex_fo: false,
            ex_tsh: false,
            ex_calcio: false,
            manejo_hta_paso: 0,
            // Riesgo Cardiovascular
            dm2: false,
            ecv_ateroesclerotica: false,
            erc_avanzada: false,
            albuminuria_ms: false,
            hta_refractaria: false,
            ldl_190: false,
            hipercolesterolemia_familiar: false,
            tabaquismo: false,
            hta: false,
            dislipidemia: false,
            af_ecv_prematura: false,
            ante_obstetricos: false,
            menopausia_precoz: false,
            enf_autoinmune: false,
            vih: false,
            trastorno_mental: false,
            cac_elevado: false,
            // UI State
            show_modal: false
        };
        
        const container = document.getElementById('app-container');
        const isCV = moduleName === 'cardiovascular';
        const isIngreso = typeName === 'ingreso';
        
        container.innerHTML = `
            <div class="max-w-4xl mx-auto pb-32">
                <!-- FORMULARIO ÚNICO -->
                <form id="clinical-form" class="space-y-10">
                    <h2 class="text-2xl font-black border-b pb-2 text-indigo-700 font-mono italic">🩺 Datos & Antropometría</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-sm font-bold text-gray-400">
                        <div>Edad<input type="number" name="edad" value="0" class="w-full border-2 p-3 rounded-xl text-base text-indigo-900 focus:border-indigo-300 outline-none"></div>
                        <div>Sexo<select name="sexo" class="w-full border-2 p-3 rounded-xl text-base text-indigo-900 focus:border-indigo-300 outline-none"><option value="F">Fem</option><option value="M">Masc</option></select></div>
                        <div>IMC<input type="text" id="imc-display" readonly class="w-full border-2 p-3 rounded-xl bg-gray-50 font-mono text-base text-indigo-900" value="--"></div>
                        <div>Peso (kg)<input type="number" name="peso" class="w-full border-2 p-3 rounded-xl text-base text-indigo-900 focus:border-indigo-300 outline-none"></div>
                        <div>Talla (cm)<input type="number" name="talla" class="w-full border-2 p-3 rounded-xl text-base text-indigo-900 focus:border-indigo-300 outline-none"></div>
                        <div>Cintura (cm)<input type="number" name="cintura" class="w-full border-2 p-3 rounded-xl text-base text-indigo-900 focus:border-indigo-300 outline-none"></div>
                    </div>

                    ${isCV ? `
                    <!-- RCV DETALLADO -->
                    <div id="rcv-section" class="bg-indigo-50 p-10 rounded-[48px] border-2 border-indigo-200">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="font-black text-indigo-900 uppercase text-xs tracking-widest">RCV Chileno Automático</h3>
                            <div id="rcv-badge" class="px-6 py-2 rounded-full font-black text-xs text-white bg-green-500 shadow-xl uppercase transition-all">BAJO</div>
                        </div>

                        <div class="space-y-8">
                            <div class="space-y-4">
                                <p class="text-[10px] text-red-500 font-black uppercase tracking-widest border-b border-red-100 pb-1">Criterios de Riesgo Alto Directo</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs font-bold text-indigo-900">
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="dm2" class="w-5 h-5"> Diabetes Mellitus tipo 2</label>
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="ecv_ateroesclerotica" class="w-5 h-5"> Enfermedad Cardiovascular Ateroesclerótica</label>
                                    <label class="flex items-center gap-3 cursor-pointer text-red-700"><input type="checkbox" name="erc_avanzada" class="w-5 h-5"> ERC avanzada o etapa 3-5</label>
                                    <label class="flex items-center gap-3 cursor-pointer text-red-700"><input type="checkbox" name="albuminuria_ms" class="w-5 h-5"> Albuminuria moderada o severa (RAC > 30)</label>
                                    <label class="flex items-center gap-3 cursor-pointer text-red-700"><input type="checkbox" name="hta_refractaria" class="w-5 h-5"> Hipertensión Arterial Refractaria</label>
                                    <label class="flex items-center gap-3 cursor-pointer text-red-700"><input type="checkbox" name="ldl_190" class="w-5 h-5"> Dislipidemia severa (LDL > 190 mg/dL)</label>
                                    <label class="flex items-center gap-3 cursor-pointer text-red-700"><input type="checkbox" name="hipercolesterolemia_familiar" class="w-5 h-5"> Hipercolesterolemia familiar</label>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <p class="text-[10px] text-indigo-400 font-black uppercase tracking-widest border-b border-indigo-100 pb-1">Otros Factores y Modificadores</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs font-bold text-indigo-700">
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="hta" class="w-5 h-5"> Hipertensión Arterial Diagnosticada</label>
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="dislipidemia" class="w-5 h-5"> Dislipidemia Diagnosticada</label>
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="tabaquismo" class="w-5 h-5"> Tabaquismo Activo</label>
                                    <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="af_ecv_prematura" class="w-5 h-5"> Antecedente familiar ECV prematura</label>
                                </div>
                            </div>
                        </div>
                        <div id="rcv-summary" class="mt-8 text-xs font-semibold text-indigo-900 border-l-4 border-indigo-300 pl-6 py-4 bg-white/40 rounded-r-3xl italic shadow-inner">Calculando fundamento clínico...</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- ALGORITMO HEARTS -->
                        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                            <div class="flex justify-between items-center border-b border-gray-50 pb-4">
                                <h3 class="font-black text-indigo-700 uppercase text-xs tracking-widest italic">Manejo HEARTS</h3>
                                <select name="manejo_hta_paso" class="text-xs font-bold border-2 rounded-xl p-2 bg-indigo-50 text-indigo-800 outline-none transition-all focus:border-indigo-300">
                                    <option value="0">Paso 0: S/ fármacos</option>
                                    <option value="1">Paso 1: Biterapia inicial</option>
                                    <option value="2">Paso 2: Biterapia plenas</option>
                                    <option value="3">Paso 3: Triple terapia</option>
                                    <option value="4">Paso 4: HTA Resistente</option>
                                </select>
                            </div>
                            <div id="hearts-feedback" class="space-y-4">
                                <div class="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <p id="hearts-suggestion" class="text-sm text-indigo-900 font-medium leading-relaxed italic">Sugerencia clínica...</p>
                                </div>
                                <div class="flex justify-between items-center text-[10px] font-black text-indigo-500 uppercase">
                                    <span>Control:</span>
                                    <span id="hearts-freq" class="bg-white px-3 py-1 rounded-lg shadow-sm border border-indigo-100">PRÓX.</span>
                                </div>
                            </div>
                        </div>

                        <!-- EXAMEN FÍSICO RÁPIDO -->
                        <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                            <h3 class="font-black text-indigo-700 uppercase text-xs tracking-widest italic border-b border-gray-50 pb-4">Examen Físico</h3>
                            <textarea name="examen_fisico" placeholder="Obs. adicionales..." class="w-full border-2 border-gray-50 p-4 rounded-2xl h-20 text-xs font-semibold outline-none focus:border-indigo-100"></textarea>
                            <div class="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase">
                                <label class="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors"><input type="checkbox" name="hallazgo_edema" class="w-4 h-4"> Edema</label>
                                <label class="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors"><input type="checkbox" name="hallazgo_crepitos" class="w-4 h-4"> Crépitos</label>
                                <label class="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors"><input type="checkbox" name="hallazgo_acantosis" class="w-4 h-4"> Acantosis</label>
                            </div>
                        </div>
                    </div>

                    <div id="hta-subflow" class="bg-blue-50 p-10 rounded-[48px] border-2 border-blue-200">
                        <div class="flex justify-between items-center mb-8 border-b border-blue-100 pb-4">
                            <h3 class="font-black text-blue-900 uppercase text-xs tracking-widest">Presión Arterial</h3>
                            <span id="final-pa-badge" class="bg-white text-blue-900 px-4 py-1 rounded-full font-black font-mono text-xl shadow-md">--/--</span>
                        </div>
                        <div id="pa-container" class="space-y-6 max-w-lg mx-auto">
                             <div class="flex gap-4">
                                 <input type="number" name="pa1_s" placeholder="PAS" class="w-1/2 border-2 p-6 rounded-[24px] font-black text-3xl text-center outline-none focus:border-blue-400 shadow-sm">
                                 <input type="number" name="pa1_d" placeholder="PAD" class="w-1/2 border-2 p-6 rounded-[24px] font-black text-3xl text-center outline-none focus:border-blue-400 shadow-sm">
                             </div>
                             <div id="pa2-field" class="hidden flex gap-4">
                                 <input type="number" name="pa2_s" placeholder="PAS 2" class="w-1/2 border-2 p-6 rounded-[24px] font-black text-3xl text-center outline-none focus:border-blue-400 shadow-sm bg-white/50">
                                 <input type="number" name="pa2_d" placeholder="PAD 2" class="w-1/2 border-2 p-6 rounded-[24px] font-black text-3xl text-center outline-none focus:border-blue-400 shadow-sm bg-white/50">
                             </div>
                             <div class="flex justify-center gap-6">
                                <button type="button" id="btn-add-pa" class="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:text-blue-700 transition-colors">+ Añadir toma</button>
                                <button type="button" id="btn-rem-pa" class="hidden text-[10px] text-red-400 font-black uppercase tracking-widest hover:text-red-600 transition-colors">Quitar toma</button>
                             </div>
                        </div>
                    </div>

                    ${isIngreso ? `
                    <div class="bg-slate-900 text-slate-100 p-10 rounded-[48px] border-4 border-slate-800 shadow-2xl">
                        <h3 class="font-black text-indigo-400 uppercase text-xs tracking-widest border-b border-slate-800 pb-4 mb-8 italic">📋 Panel de Exámenes PSCV</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-bold text-slate-400 mb-8">
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_hematocrito" checked> Hematocrito</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_orina" checked> Orina compl.</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_glicemia" checked> Glicemia</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_electrolitos" checked> Electrolitos</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_lipidos" checked> Perfil lipídico</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_creatinina" checked> Creatinina</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_uricemia" checked> Uricemia</label>
                            <label class="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"><input type="checkbox" name="ex_ecg" checked> ECG</label>
                        </div>
                        <div class="bg-slate-800/40 p-6 rounded-3xl space-y-4">
                            <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest">Sugeridos por condición:</p>
                            <div class="flex flex-wrap gap-6 text-xs font-bold">
                                <label class="flex items-center gap-3 text-indigo-400 cursor-pointer"><input type="checkbox" name="ex_rac" id="chk-ex-rac"> RAC (Indice Alb/Crea)</label>
                                <label class="flex items-center gap-3 text-indigo-400 cursor-pointer"><input type="checkbox" name="ex_hba1c" id="chk-ex-hba1c"> Hemoglobina A1c</label>
                                <label class="flex items-center gap-3 text-indigo-400 cursor-pointer"><input type="checkbox" name="ex_fo" id="chk-ex-fo"> Fondo de Ojo</label>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    ` : ''}

                    <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-2">Indicaciones particulares y plan manual:</label>
                        <textarea name="ind_farmacos" placeholder="Escriba aquí indicaciones adicionales que no sean automáticas..." class="w-full border-2 border-gray-50 p-6 rounded-3xl h-32 text-sm font-semibold outline-none focus:border-indigo-200 transition-all"></textarea>
                    </div>
                </form>

                <!-- TOOLBAR DE ACCIÓN FINAL (Nota Clínica) -->
                <div class="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-full p-3 shadow-2xl border border-white/10 flex items-center justify-between px-8 z-40 transition-all hover:scale-[1.02]">
                    <div class="flex items-center gap-4">
                        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Nota Clínica Lista</p>
                    </div>
                    <div class="flex gap-3">
                         <button id="btn-toggle-modal" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-full text-[10px] uppercase tracking-widest transition-all">
                            Ver Nota Completa
                        </button>
                        <button id="btn-copy-main" class="bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-8 rounded-full text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ring-2 ring-blue-400/20">
                            Copiar Nota
                        </button>
                    </div>
                </div>

                <!-- MODAL INTERNO (Hidden by default) -->
                <div id="note-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" id="modal-overlay"></div>
                    <div class="bg-white rounded-[40px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative z-10 border border-indigo-100">
                        <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 class="text-xs font-black tracking-[0.2em] uppercase text-indigo-900 italic">Previsualización de Reporte Clínico</h2>
                            <button id="btn-close-modal" class="text-gray-400 hover:text-red-500 transition-colors p-2 text-2xl font-light">&times;</button>
                        </div>
                        <div class="p-10 overflow-y-auto bg-gray-50/20">
                            <pre id="full-note-display" class="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-700 bg-white p-8 rounded-3xl border border-indigo-50 shadow-inner"></pre>
                        </div>
                        <div class="p-8 border-t border-gray-100 flex justify-center">
                            <button id="btn-copy-modal" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-12 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                                Copiar y Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        window.APS.form.bindEvents();
        window.APS.form.updateOutput();
    },

    bindEvents: () => {
        const form = document.getElementById('clinical-form');
        const btnAdd = document.getElementById('btn-add-pa');
        const btnRem = document.getElementById('btn-rem-pa');
        const modal = document.getElementById('note-modal');
        const btnOpen = document.getElementById('btn-toggle-modal');
        const btnClose = document.getElementById('btn-close-modal');
        const overlay = document.getElementById('modal-overlay');

        form.addEventListener('input', (e) => {
            const { name, value, type, checked } = e.target;
            window.APS.state[name] = type === 'checkbox' ? checked : value;
            
            // Lógica reactiva de exámenes (DM2/HTA)
            if (window.APS.state.module === 'cardiovascular' && window.APS.state.type === 'ingreso') {
                const isDM2 = window.APS.state.dm2;
                const isHTA = window.APS.state.hta || (window.APS.state.pa1_s >= 140) || window.APS.state.hta_refractaria;
                const chkRAC = document.getElementById('chk-ex-rac');
                const chkHbA1c = document.getElementById('chk-ex-hba1c');
                const chkFO = document.getElementById('chk-ex-fo');
                if (chkRAC) { chkRAC.checked = isHTA || isDM2; window.APS.state.ex_rac = isHTA || isDM2; }
                if (chkHbA1c) { chkHbA1c.checked = isDM2; window.APS.state.ex_hba1c = isDM2; }
                if (chkFO) { chkFO.checked = isDM2; window.APS.state.ex_fo = isDM2; }
            }

            if (name === 'peso' || name === 'talla') {
                const imc = window.APS.helpers.calculateBMI(window.APS.state.peso, window.APS.state.talla);
                if (document.getElementById('imc-display')) document.getElementById('imc-display').value = imc;
                window.APS.state.imc = imc;
            }
            window.APS.form.updateOutput();
        });

        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                window.APS.state.show_pa2 = true;
                document.getElementById('pa2-field').classList.remove('hidden');
                btnRem.classList.remove('hidden');
                window.APS.form.updateOutput();
            });
        }
        if (btnRem) {
            btnRem.addEventListener('click', () => {
                window.APS.state.show_pa2 = false;
                document.getElementById('pa2-field').classList.add('hidden');
                btnRem.classList.add('hidden');
                window.APS.form.updateOutput();
            });
        }

        // Modal Logic
        const toggleModal = (show) => {
            window.APS.state.show_modal = show;
            if (show) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            } else {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        };

        btnOpen.addEventListener('click', () => toggleModal(true));
        btnClose.addEventListener('click', () => toggleModal(false));
        overlay.addEventListener('click', () => toggleModal(false));
        
        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.APS.state.show_modal) toggleModal(false);
        });

        document.getElementById('btn-copy-main').addEventListener('click', () => {
            const fullText = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(fullText);
            // Efecto visual rápido
            const btn = document.getElementById('btn-copy-main');
            const originalText = btn.innerText;
            btn.innerText = "¡COPIADO!";
            btn.classList.replace('bg-blue-600', 'bg-emerald-600');
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.replace('bg-emerald-600', 'bg-blue-600');
            }, 1000);
        });

        document.getElementById('btn-copy-modal').addEventListener('click', () => {
            const fullText = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(fullText);
            toggleModal(false);
        });
    },

    updateOutput: () => {
        const data = window.APS.state;
        const e = window.APS.evaluation;
        const hta = e.evaluateHTA(data);
        const rcv = (data.module === 'cardiovascular' && !isNaN(parseInt(data.edad))) ? e.calculateRCV(data) : { level: '-', reason: 'Calculando...' };
        
        // Update RCV Badge
        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-6 py-2 rounded-full font-black text-xs text-white shadow-xl uppercase transition-all ${rcv.level === 'Alto' ? 'bg-red-500 scale-105' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-500')}`;
        }
        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) rcvSumm.innerText = rcv.reason || 'Sin factores calculados.';

        // Update PA Badge
        const paBadge = document.getElementById('final-pa-badge');
        if (paBadge) paBadge.innerText = hta.avgS ? `${hta.avgS}/${hta.avgD}` : "--/--";

        // Update Hearts
        const heartsSugg = document.getElementById('hearts-suggestion');
        if (heartsSugg) {
            const h = e.evaluateManejoHTA(data);
            const hFreq = document.getElementById('hearts-freq');
            heartsSugg.innerText = h.sugerencia;
            hFreq.innerText = h.frecuencia;
        }

        // Update Modal Preview Content
        const display = document.getElementById('full-note-display');
        if (display) {
            display.innerText = window.APS.generator.generateText(data);
        }
    }
};
