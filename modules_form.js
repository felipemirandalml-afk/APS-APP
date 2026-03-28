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
            manejo_hta_paso: 0
        };
        
        const container = document.getElementById('app-container');
        const isCV = moduleName === 'cardiovascular';
        const isIngreso = typeName === 'ingreso';
        
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- COLUMNA IZQUIERDA: FORMULARIO -->
                <form id="clinical-form" class="space-y-6">
                    <h2 class="text-xl font-bold border-b pb-2 text-indigo-700 font-mono">🩺 Datos & Antropometría</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-xs font-bold">
                        <div>Edad<input type="number" name="edad" value="0" class="w-full border-2 p-1 rounded-lg"></div>
                        <div>Sexo<select name="sexo" class="w-full border-2 p-1 rounded-lg"><option value="F">Fem</option><option value="M">Masc</option></select></div>
                        <div>IMC<input type="text" id="imc-display" readonly class="w-full border-2 p-1 rounded-lg bg-gray-50 font-mono text-indigo-900" value="--"></div>
                        <div>Peso<input type="number" name="peso" class="w-full border-2 p-1 rounded-lg"></div>
                        <div>Talla<input type="number" name="talla" class="w-full border-2 p-1 rounded-lg"></div>
                        <div>Cintura<input type="number" name="cintura" class="w-full border-2 p-1 rounded-lg"></div>
                    </div>

                    ${isCV ? `
                    <div id="rcv-section" class="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-200">
                        <div class="flex justify-between items-center mb-4"><h3 class="font-black text-indigo-900 uppercase text-[10px] tracking-widest">RCV Automática</h3><div id="rcv-badge" class="px-4 py-1 rounded-full font-black text-xs text-white bg-green-500 shadow-md uppercase">BAJO</div></div>
                        <div class="grid grid-cols-2 gap-4 text-[9px] font-bold text-indigo-800">
                            <div class="space-y-1"><p class="text-[8px] text-indigo-400">ALTO RIESGO</p>
                                <label class="flex items-center gap-2"><input type="checkbox" name="dm2"> DM2</label>
                                <label class="flex items-center gap-2"><input type="checkbox" name="ecv_ateroesclerotica"> ECV Atero</label>
                                <label class="flex items-center gap-2"><input type="checkbox" name="erc_avanzada"> ERC Avanzada</label>
                            </div>
                            <div class="space-y-1"><p class="text-[8px] text-indigo-400">OTROS / RIESGOS</p>
                                <label class="flex items-center gap-2"><input type="checkbox" name="hta"> HTA</label>
                                <label class="flex items-center gap-2"><input type="checkbox" name="dislipidemia"> Dislipidemia</label>
                                <label class="flex items-center gap-2"><input type="checkbox" name="tabaquismo"> Tabaquismo</label>
                            </div>
                        </div>
                        <div id="rcv-summary" class="mt-3 text-[10px] font-semibold text-indigo-700 italic border-t border-indigo-100 pt-2">
                           Calculando fundamento clínico...
                        </div>
                    </div>


                    ${isCV ? `
                    <!-- MANEJO HTA - ALGORITMO HEARTS -->
                    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 mb-6">
                        <div class="flex justify-between items-center border-b border-gray-50 pb-2">
                            <h3 class="font-black text-indigo-900 uppercase text-[10px] tracking-widest">Esquema HEARTS</h3>
                            <select name="manejo_hta_paso" class="text-[10px] font-bold border-2 rounded-lg p-1 bg-indigo-50 text-indigo-700">
                                <option value="0">Paso 0: S/ fármacos</option>
                                <option value="1">Paso 1: Biterapia inicial</option>
                                <option value="2">Paso 2: Biterapia plenas</option>
                                <option value="3">Paso 3: Triple terapia</option>
                                <option value="4">Paso 4: HTA Resistente</option>
                            </select>
                        </div>
                        
                        <div id="hearts-feedback" class="space-y-2">
                            <div class="flex justify-between items-center text-[9px] font-bold">
                                <span class="text-gray-400">ESTADO:</span>
                                <span id="hearts-status" class="px-2 py-0.5 rounded-full font-black text-[8px]">Evaluando...</span>
                            </div>
                            <div class="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <p id="hearts-suggestion" class="text-[10px] text-gray-700 font-medium leading-tight">Ingrese cifras de PA para ver sugerencia.</p>
                            </div>
                            <div class="flex justify-between items-center text-[9px] font-bold text-indigo-600">
                                <span>PRÓXIMO CONTROL:</span>
                                <span id="hearts-freq" class="bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">Pte.</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div id="hta-subflow" class="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200">
                        <h3 class="font-bold text-blue-900 border-b border-blue-100 pb-2 mb-4 flex justify-between items-center text-xs uppercase tracking-widest"><span>Registro de Presión Arterial</span></h3>
                        <div id="pa-container" class="space-y-4 text-xs">
                             <div class="flex gap-4">
                                <input type="number" name="pa1_s" placeholder="PAS" class="w-1/2 border-2 p-2 rounded-xl font-bold">
                                <input type="number" name="pa1_d" placeholder="PAD" class="w-1/2 border-2 p-2 rounded-xl font-bold">
                             </div>
                             <div id="pa2-field" class="hidden flex gap-4">
                                <input type="number" name="pa2_s" placeholder="PAS (2)" class="w-1/2 border-2 p-2 rounded-xl font-bold">
                                <input type="number" name="pa2_d" placeholder="PAD (2)" class="w-1/2 border-2 p-2 rounded-xl font-bold">
                             </div>
                                <button type="button" id="btn-add-pa" class="text-[10px] text-blue-600 font-bold uppercase underline">+ Añadir toma</button>
                                <button type="button" id="btn-rem-pa" class="hidden text-[10px] text-red-400 font-bold uppercase underline">Quitar toma</button>
                        </div>
                    </div>

                    <!-- EXAMEN FÍSICO ASISTIDO -->
                    <div class="bg-indigo-50 p-5 rounded-3xl border border-indigo-200 space-y-4">
                        <textarea name="examen_fisico" placeholder="Hallazgos manuales (ej: soplo)..." class="w-full border-2 border-indigo-100 p-3 rounded-2xl h-16 text-xs"></textarea>
                        <div class="flex gap-4 text-[9px] font-bold text-indigo-800">
                            <label class="flex items-center gap-1"><input type="checkbox" name="hallazgo_edema"> Edema</label>
                            <label class="flex items-center gap-1"><input type="checkbox" name="hallazgo_crepitos"> Crépitos</label>
                            <label class="flex items-center gap-1"><input type="checkbox" name="hallazgo_acantosis"> Acantosis</label>
                        </div>
                    </div>

                    ${isIngreso ? `
                    <!-- NUEVA SECCIÓN: EXÁMENES INICIALES (Sólo en Ingreso CV) -->
                    <div class="bg-gray-900 text-white p-6 rounded-3xl border border-gray-700 shadow-xl space-y-4">
                        <h3 class="font-black text-indigo-400 uppercase text-[10px] tracking-widest border-b border-gray-700 pb-2">📋 Exámenes Iniciales PSCV</h3>
                        
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-[9px] font-bold">
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_hematocrito" checked> Hematocrito</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_orina" checked> Orina completa</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_glicemia" checked> Glicemia</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_electrolitos" checked> Electrolitos</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_lipidos" checked> Perfil lipídico</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_creatinina" checked> Creatinina</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_uricemia" checked> Uricemia</label>
                            <label class="flex items-center gap-2"><input type="checkbox" name="ex_ecg" checked> ECG</label>
                        </div>

                        <div id="exams-comorbidity" class="bg-gray-800 p-3 rounded-xl space-y-1">
                            <p class="text-[8px] text-gray-400 uppercase">Por Comorbilidades (Auto):</p>
                            <div class="grid grid-cols-1 gap-1 text-[9px] font-bold">
                                <label class="flex items-center gap-2 text-indigo-300"><input type="checkbox" name="ex_rac" id="chk-ex-rac"> Razón alb/crea (RAC)</label>
                                <label class="flex items-center gap-2 text-indigo-300"><input type="checkbox" name="ex_hba1c" id="chk-ex-hba1c"> Hemoglobina A1c</label>
                                <label class="flex items-center gap-2 text-indigo-300"><input type="checkbox" name="ex_fo" id="chk-ex-fo"> Fondo de Ojo</label>
                            </div>
                        </div>

                        <div>
                            <p class="text-[8px] text-gray-400 uppercase mb-1">Sugerencias Ampliadas:</p>
                            <div class="flex gap-3 text-[9px] font-bold text-gray-300">
                                <label class="flex items-center gap-2"><input type="checkbox" name="ex_tsh"> TSH</label>
                                <label class="flex items-center gap-2"><input type="checkbox" name="ex_calcio"> Calcio</label>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    ` : ''}

                    <div class="pt-2">
                        <textarea name="ind_farmacos" placeholder="Plan e indicaciones..." class="w-full border-2 p-4 rounded-2xl h-24 text-xs font-semibold"></textarea>
                    </div>
                </form>

                <div class="h-full bg-indigo-900 rounded-3xl p-6 shadow-2xl text-white border-4 border-indigo-800 flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-sm font-bold tracking-widest uppercase opacity-60">🔎 Reporte Clínico</h2>
                        <span id="final-pa-display" class="bg-white text-indigo-900 px-4 py-1 rounded-full font-black text-lg shadow-lg font-mono">--/--</span>
                    </div>
                    <div id="status-display" class="space-y-3 mb-6"></div>
                    <textarea id="output-text" class="flex-grow w-full p-4 border-none rounded-2xl bg-indigo-950/50 font-mono text-[10px] text-indigo-100 outline-none leading-relaxed" readonly></textarea>
                    <button id="btn-copy" class="mt-6 bg-white text-indigo-900 font-bold py-4 rounded-2xl uppercase shadow-lg text-xs leading-none">Copiar a Ficha</button>
                </div>
            </div>
        `;

        window.APS.form.bindEvents();
    },

    bindEvents: () => {
        const form = document.getElementById('clinical-form');
        const btnAdd = document.getElementById('btn-add-pa');
        const btnRem = document.getElementById('btn-rem-pa');

        form.addEventListener('input', (e) => {
            const { name, value, type, checked } = e.target;
            window.APS.state[name] = type === 'checkbox' ? checked : value;
            
            // Lógica automática de exámenes por comorbilidad
            if (window.APS.state.module === 'cardiovascular' && window.APS.state.type === 'ingreso') {
                const isHTA = window.APS.state.hta || hta_values_present();
                const isDM2 = window.APS.state.dm2;
                
                function hta_values_present() { return !!(window.APS.state.pa1_s > 140) || !!(window.APS.state.hta_refractaria); }

                const chkRAC = document.getElementById('chk-ex-rac');
                const chkHbA1c = document.getElementById('chk-ex-hba1c');
                const chkFO = document.getElementById('chk-ex-fo');

                if (chkRAC) { 
                    const newValue = isHTA || isDM2;
                    if (name === 'dm2' || name === 'hta' || name.startsWith('pa1_')) {
                        chkRAC.checked = newValue;
                        window.APS.state.ex_rac = newValue;
                    }
                }
                if (chkHbA1c && chkFO) {
                    if (name === 'dm2') {
                        chkHbA1c.checked = isDM2;
                        chkFO.checked = isDM2;
                        window.APS.state.ex_hba1c = isDM2;
                        window.APS.state.ex_fo = isDM2;
                    }
                }
            }

            if (name === 'peso' || name === 'talla') {
                const imc = window.APS.helpers.calculateBMI(window.APS.state.peso, window.APS.state.talla);
                const display = document.getElementById('imc-display');
                if (display) display.value = imc;
                window.APS.state.imc = imc;
            }
            window.APS.form.updateOutput();
        });

        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                if (!window.APS.state.show_pa2) {
                    window.APS.state.show_pa2 = true;
                    document.getElementById('pa2-field').classList.remove('hidden');
                    document.getElementById('btn-rem-pa').classList.remove('hidden');
                }
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

        document.getElementById('btn-copy').addEventListener('click', () => window.APS.helpers.copyToClipboard(document.getElementById('output-text').value));
    },

    updateOutput: () => {
        const data = window.APS.state;
        const e = window.APS.evaluation;
        const hta = e.evaluateHTA(data);
        const rcv = isNaN(parseInt(data.edad)) ? { level: 'Pte', method: '', reason: '' } : e.calculateRCV(data);
        const metas = e.getPSCVMeta(data);
        // Guardas defensivas contra null
        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-4 py-1 rounded-full font-black text-[10px] text-white shadow-md uppercase ${rcv.level === 'Alto' ? 'bg-red-500' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-green-500')}`;
        }

        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) {
            rcvSumm.innerText = rcv.reason || 'Sin factores calculados.';
        }

        const paDisp = document.getElementById('final-pa-display');
        if (paDisp) {
            paDisp.innerText = hta.avgS ? `${hta.avgS}/${hta.avgD}` : "--/--";
        }

        const statusPanel = document.getElementById('status-display');
        if (statusPanel) {
            statusPanel.innerHTML = `<div class="bg-indigo-950/50 p-2 rounded-xl flex justify-between"><div class="text-[9px] opacity-40 uppercase">Metas Salud</div><div class="text-[10px] font-bold text-green-300 font-mono">${metas.metaPA.label} | LDL < ${metas.metaLDL}</div></div>`;
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
                hStatus.className = "px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-black text-[8px]";
            } else {
                hStatus.innerText = "FUERA DE META";
                hStatus.className = "px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[8px]";
            }
        }

        const outText = document.getElementById('output-text');
        if (outText) {
            outText.value = window.APS.generator.generateText(data);
        }
    }
};