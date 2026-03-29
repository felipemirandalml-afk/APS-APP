window.APS.formModules = window.APS.formModules || {};

window.APS.formModules.cardiovascular = {
    sidebarSubtitle: 'Clinical Dashboard v2.0 · Cardiovascular',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Antropometría & Antecedentes' },
        { id: 'rcv', label: '📉 Riesgo CV', sub: 'Estratificación MinSal' },
        { id: 'manejo', label: '🩺 Manejo Clínico', sub: 'PA & Algoritmo HEARTS' },
        { id: 'examenes', label: '📋 Exámenes PSCV', sub: 'Laboratorio & Cribado' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Generación de reporte' }
    ],
    getInitialState: () => ({
        edad: 0, sexo: 'F', peso: 0, talla: 0, cintura: 0, imc: 0,
        dm2: false, ecv_ateroesclerotica: false, erc_avanzada: false, albuminuria_ms: false,
        hta_refractaria: false, ldl_190: false, hipercolesterolemia_familiar: false,
        tabaquismo: false, hta: false, dislipidemia: false, af_ecv_prematura: false,
        ante_obstetricos: false, menopausia_precoz: false, enf_autoinmune: false,
        vih: false, trastorno_mental: false, cac_elevado: false,
        cirugias_previas: '', farmacos_habituales: '', otros_diagnosticos: '',
        pa1_s: null, pa1_d: null, pa2_s: null, pa2_d: null, show_pa2: false,
        manejo_hta_paso: 0, examen_fisico: '', hallazgo_edema: false, hallazgo_crepitos: false, hallazgo_acantosis: false,
        ex_hematocrito: true, ex_orina: true, ex_glicemia: true, ex_electrolitos: true,
        ex_lipidos: true, ex_creatinina: true, ex_uricemia: true, ex_ecg: true,
        ex_rac: false, ex_hba1c: false, ex_fo: false, ind_farmacos: ''
    }),

    renderTab: (tabId) => {
        const m = window.APS.formModules.cardiovascular;
        if (tabId === 'datos') return m.renderDatos();
        if (tabId === 'rcv') return m.renderRCV();
        if (tabId === 'manejo') return m.renderManejo();
        if (tabId === 'examenes') return m.renderExamenes();
        return m.renderNota();
    },

    renderDatos: () => `
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 class="font-display text-3xl font-bold text-slate-900">Datos & Antropometría</h2>
                <p class="text-slate-500 text-sm mt-1">Anamnesis inicial y parámetros físicos.</p>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Edad</label>
                            <input type="number" name="edad" value="${window.APS.state.edad}" class="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"></div>
                        <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Sexo</label>
                            <select name="sexo" class="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                                <option value="F" ${window.APS.state.sexo === 'F' ? 'selected' : ''}>Femenino</option>
                                <option value="M" ${window.APS.state.sexo === 'M' ? 'selected' : ''}>Masculino</option>
                            </select></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Peso (kg)</label>
                            <input type="number" name="peso" value="${window.APS.state.peso}" class="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl font-bold text-slate-900 outline-none"></div>
                        <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Talla (cm)</label>
                            <input type="number" name="talla" value="${window.APS.state.talla}" class="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl font-bold text-slate-900 outline-none"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-1"><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Cintura (cm)</label>
                            <input type="number" name="cintura" value="${window.APS.state.cintura}" class="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl font-bold text-slate-900 outline-none"></div>
                        <div class="bg-blue-600 rounded-2xl p-4 text-white flex flex-col justify-center items-center shadow-lg">
                            <p class="text-[8px] font-black uppercase opacity-60 mb-1">IMC</p>
                            <h4 id="imc-display-val" class="font-display text-2xl font-black">${window.APS.state.imc || '--'}</h4>
                            <p id="imc-desc" class="text-[8px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase mt-1">Evaluando...</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Antecedentes Mórbidos</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${window.APS.form.toggleCompact('hta', 'Hipertensión')}
                        ${window.APS.form.toggleCompact('dm2', 'Diabetes T2')}
                        ${window.APS.form.toggleCompact('dislipidemia', 'Dislipidemia')}
                        ${window.APS.form.toggleCompact('tabaquismo', 'Tabaquismo')}
                        ${window.APS.form.toggleCompact('erc_avanzada', 'Enf. Renal C.')}
                        ${window.APS.form.toggleCompact('ecv_ateroesclerotica', 'Enf. Cardiovasc.')}
                    </div>
                    <div class="mt-4 pt-4 border-t border-slate-50">
                        <label class="block text-[9px] font-black uppercase text-slate-400 mb-2 italic">Otros Diagnósticos</label>
                        <textarea name="otros_diagnosticos" placeholder="Escribir aquí otros antecedentes médicos relevantes..." class="w-full border-2 border-slate-50 bg-slate-50/50 p-3 rounded-xl h-16 text-[11px] font-medium focus:border-blue-400 outline-none transition-all">${window.APS.state.otros_diagnosticos}</textarea>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Cirugías Previas</h4>
                    <textarea name="cirugias_previas" placeholder="Ej: apendicectomía, cesárea, colecistectomía..." class="w-full border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl h-24 text-xs font-medium focus:border-blue-400 outline-none transition-all">${window.APS.state.cirugias_previas}</textarea>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-2">Fármacos de Uso Habitual</h4>
                    <textarea name="farmacos_habituales" placeholder="Ej: losartán 50 mg, metformina 850 mg c/12h..." class="w-full border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl h-24 text-xs font-medium focus:border-blue-400 outline-none transition-all">${window.APS.state.farmacos_habituales}</textarea>
                </div>
            </div>
        </div>
    `,

    renderRCV: () => `
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header class="flex justify-between items-end">
                <div>
                    <h2 class="font-display text-3xl font-bold text-slate-900">Riesgo Cardiovascular</h2>
                    <p class="text-slate-500 text-sm mt-1">Algoritmo de estratificación según Guía Técnica MinSal.</p>
                </div>
                <div id="rcv-badge" class="px-8 py-3 rounded-2xl font-black text-sm text-white bg-slate-400 shadow-xl uppercase transition-all duration-500">BAJO</div>
            </header>
            <div class="grid grid-cols-1 gap-6">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h4 class="text-[10px] font-black uppercase text-red-500 tracking-widest border-b border-red-50 pb-2">Criterios de Riesgo Alto Directo</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${window.APS.form.toggle('dm2', 'Diabetes Mellitus tipo 2')}
                        ${window.APS.form.toggle('ecv_ateroesclerotica', 'Enf. Cardiovascular Atero.')}
                        ${window.APS.form.toggle('erc_avanzada', 'ERC avanzada (Etapa 3 a 5)')}
                        ${window.APS.form.toggle('albuminuria_ms', 'Albuminuria mod/sev (RAC > 30)')}
                        ${window.APS.form.toggle('hta_refractaria', 'HTA Refractaria')}
                        ${window.APS.form.toggle('ldl_190', 'Dislipidemia severa (LDL > 190)')}
                        ${window.APS.form.toggle('hipercolesterolemia_familiar', 'Hipercolesterolemia familiar')}
                    </div>
                </div>
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest border-b border-blue-50 pb-2">Otros Factores y Modificadores</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${window.APS.form.toggle('tabaquismo', 'Tabaquismo Activo')}
                        ${window.APS.form.toggle('hta', 'HTA Diagnosticada')}
                        ${window.APS.form.toggle('dislipidemia', 'Dislipidemia')}
                        ${window.APS.form.toggle('af_ecv_prematura', 'AHF ECV Prematura')}
                        ${window.APS.form.toggle('ante_obstetricos', 'Ant. Obstétricos Riesgo')}
                        ${window.APS.form.toggle('menopausia_precoz', 'Menopausia Precoz')}
                        ${window.APS.form.toggle('enf_autoinmune', 'Enf. Autoinmune')}
                        ${window.APS.form.toggle('vih', 'VIH')}
                        ${window.APS.form.toggle('trastorno_mental', 'Trastorno Mental Grave')}
                    </div>
                </div>
                <div id="rcv-summary" class="bg-clinical-50 p-6 rounded-2xl border border-clinical-100 text-xs font-medium text-clinical-700 italic flex items-center gap-3">
                    <div class="w-2 h-2 rounded-full bg-clinical-400 animate-pulse"></div>
                    Calculando fundamento clínico...
                </div>
            </div>
        </div>
    `,

    renderManejo: () => `
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header class="flex justify-between items-end">
                <div>
                    <h2 class="font-display text-3xl font-bold text-slate-900">Manejo Clínico</h2>
                    <p class="text-slate-500 text-sm mt-1">Compensación de PA y algoritmo de tratamiento.</p>
                </div>
                <div id="hearts-status-badge" class="px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-md transition-all">Evaluando...</div>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-3 mb-6">Registro de Presión Arterial</h4>
                        <div class="space-y-6">
                            <div class="flex gap-4">
                                <div class="w-1/2 group"><p class="text-[8px] font-black text-slate-400 uppercase mb-1 ml-2">PAS (Sistólica)</p><input type="number" name="pa1_s" value="${window.APS.state.pa1_s || ''}" placeholder="000" class="w-full border-2 border-slate-100 bg-slate-50 p-6 rounded-3xl font-display font-black text-4xl text-center focus:border-blue-400 outline-none transition-all"></div>
                                <div class="w-1/2 group"><p class="text-[8px] font-black text-slate-400 uppercase mb-1 ml-2">PAD (Diastólica)</p><input type="number" name="pa1_d" value="${window.APS.state.pa1_d || ''}" placeholder="00" class="w-full border-2 border-slate-100 bg-slate-50 p-6 rounded-3xl font-display font-black text-4xl text-center focus:border-blue-400 outline-none transition-all"></div>
                            </div>
                            <div id="pa2-field" class="${window.APS.state.show_pa2 ? '' : 'hidden'} flex gap-4 animate-in slide-in-from-top-2">
                                <div class="w-1/2"><input type="number" name="pa2_s" value="${window.APS.state.pa2_s || ''}" placeholder="PAS 2" class="w-full border border-slate-100 bg-slate-50/50 p-4 rounded-2xl font-black text-xl text-center focus:border-blue-400 outline-none"></div>
                                <div class="w-1/2"><input type="number" name="pa2_d" value="${window.APS.state.pa2_d || ''}" placeholder="PAD 2" class="w-full border border-slate-100 bg-slate-50/50 p-4 rounded-2xl font-black text-xl text-center focus:border-blue-400 outline-none"></div>
                            </div>
                            <div class="flex gap-4 justify-center">
                                <button id="btn-add-pa" class="text-[9px] font-black text-blue-600 uppercase hover:underline">+ Añadir Toma</button>
                                <button id="btn-rem-pa" class="${window.APS.state.show_pa2 ? '' : 'hidden'} text-[9px] font-black text-red-500 uppercase hover:underline">Quitar Toma</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
                        <h4 class="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-3 mb-4">Metas PSCV</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-slate-800 p-4 rounded-2xl"><p class="text-[8px] text-slate-500 uppercase font-black mb-1">Presión Arterial</p><p id="meta-pa-lbl" class="text-sm font-bold text-green-400">--/-- mmHg</p></div>
                            <div class="bg-slate-800 p-4 rounded-2xl"><p class="text-[8px] text-slate-500 uppercase font-black mb-1">Crossover LDL</p><p id="meta-ldl-lbl" class="text-sm font-bold text-green-400">< -- mg/dL</p></div>
                        </div>
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div class="flex justify-between items-center">
                            <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Algoritmo HEARTS</h4>
                            <select name="manejo_hta_paso" class="text-[10px] font-black bg-slate-100 py-1 px-3 rounded-lg border-none focus:ring-2 focus:ring-blue-400 outline-none">
                                <option value="0" ${window.APS.state.manejo_hta_paso == 0 ? 'selected' : ''}>Paso 0: S/ fármacos</option>
                                <option value="1" ${window.APS.state.manejo_hta_paso == 1 ? 'selected' : ''}>Paso 1: Biterapia</option>
                                <option value="2" ${window.APS.state.manejo_hta_paso == 2 ? 'selected' : ''}>Paso 2: Plenas</option>
                                <option value="3" ${window.APS.state.manejo_hta_paso == 3 ? 'selected' : ''}>Paso 3: Triple</option>
                                <option value="4" ${window.APS.state.manejo_hta_paso == 4 ? 'selected' : ''}>Paso 4: Resistente</option>
                            </select>
                        </div>
                        <div class="p-6 bg-blue-50/50 rounded-2xl border border-blue-100"><p id="hearts-suggestion" class="text-sm text-slate-700 font-medium leading-relaxed italic">Sugerencia clínica...</p></div>
                        <div class="flex justify-between items-center"><span class="text-[10px] font-black text-slate-400 uppercase">Frecuencia Control:</span><span id="hearts-freq" class="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">Pendiente</span></div>
                    </div>
                    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-3">Examen Físico Segmentario</h4>
                        <textarea name="examen_fisico" placeholder="Indicar hallazgos anormales..." class="w-full border-2 border-slate-50 bg-slate-50/50 p-4 rounded-2xl h-24 text-xs font-medium focus:border-blue-400 outline-none transition-all">${window.APS.state.examen_fisico}</textarea>
                        <div class="flex flex-wrap gap-4">
                            ${window.APS.form.toggle('hallazgo_edema', 'Edema')}
                            ${window.APS.form.toggle('hallazgo_crepitos', 'Crépitos')}
                            ${window.APS.form.toggle('hallazgo_acantosis', 'Acantosis')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    renderExamenes: () => `
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 class="font-display text-3xl font-bold text-slate-900">Exámenes & Laboratorio</h2>
                <p class="text-slate-500 text-sm mt-1">Plan de estudios anual según canasta PSCV.</p>
            </header>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-3">Canasta Básica de Ingreso</h4>
                    <div class="grid grid-cols-1 gap-3">
                        ${window.APS.form.toggle('ex_hematocrito', 'Hematocrito')}
                        ${window.APS.form.toggle('ex_orina', 'Orina Completa')}
                        ${window.APS.form.toggle('ex_glicemia', 'Glicemia Ayunas')}
                        ${window.APS.form.toggle('ex_electrolitos', 'Electrolitos Plasmáticos')}
                        ${window.APS.form.toggle('ex_lipidos', 'Perfil Lipídico')}
                        ${window.APS.form.toggle('ex_creatinina', 'Creatinina / VFG')}
                        ${window.APS.form.toggle('ex_uricemia', 'Uricemia')}
                        ${window.APS.form.toggle('ex_ecg', 'Electrocardiograma')}
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="bg-blue-600 p-8 rounded-3xl shadow-xl text-white">
                        <h4 class="text-[10px] font-black uppercase text-blue-300 tracking-widest border-b border-blue-500/50 pb-3 mb-6">Exámenes Sugeridos (Reactivos)</h4>
                        <div class="space-y-4">
                            ${window.APS.form.toggleWhite('ex_rac', 'RAC (Albuminuria)')}
                            ${window.APS.form.toggleWhite('ex_hba1c', 'HbA1c (Si DM2)')}
                            ${window.APS.form.toggleWhite('ex_fo', 'Fondo de Ojo (Anual)')}
                        </div>
                    </div>
                    <div class="bg-clinical-100 p-8 rounded-3xl border border-clinical-200 text-clinical-800">
                        <p class="text-[9px] font-black uppercase mb-4 opacity-50 tracking-widest">Nota Técnica:</p>
                        <p class="text-xs font-semibold leading-relaxed">Los exámenes se calculan automáticamente basándose en los diagnósticos seleccionados en la pestaña Riesgo CV.</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    renderNota: () => `
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <header>
                <h2 class="font-display text-3xl font-bold text-slate-900">Nota & Plan Final</h2>
                <p class="text-slate-500 text-sm mt-1">Consolidación de la atención clínica para ficha médica.</p>
            </header>
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-50 pb-3">Indicaciones Farmacológicas y No Farmacológicas Manuales</h4>
                <textarea name="ind_farmacos" placeholder="Escribir indicaciones adicionales..." class="w-full border-2 border-slate-50 bg-slate-50/50 p-6 rounded-3xl h-48 text-sm font-medium focus:border-blue-400 outline-none transition-all">${window.APS.state.ind_farmacos}</textarea>
            </div>
            <div class="flex flex-col md:flex-row gap-4 items-center justify-center p-8 bg-slate-950 rounded-[40px] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div class="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div class="z-10 text-center md:text-left flex-grow">
                    <p class="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Ready to Export</p>
                    <h3 class="text-white font-bold text-lg leading-tight">Reporte Clínico Generado con Éxito</h3>
                    <p class="text-slate-500 text-[10px] mt-1">Copia el texto al portapapeles para pegarlo en la ficha electrónica.</p>
                </div>
                <div class="flex gap-4 z-10 w-full md:w-auto">
                    <button id="btn-toggle-modal" class="flex-grow md:flex-initial bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all">Ver Completo</button>
                    <button id="btn-copy-main" class="flex-grow md:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ring-2 ring-blue-400/20">Copiar Nota</button>
                </div>
            </div>
        </div>
    `,

    bindEvents: () => {
        const btnAdd = document.getElementById('btn-add-pa');
        if (btnAdd) btnAdd.addEventListener('click', () => { window.APS.state.show_pa2 = true; window.APS.form.render(); });

        const btnRem = document.getElementById('btn-rem-pa');
        if (btnRem) btnRem.addEventListener('click', () => { window.APS.state.show_pa2 = false; window.APS.form.render(); });
    },

    updateOutput: (data) => {
        const e = window.APS.evaluation;
        const rcv = !isNaN(parseInt(data.edad)) ? e.calculateRCV(data) : { level: '-', reason: 'Calculando...' };
        const metas = e.getPSCVMeta(data);

        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-8 py-3 rounded-2xl font-black text-sm text-white shadow-xl uppercase transition-all duration-500 ${rcv.level === 'Alto' ? 'bg-red-600 ring-4 ring-red-100' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-500')}`;
        }

        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) rcvSumm.innerText = rcv.reason || 'Sin factores calculados.';

        const metaPA = document.getElementById('meta-pa-lbl');
        const metaLDL = document.getElementById('meta-ldl-lbl');
        if (metaPA) metaPA.innerText = `${metas.metaPA.label} mmHg`;
        if (metaLDL) metaLDL.innerText = `< ${metas.metaLDL} mg/dL`;

        const heartsSugg = document.getElementById('hearts-suggestion');
        if (heartsSugg) {
            const h = e.evaluateManejoHTA(data);
            const hStatus = document.getElementById('hearts-status-badge');
            const hFreq = document.getElementById('hearts-freq');
            heartsSugg.innerText = h.sugerencia;
            if (hFreq) hFreq.innerText = h.frecuencia;
            if (hStatus) {
                hStatus.innerText = h.enMeta ? 'EN META' : 'FUERA DE META';
                hStatus.className = `px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-md transition-all ${h.enMeta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
            }
        }
    }
};
