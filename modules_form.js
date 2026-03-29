// modules_form.js
window.APS.form = {
    render: (moduleName, typeName) => {
        window.APS.state = { 
            module: moduleName, 
            type: typeName, 
            examen_fisico: '',
            peso: 0, talla: 0, cintura: 0,
            dm2: false, hta: false, tabaquismo: false,
            pa1_s: 0, pa1_d: 0,
            ex_rac: false, ex_hba1c: false,
            manejo_hta_paso: 0,
            // UI State
            show_full_note: false
        };
        
        const container = document.getElementById('app-container');
        const isCV = moduleName === 'cardiovascular';
        const isIngreso = typeName === 'ingreso';
        
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- COLUMNA IZQUIERDA: FORMULARIO (Mas amplio) -->
                <form id="clinical-form" class="space-y-8">
                    <h2 class="text-2xl font-black border-b pb-2 text-indigo-700 font-mono italic">🩺 Datos & Antropometría</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-sm font-bold text-gray-600">
                        <div>Edad<input type="number" name="edad" value="0" class="w-full border-2 p-2 rounded-xl text-indigo-900 text-base"></div>
                        <div>Sexo<select name="sexo" class="w-full border-2 p-2 rounded-xl text-indigo-900 text-base"><option value="F">Fem</option><option value="M">Masc</option></select></div>
                        <div>IMC<input type="text" id="imc-display" readonly class="w-full border-2 p-2 rounded-xl bg-gray-50 text-indigo-900 font-mono text-base" value="--"></div>
                        <div>Peso (kg)<input type="number" name="peso" class="w-full border-2 p-2 rounded-xl text-indigo-900 text-base"></div>
                        <div>Talla (cm)<input type="number" name="talla" class="w-full border-2 p-2 rounded-xl text-indigo-900 text-base"></div>
                        <div>Cintura (cm)<input type="number" name="cintura" class="w-full border-2 p-2 rounded-xl text-indigo-900 text-base"></div>
                    </div>

                    ${isCV ? `
                    <!-- MANEJO HTA -->
                    <div id="rcv-section" class="bg-indigo-50 p-8 rounded-3xl border-2 border-indigo-200 shadow-inner space-y-4">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-black text-indigo-900 uppercase text-xs tracking-widest">Riesgo Cardiovascular</h3>
                            <div id="rcv-badge" class="px-4 py-1 rounded-full font-black text-xs text-white bg-green-500 shadow-md uppercase">BAJO</div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm font-bold text-indigo-800">
                            <label class="flex items-center gap-3"><input type="checkbox" name="dm2" class="w-4 h-4"> DM2</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ecv_ateroesclerotica" class="w-4 h-4"> ECV Atero</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="erc_avanzada" class="w-4 h-4"> ERC Avanzada</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="hta" class="w-4 h-4"> HTA</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="dislipidemia" class="w-4 h-4"> Dislipidemia</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="tabaquismo" class="w-4 h-4"> Tabaquismo</label>
                        </div>
                        <div id="rcv-summary" class="mt-4 pt-4 border-t border-indigo-100 text-xs text-indigo-900 italic font-medium">Calculando...</div>
                    </div>

                    <!-- ALGORITMO HEARTS -->
                    <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                            <h3 class="font-black text-indigo-900 uppercase text-xs tracking-widest">Esquema HEARTS</h3>
                            <select name="manejo_hta_paso" class="text-xs font-bold border-2 rounded-xl p-2 bg-indigo-50 text-indigo-700 outline-none">
                                <option value="0">Paso 0: S/ fármacos</option>
                                <option value="1">Paso 1: Biterapia inicial</option>
                                <option value="2">Paso 2: Biterapia plenas</option>
                                <option value="3">Paso 3: Triple terapia</option>
                                <option value="4">Paso 4: HTA Resistente</option>
                            </select>
                        </div>
                        <div id="hearts-feedback" class="space-y-4">
                            <div class="flex justify-between items-center text-xs font-bold">
                                <span class="text-gray-400 uppercase">Estado:</span>
                                <span id="hearts-status" class="px-3 py-1 rounded-full font-black text-[10px]">Evaluando...</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p id="hearts-suggestion" class="text-sm text-gray-700 font-medium leading-relaxed">Sugerencia clínica...</p>
                            </div>
                            <div class="flex justify-between items-center text-xs font-bold text-indigo-600">
                                <span>PRÓXIMO CONTROL:</span>
                                <span id="hearts-freq" class="bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">Pte.</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 p-8 rounded-3xl border-2 border-blue-200">
                         <div class="grid grid-cols-2 gap-6">
                            <input type="number" name="pa1_s" placeholder="PAS" class="border-2 p-4 rounded-2xl font-black border-blue-100 text-2xl text-center outline-none focus:border-blue-300">
                            <input type="number" name="pa1_d" placeholder="PAD" class="border-2 p-4 rounded-2xl font-black border-blue-100 text-2xl text-center outline-none focus:border-blue-300">
                        </div>
                    </div>
                    ` : ''}

                    <textarea name="ind_farmacos" placeholder="Indicaciones y plan manual adicional..." class="w-full border-2 p-6 rounded-3xl h-28 text-sm font-semibold focus:border-indigo-400 outline-none transition-all shadow-sm"></textarea>
                </form>

                <!-- COLUMNA DERECHA: NOTA CLÍNICA (Panel mas limpio) -->
                <div class="bg-indigo-900 rounded-[40px] p-8 shadow-2xl text-white flex flex-col border-8 border-indigo-800 relative lg:sticky lg:top-8 h-fit">
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-sm font-bold tracking-widest uppercase opacity-60 font-mono">Reporte Clínico</h2>
                        <span id="final-pa-display" class="bg-white text-indigo-900 px-6 py-2 rounded-full font-black text-2xl shadow-lg font-mono">--/--</span>
                    </div>
                    <div id="status-display" class="space-y-2 mb-8 text-sm"></div>
                    
                    <!-- AREA DE NOTA COMPACTA -->
                    <div class="relative group">
                        <textarea id="output-text" class="w-full p-6 rounded-[30px] bg-indigo-950/50 font-mono text-xs text-indigo-100 outline-none leading-relaxed resize-none transition-all duration-300" 
                                  style="height: 200px;" readonly></textarea>
                        <div id="note-overlay" class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-indigo-950/80 to-transparent rounded-b-[30px]"></div>
                    </div>
                    
                    <div class="flex gap-4 mt-6">
                        <button id="btn-toggle-note" class="flex-grow bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl uppercase shadow-lg text-xs tracking-widest transition-all">
                            Ver Completo
                        </button>
                        <button id="btn-copy" class="flex-grow bg-white text-indigo-900 font-bold py-4 rounded-2xl uppercase shadow-lg text-xs tracking-widest hover:bg-gray-100 transition-all">
                            Copiar Ficha
                        </button>
                    </div>
                </div>
            </div>
        `;
        window.APS.form.bindEvents();
        window.APS.form.updateOutput();
    },

    bindEvents: () => {
        const form = document.getElementById('clinical-form');
        if (!form) return;

        form.addEventListener('input', (e) => {
            const { name, value, type, checked } = e.target;
            window.APS.state[name] = type === 'checkbox' ? checked : value;
            
            if (name === 'peso' || name === 'talla') {
                const imc = window.APS.helpers.calculateBMI(window.APS.state.peso, window.APS.state.talla);
                if (document.getElementById('imc-display')) document.getElementById('imc-display').value = imc;
                window.APS.state.imc = imc;
            }
            window.APS.form.updateOutput();
        });

        document.getElementById('btn-toggle-note').addEventListener('click', () => {
            window.APS.state.show_full_note = !window.APS.state.show_full_note;
            const btn = document.getElementById('btn-toggle-note');
            const txt = document.getElementById('output-text');
            const overlay = document.getElementById('note-overlay');
            
            if (window.APS.state.show_full_note) {
                btn.innerText = "Ver Menos";
                txt.style.height = "600px";
                overlay.style.display = "none";
            } else {
                btn.innerText = "Ver Completo";
                txt.style.height = "200px";
                overlay.style.display = "block";
            }
            window.APS.form.updateOutput();
        });

        document.getElementById('btn-copy').addEventListener('click', () => {
            // Siempre copiar el texto completo
            const fullText = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(fullText);
        });
    },

    updateOutput: () => {
        const data = window.APS.state;
        const e = window.APS.evaluation;
        const hta = e.evaluateHTA(data);
        const rcv = (data.module === 'cardiovascular' && !isNaN(parseInt(data.edad))) ? e.calculateRCV(data) : { level: '-', reason: 'Sin clasificar' };
        const metas = e.getPSCVMeta(data);

        // Actualizaciones de UI seguras
        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-4 py-1 rounded-full font-black text-xs text-white shadow-md uppercase ${rcv.level === 'Alto' ? 'bg-red-500' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-green-500')}`;
        }

        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) rcvSumm.innerText = rcv.reason || 'Sin factores.';

        const paDisp = document.getElementById('final-pa-display');
        if (paDisp) paDisp.innerText = hta.avgS ? `${hta.avgS}/${hta.avgD}` : "--/--";

        const statusPanel = document.getElementById('status-display');
        if (statusPanel) {
            statusPanel.innerHTML = `
                <div class="bg-indigo-950/50 p-3 rounded-2xl flex justify-between items-center">
                    <span class="text-green-300 font-bold font-mono text-base">${metas.metaPA.label} | LDL < ${metas.metaLDL}</span>
                    <span class="uppercase opacity-50 tracking-tighter text-xs">RCV ${rcv.level}</span>
                </div>`;
        }

        // Feedback HEARTS
        const heartsSugg = document.getElementById('hearts-suggestion');
        if (heartsSugg) {
            const h = e.evaluateManejoHTA(data);
            const hStatus = document.getElementById('hearts-status');
            const hFreq = document.getElementById('hearts-freq');
            heartsSugg.innerText = h.sugerencia;
            hFreq.innerText = h.frecuencia;
            if (h.enMeta) {
                hStatus.innerText = "EN META";
                hStatus.className = "px-3 py-1 rounded-full bg-green-100 text-green-700 font-black text-[10px]";
            } else {
                hStatus.innerText = "FUERA DE META";
                hStatus.className = "px-3 py-1 rounded-full bg-red-100 text-red-700 font-black text-[10px]";
            }
        }

        const outText = document.getElementById('output-text');
        if (outText) {
            const fullNote = window.APS.generator.generateText(data);
            if (window.APS.state.show_full_note) {
                outText.value = fullNote;
            } else {
                // Preview truncada
                outText.value = fullNote.substring(0, 300) + "\n\n[...]";
            }
        }
    }
};