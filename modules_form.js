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
            show_full_note: false
        };
        
        const container = document.getElementById('app-container');
        const isCV = moduleName === 'cardiovascular';
        const isIngreso = typeName === 'ingreso';
        
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- COLUMNA IZQUIERDA: FORMULARIO -->
                <form id="clinical-form" class="space-y-8">
                    <h2 class="text-2xl font-black border-b pb-2 text-indigo-700 font-mono italic">🩺 Datos & Antropometría</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-sm font-bold text-gray-500">
                        <div>Edad<input type="number" name="edad" value="0" class="w-full border-2 p-2 rounded-xl text-base text-indigo-900"></div>
                        <div>Sexo<select name="sexo" class="w-full border-2 p-2 rounded-xl text-base text-indigo-900"><option value="F">Fem</option><option value="M">Masc</option></select></div>
                        <div>IMC<input type="text" id="imc-display" readonly class="w-full border-2 p-2 rounded-xl bg-gray-50 font-mono text-base text-indigo-900" value="--"></div>
                        <div>Peso (kg)<input type="number" name="peso" class="w-full border-2 p-2 rounded-xl text-base text-indigo-900"></div>
                        <div>Talla (cm)<input type="number" name="talla" class="w-full border-2 p-2 rounded-xl text-base text-indigo-900"></div>
                        <div>Cintura (cm)<input type="number" name="cintura" class="w-full border-2 p-2 rounded-xl text-base text-indigo-900"></div>
                    </div>

                    ${isCV ? `
                    <!-- RCV DETALLADO -->
                    <div id="rcv-section" class="bg-indigo-50 p-8 rounded-[40px] border-2 border-indigo-200">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-black text-indigo-900 uppercase text-xs tracking-widest">RCV Chileno Automático</h3>
                            <div id="rcv-badge" class="px-5 py-1.5 rounded-full font-black text-xs text-white bg-green-500 shadow-xl uppercase transition-all duration-300">BAJO</div>
                        </div>

                        <div class="space-y-6">
                            <!-- RIESGO ALTO DIRECTO -->
                            <div class="space-y-3">
                                <p class="text-[10px] text-red-500 font-black uppercase tracking-widest border-b border-red-100 pb-1">Criterios de Riesgo Alto Directo</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold text-indigo-900">
                                    <label class="flex items-center gap-3"><input type="checkbox" name="dm2" class="w-4 h-4"> Diabetes Mellitus tipo 2</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="ecv_ateroesclerotica" class="w-4 h-4"> Enfermedad Cardiovascular Ateroesclerótica</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="erc_avanzada" class="w-4 h-4 text-red-600"> ERC avanzada o etapa 3-5</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="albuminuria_ms" class="w-4 h-4 text-red-600"> Albuminuria moderada o severa (RAC > 30)</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="hta_refractaria" class="w-4 h-4 text-red-600"> Hipertensión Arterial Refractaria</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="ldl_190" class="w-4 h-4 text-red-600"> Dislipidemia severa (LDL > 190 mg/dL)</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="hipercolesterolemia_familiar" class="w-4 h-4 text-red-600"> Hipercolesterolemia familiar</label>
                                </div>
                            </div>

                            <!-- OTROS FACTORES Y MODIFICADORES -->
                            <div class="space-y-3">
                                <p class="text-[10px] text-indigo-400 font-black uppercase tracking-widest border-b border-indigo-100 pb-1">Factores de Riesgo y Modificadores</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold text-indigo-700">
                                    <label class="flex items-center gap-3"><input type="checkbox" name="hta" class="w-4 h-4"> Hipertensión Arterial Diagnosticada</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="dislipidemia" class="w-4 h-4"> Dislipidemia Diagnosticada</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="tabaquismo" class="w-4 h-4"> Tabaquismo Activo</label>
                                    <label class="flex items-center gap-3"><input type="checkbox" name="af_ecv_prematura" class="w-4 h-4"> Antecedente familiar ECV prematura</label>
                                    
                                    <p class="col-span-1 md:col-span-2 text-[9px] text-indigo-300 font-bold border-t border-indigo-50 mt-2 pt-1 uppercase">Modificadores (pueden subir riesgo):</p>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="ante_obstetricos" class="w-4 h-4"> Antecedentes obstétricos de riesgo</label>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="menopausia_precoz" class="w-4 h-4"> Menopausia precoz</label>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="enf_autoinmune" class="w-4 h-4"> Enfermedad autoinmune</label>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="vih" class="w-4 h-4"> VIH</label>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="trastorno_mental" class="w-4 h-4"> Trastorno mental grave</label>
                                    <label class="flex items-center gap-3 text-indigo-400"><input type="checkbox" name="cac_elevado" class="w-4 h-4"> Calcio Coronario (CAC) elevado</label>
                                </div>
                            </div>
                        </div>

                        <div id="rcv-summary" class="mt-6 text-xs font-semibold text-indigo-900 border-l-4 border-indigo-200 pl-4 py-2 bg-white/50 rounded-r-2xl shadow-inner italic">Calculando fundamento clínico...</div>
                    </div>

                    <!-- ALGORITMO HEARTS -->
                    <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
                        <div class="flex justify-between items-center border-b border-gray-50 pb-4">
                            <h3 class="font-black text-indigo-900 uppercase text-xs tracking-widest">Manejo HTA (HEARTS)</h3>
                            <select name="manejo_hta_paso" class="text-xs font-bold border-2 rounded-xl p-2 bg-indigo-50 text-indigo-700 outline-none transition-all focus:border-indigo-400">
                                <option value="0">Paso 0: S/ fármacos</option>
                                <option value="1">Paso 1: Biterapia inicial</option>
                                <option value="2">Paso 2: Biterapia plenas</option>
                                <option value="3">Paso 3: Triple terapia</option>
                                <option value="4">Paso 4: HTA Resistente</option>
                            </select>
                        </div>
                        <div id="hearts-feedback" class="space-y-3">
                            <div class="flex justify-between items-center text-xs font-bold">
                                <span class="text-gray-400 uppercase">Estado:</span>
                                <span id="hearts-status" class="px-3 py-1 rounded-full font-black text-[10px]">Evaluando...</span>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p id="hearts-suggestion" class="text-sm text-gray-700 font-medium leading-relaxed">Sugerencia clínica...</p>
                            </div>
                            <div class="flex justify-between items-center text-xs font-bold text-indigo-600">
                                <span>PRÓXIMO CONTROL:</span>
                                <span id="hearts-freq" class="bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100 font-mono">Pte.</span>
                            </div>
                        </div>
                    </div>

                    <div id="hta-subflow" class="bg-blue-50 p-8 rounded-[40px] border-2 border-blue-200">
                        <h3 class="font-black text-blue-900 border-b border-blue-100 pb-4 mb-6 flex justify-between items-center text-xs uppercase tracking-widest"><span>Registro de Presión Arterial</span></h3>
                        <div id="pa-container" class="space-y-6">
                             <div class="flex gap-4">
                                 <input type="number" name="pa1_s" placeholder="PAS" class="w-1/2 border-2 p-4 rounded-2xl font-black text-2xl text-center outline-none focus:border-blue-400">
                                 <input type="number" name="pa1_d" placeholder="PAD" class="w-1/2 border-2 p-4 rounded-2xl font-black text-2xl text-center outline-none focus:border-blue-400">
                             </div>
                             <div id="pa2-field" class="hidden flex gap-4">
                                 <input type="number" name="pa2_s" placeholder="PAS (2)" class="w-1/2 border-2 p-4 rounded-2xl font-black text-2xl text-center outline-none focus:border-blue-400">
                                 <input type="number" name="pa2_d" placeholder="PAD (2)" class="w-1/2 border-2 p-4 rounded-2xl font-black text-2xl text-center outline-none focus:border-blue-400">
                             </div>
                             <div class="flex gap-4">
                                <button type="button" id="btn-add-pa" class="text-xs text-blue-600 font-black uppercase hover:underline">+ Añadir toma</button>
                                <button type="button" id="btn-rem-pa" class="hidden text-xs text-red-500 font-black uppercase hover:underline">Quitar toma</button>
                             </div>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                        <textarea name="examen_fisico" placeholder="Hallazgos manuales (ej: soplos, lesiones)..." class="w-full border-2 border-indigo-50 p-6 rounded-3xl h-24 text-sm font-semibold outline-none focus:border-indigo-200 transition-all"></textarea>
                        <div class="flex gap-6 text-xs font-black text-indigo-800 uppercase tracking-tighter">
                            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="hallazgo_edema" class="w-4 h-4"> Edema</label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="hallazgo_crepitos" class="w-4 h-4"> Crépitos</label>
                            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="hallazgo_acantosis" class="w-4 h-4"> Acantosis</label>
                        </div>
                    </div>

                    ${isIngreso ? `
                    <div class="bg-gray-900 text-white p-8 rounded-[40px] border border-gray-700 shadow-2xl space-y-6">
                        <h3 class="font-black text-indigo-400 uppercase text-xs tracking-widest border-b border-gray-800 pb-4">📋 Exámenes Iniciales PSCV</h3>
                        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold text-gray-300">
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_hematocrito" checked> Hematocrito</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_orina" checked> Orina compl.</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_glicemia" checked> Glicemia</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_electrolitos" checked> Electrolitos</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_lipidos" checked> Perfil lipídico</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_creatinina" checked> Creatinina</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_uricemia" checked> Uricemia</label>
                            <label class="flex items-center gap-3"><input type="checkbox" name="ex_ecg" checked> ECG</label>
                        </div>
                        <div id="exams-comorbidity" class="bg-gray-800/50 p-5 rounded-3xl space-y-3">
                            <p class="text-[10px] text-gray-500 uppercase font-black">Adicionales sugeridos:</p>
                            <div class="grid grid-cols-1 gap-2 text-xs font-bold">
                                <label class="flex items-center gap-3 text-indigo-300"><input type="checkbox" name="ex_rac" id="chk-ex-rac"> RAC (Indice Alb/Crea)</label>
                                <label class="flex items-center gap-3 text-indigo-300"><input type="checkbox" name="ex_hba1c" id="chk-ex-hba1c"> Hemoglobina A1c</label>
                                <label class="flex items-center gap-3 text-indigo-300"><input type="checkbox" name="ex_fo" id="chk-ex-fo"> Fondo de Ojo</label>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    ` : ''}

                    <div class="h-10"></div> <!-- Espaciado extra final -->
                </form>

                <!-- COLUMNA DERECHA: NOTA CLÍNICA (Panel compacto) -->
                <div class="bg-indigo-900 rounded-[50px] p-8 shadow-2xl text-white flex flex-col border-8 border-indigo-800 relative lg:sticky lg:top-8 h-fit">
                    <div class="flex justify-between items-center mb-10">
                        <h2 class="text-xs font-black tracking-widest uppercase opacity-40 font-mono">Reporte Clínico</h2>
                        <span id="final-pa-display" class="bg-white text-indigo-900 px-8 py-2 rounded-full font-black text-2xl shadow-xl font-mono">--/--</span>
                    </div>
                    <div id="status-display" class="space-y-4 mb-10"></div>
                    
                    <div class="relative">
                        <textarea id="output-text" class="w-full p-8 rounded-[40px] bg-indigo-950/60 font-mono text-xs text-indigo-100 outline-none leading-relaxed resize-none transition-all duration-300 shadow-inner" style="height: 250px;" readonly></textarea>
                        <div id="note-overlay" class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-950/90 to-transparent rounded-b-[40px]"></div>
                    </div>

                    <div class="flex gap-4 mt-8">
                        <button id="btn-toggle-note" class="flex-grow bg-indigo-800 hover:bg-indigo-700 text-white font-black py-5 rounded-3xl uppercase shadow-lg text-xs tracking-widest transition-all">Ver Completo</button>
                        <button id="btn-copy" class="flex-grow bg-white text-indigo-900 font-black py-5 rounded-3xl uppercase shadow-lg text-xs tracking-widest hover:bg-gray-100 transition-all active:scale-95">Copiar Ficha</button>
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

        document.getElementById('btn-toggle-note').addEventListener('click', () => {
            window.APS.state.show_full_note = !window.APS.state.show_full_note;
            const btn = document.getElementById('btn-toggle-note');
            const txt = document.getElementById('output-text');
            const overlay = document.getElementById('note-overlay');
            if (window.APS.state.show_full_note) {
                btn.innerText = "Ver Menos"; txt.style.height = "700px"; overlay.style.display = "none";
            } else {
                btn.innerText = "Ver Completo"; txt.style.height = "250px"; overlay.style.display = "block";
            }
            window.APS.form.updateOutput();
        });

        document.getElementById('btn-copy').addEventListener('click', () => {
            const fullText = window.APS.generator.generateText(window.APS.state);
            window.APS.helpers.copyToClipboard(fullText);
        });
    },

    updateOutput: () => {
        const data = window.APS.state;
        const e = window.APS.evaluation;
        const hta = e.evaluateHTA(data);
        const rcv = (data.module === 'cardiovascular' && !isNaN(parseInt(data.edad))) ? e.calculateRCV(data) : { level: '-', reason: 'Calculando...' };
        const metas = e.getPSCVMeta(data);

        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-5 py-1.5 rounded-full font-black text-xs text-white shadow-2xl uppercase ${rcv.level === 'Alto' ? 'bg-red-500 scale-105' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-green-500')}`;
        }
        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) rcvSumm.innerText = rcv.reason || 'Sin factores calculados.';

        const paDisp = document.getElementById('final-pa-display');
        if (paDisp) paDisp.innerText = hta.avgS ? `${hta.avgS}/${hta.avgD}` : "--/--";

        const statusPanel = document.getElementById('status-display');
        if (statusPanel) {
            statusPanel.innerHTML = `<div class="bg-indigo-950/60 p-4 rounded-3xl flex justify-between items-center shadow-lg"><div class="text-[10px] opacity-40 uppercase font-black font-mono">Metas PSCV</div><div class="text-base font-bold text-green-300 font-mono">${metas.metaPA.label} | LDL < ${metas.metaLDL}</div></div>`;
        }

        const heartsSugg = document.getElementById('hearts-suggestion');
        if (heartsSugg) {
            const h = e.evaluateManejoHTA(data);
            const hStatus = document.getElementById('hearts-status');
            const hFreq = document.getElementById('hearts-freq');
            heartsSugg.innerText = h.sugerencia;
            hFreq.innerText = h.frecuencia;
            if (h.enMeta) {
                hStatus.innerText = "EN META"; hStatus.className = "px-3 py-1 rounded-full bg-green-100 text-green-700 font-black text-[9px]";
            } else {
                hStatus.innerText = "FUERA DE META"; hStatus.className = "px-3 py-1 rounded-full bg-red-100 text-red-700 font-black text-[9px]";
            }
        }

        const outText = document.getElementById('output-text');
        if (outText) {
            const fullNote = window.APS.generator.generateText(data);
            outText.value = window.APS.state.show_full_note ? fullNote : (fullNote.substring(0, 300) + "\n\n[...]");
        }
    }
};