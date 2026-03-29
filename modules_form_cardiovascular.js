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
        const f = window.APS.formModules.cardiovascular;
        if (tabId === 'datos') return f.renderDatos();
        if (tabId === 'rcv') return f.renderRCV();
        if (tabId === 'manejo') return f.renderManejo();
        if (tabId === 'examenes') return f.renderExamenes();
        return f.renderNota();
    },
    renderDatos: () => `
        <div class="space-y-8"><header><h2 class="font-display text-3xl font-bold text-slate-900">Datos & Antropometría</h2></header>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Edad</label><input type="number" name="edad" value="${window.APS.state.edad}" class="w-full border p-3 rounded-xl"></div>
                    <div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Sexo</label><select name="sexo" class="w-full border p-3 rounded-xl"><option value="F" ${window.APS.state.sexo === 'F' ? 'selected' : ''}>Femenino</option><option value="M" ${window.APS.state.sexo === 'M' ? 'selected' : ''}>Masculino</option></select></div>
                </div>
                <div class="grid grid-cols-2 gap-4"><div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Peso</label><input type="number" name="peso" value="${window.APS.state.peso}" class="w-full border p-3 rounded-xl"></div><div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Talla</label><input type="number" name="talla" value="${window.APS.state.talla}" class="w-full border p-3 rounded-xl"></div></div>
                <div class="grid grid-cols-2 gap-4"><div><label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Cintura</label><input type="number" name="cintura" value="${window.APS.state.cintura}" class="w-full border p-3 rounded-xl"></div><div class="bg-blue-600 rounded-2xl p-4 text-white flex flex-col justify-center items-center"><p class="text-[8px]">IMC</p><h4 id="imc-display-val" class="text-2xl font-black">${window.APS.state.imc || '--'}</h4><p id="imc-desc" class="text-[8px]">Evaluando...</p></div></div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4"><h4 class="text-[10px] font-black uppercase text-slate-400">Antecedentes</h4><div class="grid grid-cols-2 gap-2">${window.APS.form.toggleCompact('hta', 'Hipertensión')}${window.APS.form.toggleCompact('dm2', 'Diabetes T2')}${window.APS.form.toggleCompact('dislipidemia', 'Dislipidemia')}${window.APS.form.toggleCompact('tabaquismo', 'Tabaquismo')}${window.APS.form.toggleCompact('erc_avanzada', 'Enf. Renal C.')}${window.APS.form.toggleCompact('ecv_ateroesclerotica', 'Enf. Cardiovasc.')}</div><textarea name="otros_diagnosticos" class="w-full border p-3 rounded-xl h-16" placeholder="Otros diagnósticos">${window.APS.state.otros_diagnosticos}</textarea></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white p-6 rounded-3xl border"><h4 class="text-[10px]">Cirugías Previas</h4><textarea name="cirugias_previas" class="w-full border p-4 rounded-2xl h-24">${window.APS.state.cirugias_previas}</textarea></div><div class="bg-white p-6 rounded-3xl border"><h4 class="text-[10px]">Fármacos de Uso Habitual</h4><textarea name="farmacos_habituales" class="w-full border p-4 rounded-2xl h-24">${window.APS.state.farmacos_habituales}</textarea></div></div></div>
    `,
    renderRCV: () => `<div class="space-y-8"><header class="flex justify-between"><div><h2 class="font-display text-3xl font-bold">Riesgo Cardiovascular</h2></div><div id="rcv-badge" class="px-8 py-3 rounded-2xl font-black text-sm text-white bg-slate-400">BAJO</div></header><div class="bg-white p-8 rounded-3xl border space-y-4">${window.APS.form.toggle('dm2','Diabetes Mellitus tipo 2')}${window.APS.form.toggle('ecv_ateroesclerotica','Enf. Cardiovascular Atero.')}${window.APS.form.toggle('erc_avanzada','ERC avanzada')}${window.APS.form.toggle('albuminuria_ms','Albuminuria mod/sev')}${window.APS.form.toggle('hta_refractaria','HTA Refractaria')}${window.APS.form.toggle('ldl_190','LDL > 190')}${window.APS.form.toggle('hipercolesterolemia_familiar','Hipercolesterolemia familiar')}${window.APS.form.toggle('af_ecv_prematura','AHF ECV Prematura')}${window.APS.form.toggle('ante_obstetricos','Ant. Obstétricos')}${window.APS.form.toggle('menopausia_precoz','Menopausia Precoz')}${window.APS.form.toggle('enf_autoinmune','Enf. Autoinmune')}${window.APS.form.toggle('vih','VIH')}${window.APS.form.toggle('trastorno_mental','Trastorno Mental Grave')}</div><div id="rcv-summary" class="bg-clinical-50 p-6 rounded-2xl border">Calculando fundamento clínico...</div></div>`,
    renderManejo: () => `<div class="space-y-8"><header class="flex justify-between"><h2 class="font-display text-3xl font-bold">Manejo Clínico</h2><div id="hearts-status-badge" class="px-6 py-2 rounded-xl font-black text-[10px] uppercase">Evaluando...</div></header><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="bg-white p-8 rounded-3xl border space-y-4"><div class="flex gap-4"><input type="number" name="pa1_s" value="${window.APS.state.pa1_s || ''}" placeholder="PAS" class="w-1/2 border p-4 rounded-2xl"><input type="number" name="pa1_d" value="${window.APS.state.pa1_d || ''}" placeholder="PAD" class="w-1/2 border p-4 rounded-2xl"></div><div id="pa2-field" class="${window.APS.state.show_pa2 ? '' : 'hidden'} flex gap-4"><input type="number" name="pa2_s" value="${window.APS.state.pa2_s || ''}" placeholder="PAS 2" class="w-1/2 border p-4 rounded-2xl"><input type="number" name="pa2_d" value="${window.APS.state.pa2_d || ''}" placeholder="PAD 2" class="w-1/2 border p-4 rounded-2xl"></div><div class="flex gap-4"><button id="btn-add-pa" class="text-xs text-blue-600">+ Añadir Toma</button><button id="btn-rem-pa" class="${window.APS.state.show_pa2 ? '' : 'hidden'} text-xs text-red-500">Quitar Toma</button></div></div><div class="space-y-6"><div class="bg-white p-8 rounded-3xl border"><select name="manejo_hta_paso" class="text-xs border rounded p-2"><option value="0" ${window.APS.state.manejo_hta_paso == 0 ? 'selected' : ''}>Paso 0</option><option value="1" ${window.APS.state.manejo_hta_paso == 1 ? 'selected' : ''}>Paso 1</option><option value="2" ${window.APS.state.manejo_hta_paso == 2 ? 'selected' : ''}>Paso 2</option><option value="3" ${window.APS.state.manejo_hta_paso == 3 ? 'selected' : ''}>Paso 3</option><option value="4" ${window.APS.state.manejo_hta_paso == 4 ? 'selected' : ''}>Paso 4</option></select><p id="hearts-suggestion" class="mt-4 text-sm"></p><span id="hearts-freq" class="text-xs"></span><p id="meta-pa-lbl" class="text-xs mt-4"></p><p id="meta-ldl-lbl" class="text-xs"></p></div><div class="bg-white p-8 rounded-3xl border"><textarea name="examen_fisico" class="w-full border p-4 rounded-2xl h-24">${window.APS.state.examen_fisico}</textarea><div class="flex gap-2 mt-3">${window.APS.form.toggle('hallazgo_edema','Edema')}${window.APS.form.toggle('hallazgo_crepitos','Crépitos')}${window.APS.form.toggle('hallazgo_acantosis','Acantosis')}</div></div></div></div></div>`,
    renderExamenes: () => `<div class="space-y-8"><h2 class="font-display text-3xl font-bold">Exámenes & Laboratorio</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="bg-white p-8 rounded-3xl border">${window.APS.form.toggle('ex_hematocrito','Hematocrito')}${window.APS.form.toggle('ex_orina','Orina Completa')}${window.APS.form.toggle('ex_glicemia','Glicemia Ayunas')}${window.APS.form.toggle('ex_electrolitos','Electrolitos Plasmáticos')}${window.APS.form.toggle('ex_lipidos','Perfil Lipídico')}${window.APS.form.toggle('ex_creatinina','Creatinina / VFG')}${window.APS.form.toggle('ex_uricemia','Uricemia')}${window.APS.form.toggle('ex_ecg','Electrocardiograma')}</div><div class="bg-blue-600 p-8 rounded-3xl">${window.APS.form.toggleWhite('ex_rac','RAC')}${window.APS.form.toggleWhite('ex_hba1c','HbA1c')}${window.APS.form.toggleWhite('ex_fo','Fondo de Ojo')}</div></div></div>`,
    renderNota: () => `<div class="space-y-8 pb-20"><h2 class="font-display text-3xl font-bold">Nota & Plan Final</h2><div class="bg-white p-8 rounded-3xl border"><textarea name="ind_farmacos" class="w-full border p-6 rounded-3xl h-48" placeholder="Indicaciones adicionales">${window.APS.state.ind_farmacos}</textarea></div><div class="flex gap-4 justify-center p-8 bg-slate-950 rounded-[40px]"><button id="btn-toggle-modal" class="bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl text-[10px]">Ver Completo</button><button id="btn-copy-main" class="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl text-[10px]">Copiar Nota</button></div></div>`,
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
            rcvBadge.className = `px-8 py-3 rounded-2xl font-black text-sm text-white ${rcv.level === 'Alto' ? 'bg-red-600' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-500')}`;
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
                hStatus.className = `px-6 py-2 rounded-xl font-black text-[10px] uppercase ${h.enMeta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
            }
        }
    }
};
