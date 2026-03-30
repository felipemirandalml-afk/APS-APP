window.APS.formModules = window.APS.formModules || {};

window.APS.formModules.cardiovascular = {
    sidebarSubtitle: 'Clinical Dashboard v2.1 · Cardiovascular',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Antropometría & Antecedentes' },
        { id: 'rcv', label: '📉 Riesgo CV', sub: 'Estratificación MinSal' },
        { id: 'manejo', label: '🩺 Manejo Clínico', sub: 'PA & Algoritmo HEARTS' },
        { id: 'examenes', label: '📋 Exámenes PSCV', sub: 'Laboratorio & Cribado' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Generación de reporte' }
    ],
    getInitialState: () => ({
        edad: '', sexo: 'F', peso: '', talla: '', cintura: '', imc: '',
        dm2: false, ecv_ateroesclerotica: false, erc_avanzada: false, albuminuria_ms: false,
        hta_refractaria: false, ldl_190: false, hipercolesterolemia_familiar: false,
        tabaquismo: false, hta: false, dislipidemia: false, af_ecv_prematura: false,
        ante_obstetricos: false, menopausia_precoz: false, enf_autoinmune: false,
        vih: false, trastorno_mental: false, cac_elevado: false, fragilidad: false,
        cirugias_previas: '', farmacos_habituales: '', otros_diagnosticos: '',
        pa1_s: null, pa1_d: null, pa2_s: null, pa2_d: null, pa3_s: null, pa3_d: null, 
        num_pa: 1, show_pa2: false, show_pa3: false,
        manejo_hta_paso: 0, examen_fisico: '', hallazgo_edema: false, hallazgo_crepitos: false, hallazgo_acantosis: false,
        ex_hematocrito: true, ex_orina: true, ex_glicemia: true, ex_electrolitos: true,
        ex_lipidos: true, ex_creatinina: true, ex_uricemia: true, ex_ecg: true,
        ex_rac: false, ex_hba1c: false, ex_fo: false, ind_farmacos: '',
        // NUEVAS VARIABLES PARA CRISIS:
        danio_torax: false, 
        danio_vision: false, 
        danio_neuro: false, 
        danio_respi: false
    }),
    
    // Hook para manejar cambios en el estado del módulo (Paso 1 del refactor)
    onStateChange: (name, state) => {
        const isDM2 = state.dm2;
        const isHTA = state.hta || (state.pa1_s >= 140) || state.hta_refractaria;
        
        state.ex_rac = isHTA || isDM2;
        state.ex_hba1c = isDM2;
        state.ex_fo = state.ex_fo || isDM2;
    },

    // NUEVO: Evaluación específica para riesgo cardiovascular
    evaluateStatus: (data) => {
        const htaResult = window.APS.evaluation.evaluateHTA(data);
        const metas = window.APS.evaluation.getPSCVMeta(data);
        
        let isCompensated = true;
        let evaluationText = [];

        const pas = htaResult.avgS;
        const pad = htaResult.avgD;

        if (pas > 0 && pad > 0) {
            if (pas >= metas.metaPA.s || pad >= metas.metaPA.d) {
                isCompensated = false;
                evaluationText.push(`PA fuera de meta`);
            }
        }

        const imc = window.APS.helpers.calculateBMI(data.peso, data.talla);
        if (imc >= 30) evaluationText.push("Obesidad");

        return { 
            isCompensated, 
            text: evaluationText.join(". ") || (isCompensated ? "En rango meta." : "Fuera de meta.") 
        };
    },

    // Generador de texto para este módulo (Paso 2 del refactor)
    generateText: (data) => {
        const h = window.APS.helpers;
        const e = window.APS.evaluation;
        const isIngreso = data.type === 'ingreso';

        let text = `=== NOTA CLÍNICA - CARDIOVASCULAR (${data.type.toUpperCase()}) ===\n\n`;
        
        text += `[EV CLÍNICA]\n`;
        text += `Paciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}.\n`;
        if (data.peso && data.talla) {
            text += `Antropometría: Peso: ${data.peso} kg, Talla: ${data.talla} cm (IMC ${data.imc || '--'}). `;
            if (data.cintura) text += `Cintura: ${data.cintura} cm.`;
            text += `\n`;
        }

        const coMorbs = [];
        if (data.hta) coMorbs.push("HTA");
        if (data.dm2) coMorbs.push("DM2");
        if (data.dislipidemia) coMorbs.push("dislipidemia");
        if (data.tabaquismo) coMorbs.push("tabaquismo");
        if (data.erc_avanzada) coMorbs.push("ERC");
        if (data.ecv_ateroesclerotica) coMorbs.push("ECV ateroesclerótica");
        if (data.fragilidad) coMorbs.push("síndrome de fragilidad");
        
        let coMorbText = coMorbs.length > 0 ? coMorbs.join(", ") : "";
        if (data.otros_diagnosticos?.trim()) {
            const others = data.otros_diagnosticos.trim();
            coMorbText = coMorbText ? `${coMorbText}, ${others}` : others;
        }
        
        text += `Comorbilidades: ${coMorbText || "no se registran"}.\n`;
        text += `Cirugías previas: ${data.cirugias_previas?.trim() ? h.formatClinicalText(data.cirugias_previas) : "sin antecedentes quirúrgicos consignados."}\n`;
        text += `Fármacos de uso habitual: ${data.farmacos_habituales?.trim() ? h.formatClinicalText(data.farmacos_habituales) : "no referidos."}\n`;
        
        const rcv = e.calculateRCV(data);
        const { metaPA, metaLDL, metaHbA1c } = e.getPSCVMeta(data);
        text += `\nESTRATIFICACIÓN RCV: ${rcv.level.toUpperCase()} (${rcv.method}). Fundamento: ${rcv.reason}.\n`;
        text += `Metas PSCV: Meta PA: ${metaPA.label}. Meta LDL: < ${metaLDL} mg/dL.`;
        if (metaHbA1c !== "N/A") {
            text += ` Meta HbA1c: ${metaHbA1c}.`;
        }
        text += `\n`;
        
        text += `\n[EXAMEN FÍSICO]\n`;
        text += window.APS.generator.buildPhysicalExamSegmentary(data);
        
        const htaRes = e.evaluateHTA(data);
        if (htaRes.avgS) {
            text += `\nPA de evaluación: ${htaRes.avgS}/${htaRes.avgD} mmHg (${htaRes.methodLabel}). Clasificación: ${htaRes.classification}.`;
        }
        text += `\n\n`;

        if (isIngreso) {
            const examString = window.APS.generator.buildExamString(data);
            if (examString) {
                text += `[EXÁMENES SOLICITADOS]\n`;
                text += `${examString}\n\n`;
            }
        }

        text += `[PLAN E INDICACIONES]\n`;
        text += `Control: ${e.evaluateStatus(data).text.toUpperCase()}.\n`;
        
        const hearts = e.evaluateManejoHTA(data);
        if (hearts.pasoActual.id === 0 && !hearts.enMeta) {
            text += `Medidas no farmacológicas: restricción de sodio, alimentación saludable, actividad física y cese de tabaco. `;
            text += `Dado cifras fuera de meta, se propone iniciar Paso 1 HEARTS (${hearts.nextPaso.drugs}). `;
        } else if (!hearts.enMeta) {
            text += `Paciente fuera de meta en su esquema actual (${hearts.pasoActual.label}). Se sugiere ajustar a ${hearts.nextPaso.label}: ${hearts.nextPaso.drugs}. `;
        } else {
            text += `PA en rango meta. Mantener esquema actual (${hearts.pasoActual.label}). `;
        }
        text += `Control en ${hearts.frecuencia}.\n`;

        text += `${data.ind_farmacos || ''}`;

        return text;
    },
    
    renderTab: (tabId) => {
        const f = window.APS.formModules.cardiovascular;
        if (tabId === 'datos') return f.renderDatos();
        if (tabId === 'rcv') return f.renderRCV();
        if (tabId === 'manejo') return f.renderManejo();
        if (tabId === 'examenes') return f.renderExamenes();
        return f.renderNota();
    },

    renderDatos: () => {
        const s = window.APS.state;
        const ui = window.APS.ui; // Llamamos a la fábrica de legos

        return `
        <div class="space-y-6 animate-in fade-in duration-500">
            <header><h2 class="font-display text-2xl font-black text-slate-900 tracking-tight">Datos del Paciente</h2></header>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-5 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                        ${ui.inputNumber('edad', 'Edad', s.edad)}
                        ${ui.select('sexo', 'Sexo', [{value: 'F', label: 'Femenino'}, {value: 'M', label: 'Masculino'}], s.sexo)}
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        ${ui.inputNumber('peso', 'Peso (kg)', s.peso)}
                        ${ui.inputNumber('talla', 'Talla (cm)', s.talla)}
                    </div>
                    <div class="grid grid-cols-2 gap-3 items-end">
                        ${ui.inputNumber('cintura', 'Perímetro Cintura', s.cintura)}
                        
                        <div id="imc-card" class="bg-blue-600 rounded-2xl p-3 text-white text-center shadow-lg shadow-blue-200/50 h-[68px] flex flex-col justify-center">
                            <p class="text-[9px] font-black uppercase opacity-70">IMC</p>
                            <h4 id="imc-display-val" class="text-xl font-black">${s.imc || '--'}</h4>
                            <div id="imc-desc" class="text-[8px] font-bold">Sin datos</div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-7 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 mb-3 ml-1">Comorbilidades Relevantes</h4>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        ${ui.toggleCompact('hta', 'HTA', s.hta)}
                        ${ui.toggleCompact('dm2', 'Diabetes', s.dm2)}
                        ${ui.toggleCompact('dislipidemia', 'DLP', s.dislipidemia)}
                        ${ui.toggleCompact('tabaquismo', 'Fumador', s.tabaquismo)}
                        ${ui.toggleCompact('erc_avanzada', 'ERC', s.erc_avanzada)}
                        ${ui.toggleCompact('ecv_ateroesclerotica', 'ECV', s.ecv_ateroesclerotica)}
                        ${ui.toggleCompact('fragilidad', 'Pte. Frágil', s.fragilidad)}
                    </div>
                    ${ui.textArea('otros_diagnosticos', 'Otros Diagnósticos', s.otros_diagnosticos, 'Ej: Hipotiroidismo, Artrosis...')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                    ${ui.textArea('cirugias_previas', 'Cirugías Previas', s.cirugias_previas, 'Describa cirugías relevantes...')}
                </div>
                <div class="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                    ${ui.textArea('farmacos_habituales', 'Fármacos de Uso Diario', s.farmacos_habituales, 'Ej: Enalapril 10mg/12h, Metformina 850mg...')}
                </div>
            </div>
        </div>`;
    },

    renderRCV: () => {
        const s = window.APS.state;
        const ui = window.APS.ui; // Usamos nuestros legos

        return `
        <div class="space-y-6 animate-in fade-in duration-500">
            <header class="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <div>
                    <h2 class="font-display text-2xl font-black text-slate-900 tracking-tight">Riesgo Cardiovascular</h2>
                    <p class="text-xs text-slate-500 font-medium">Estratificación según guías locales</p>
                </div>
                <div id="rcv-badge" class="px-10 py-4 rounded-2xl font-black text-lg text-white bg-slate-400 shadow-xl transition-all duration-700">BAJO</div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-2 bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <h4 class="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 border-b pb-2">Factores de Riesgo / Criterios Directos</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${ui.toggleCompact('albuminuria_ms', 'Albuminuria mod/sev', s.albuminuria_ms)}
                        ${ui.toggleCompact('hta_refractaria', 'HTA Refractaria', s.hta_refractaria)}
                        ${ui.toggleCompact('ldl_190', 'LDL > 190 mg/dL', s.ldl_190)}
                        ${ui.toggleCompact('hipercolesterolemia_familiar', 'Hipercolost. Familiar', s.hipercolesterolemia_familiar)}
                        ${ui.toggleCompact('af_ecv_prematura', 'AHF ECV Prematura', s.af_ecv_prematura)}
                        ${ui.toggleCompact('ante_obstetricos', 'Antecedentes Obstétricos', s.ante_obstetricos)}
                        ${ui.toggleCompact('menopausia_precoz', 'Menopausia Precoz', s.menopausia_precoz)}
                        ${ui.toggleCompact('enf_autoinmune', 'Enf. Autoinmune', s.enf_autoinmune)}
                        ${ui.toggleCompact('vih', 'Paciente VIH+', s.vih)}
                        ${ui.toggleCompact('trastorno_mental', 'Trastorno Mental Grave', s.trastorno_mental)}
                    </div>
                </div>

                <div class="bg-clinical-50 p-7 rounded-[32px] border border-clinical-100 flex flex-col h-full">
                    <h4 class="text-[10px] font-black uppercase text-clinical-600 mb-4 tracking-widest">Fundamento Clínico</h4>
                    <div id="rcv-summary" class="text-sm text-clinical-900 font-medium leading-relaxed flex-grow">Calculando...</div>
                    <div class="mt-6 p-4 bg-white/50 rounded-2xl border border-clinical-200/50">
                        <p class="text-[9px] text-clinical-700 leading-tight">La clasificación se basa en la suma de factores y presencia de condiciones de riesgo directo según norma técnica ministerial.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    renderManejo: () => {
        const s = window.APS.state;
        const ui = window.APS.ui;
        return `
        <div class="space-y-6 animate-in fade-in duration-500">
            <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="font-display text-2xl font-black text-slate-900 tracking-tight">Manejo Clínico</h2>
                <div class="flex gap-2">
                    <div id="hearts-status-badge" class="px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-slate-100 text-slate-500">Evaluando Meta...</div>
                    <div id="hearts-step-label" class="px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-blue-100 text-blue-700">HEARTS: Paso ${s.manejo_hta_paso}</div>
                </div>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Registro Presión Arterial (1/2/3 tomas) -->
                <div class="lg:col-span-5 space-y-4">
                    <div class="bg-white p-7 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
                        <h4 class="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Registro de Presión Arterial</h4>
                        
                        <div class="space-y-3">
                            <!-- Toma 1 -->
                            <div class="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div class="text-[10px] font-black text-slate-400 w-8">#1</div>
                                <div class="flex gap-2 flex-grow">
                                    <input type="number" name="pa1_s" value="${s.pa1_s || ''}" placeholder="S" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                    <span class="text-slate-300 py-2">/</span>
                                    <input type="number" name="pa1_d" value="${s.pa1_d || ''}" placeholder="D" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                </div>
                            </div>

                            <!-- Toma 2 -->
                            <div id="pa2-field" class="${s.show_pa2 ? 'flex' : 'hidden'} items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                <div class="text-[10px] font-black text-slate-400 w-8">#2</div>
                                <div class="flex gap-2 flex-grow">
                                    <input type="number" name="pa2_s" value="${s.pa2_s || ''}" placeholder="S" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                    <span class="text-slate-300 py-2">/</span>
                                    <input type="number" name="pa2_d" value="${s.pa2_d || ''}" placeholder="D" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                </div>
                            </div>

                            <!-- Toma 3 -->
                            <div id="pa3-field" class="${s.show_pa3 ? 'flex' : 'hidden'} items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                <div class="text-[10px] font-black text-slate-400 w-8">#3</div>
                                <div class="flex gap-2 flex-grow">
                                    <input type="number" name="pa3_s" value="${s.pa3_s || ''}" placeholder="S" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                    <span class="text-slate-300 py-2">/</span>
                                    <input type="number" name="pa3_d" value="${s.pa3_d || ''}" placeholder="D" class="w-full border-b-2 border-slate-200 bg-transparent py-2 text-center text-lg font-bold focus:border-blue-500 outline-none">
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between items-center text-[10px] font-black uppercase">
                            <button id="btn-add-pa" class="${s.show_pa3 ? 'hidden' : 'text-blue-600 hover:text-blue-800'} transition-colors">+ Añadir Toma</button>
                            <button id="btn-rem-pa" class="${s.show_pa2 ? 'text-red-500 hover:text-red-700' : 'hidden'} transition-colors">Quitar Toma</button>
                            <div id="pa-avg-label" class="text-slate-400 italic">...</div>
                        </div>
                    </div>

                    <div id="crisis-container" class="hidden bg-red-50 p-6 rounded-3xl border-2 border-red-200 shadow-sm transition-all duration-500">
                        <h4 class="text-xs font-black uppercase text-red-600 mb-4 tracking-widest flex items-center gap-2">
                            <span class="text-lg">🚨</span> Evaluar Daño de Órgano Blanco
                        </h4>
                        <p class="text-[10px] text-red-500 font-bold mb-4">Presión arterial en rango de crisis (≥ 180/120). Marque si hay síntomas agudos:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            ${ui.toggle('danio_torax', 'Dolor Torácico Agudo', s.danio_torax)}
                            ${ui.toggle('danio_vision', 'Alt. Visual / Papiledema', s.danio_vision)}
                            ${ui.toggle('danio_neuro', 'Déficit Neurológico Focal', s.danio_neuro)}
                            ${ui.toggle('danio_respi', 'Disnea / Signos IC', s.danio_respi)}
                        </div>
                    </div>

                    <div class="bg-blue-600 p-6 rounded-[32px] text-white shadow-xl shadow-blue-200">
                        <h4 class="text-[10px] font-black uppercase opacity-60 mb-3 tracking-widest">Metas PSCV del Paciente</h4>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div class="p-3 bg-white/10 rounded-2xl border border-white/10">
                                <p class="text-[8px] font-black opacity-70 uppercase mb-1">Presión Arterial</p>
                                <p id="meta-pa-lbl" class="text-sm font-black tracking-tight">--/--</p>
                            </div>
                            <div class="p-3 bg-white/10 rounded-2xl border border-white/10">
                                <p class="text-[8px] font-black opacity-70 uppercase mb-1">Colesterol LDL</p>
                                <p id="meta-ldl-lbl" class="text-sm font-black tracking-tight">-- mg/dL</p>
                            </div>
                            <div id="meta-hba1c-container" class="p-3 bg-white/10 rounded-2xl border border-white/10 ${s.dm2 ? '' : 'hidden'}">
                                <p class="text-[8px] font-black opacity-70 uppercase mb-1">Meta HbA1c</p>
                                <p id="meta-hba1c-lbl" class="text-sm font-black tracking-tight">--</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Algoritmo HEARTS y Examen Físico -->
                <div class="lg:col-span-7 space-y-6">
                    <div class="bg-white p-7 rounded-[32px] border border-slate-200 shadow-sm space-y-5">
                        <div class="flex justify-between items-center">
                            <h4 class="text-[10px] font-black uppercase text-slate-400 ml-1">Algoritmo HEARTS</h4>
                            <select name="manejo_hta_paso" class="text-[10px] font-black border-2 border-slate-50 rounded-xl px-4 py-2 bg-slate-50 transition-all outline-none focus:border-blue-500">
                                <option value="0" ${s.manejo_hta_paso == 0 ? 'selected' : ''}>Paso 0: Estilo Vida</option>
                                <option value="1" ${s.manejo_hta_paso == 1 ? 'selected' : ''}>Paso 1: Dual 1</option>
                                <option value="2" ${s.manejo_hta_paso == 2 ? 'selected' : ''}>Paso 2: Dual 2</option>
                                <option value="3" ${s.manejo_hta_paso == 3 ? 'selected' : ''}>Paso 3: Triple</option>
                                <option value="4" ${s.manejo_hta_paso == 4 ? 'selected' : ''}>Paso 4: Resistente</option>
                            </select>
                        </div>
                        <div id="hearts-panel" class="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex items-start gap-4">
                            <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 text-white font-black">H</div>
                            <div>
                                <p id="hearts-suggestion" class="text-sm font-bold text-slate-800 leading-snug"></p>
                                <p id="hearts-freq" class="text-[10px] font-black text-blue-600 uppercase mt-2 tracking-widest"></p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-7 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                        <h4 class="text-[10px] font-black uppercase text-slate-400 ml-1">Hallazgos Examen Físico</h4>
                        <textarea name="examen_fisico" class="w-full border-2 border-slate-50 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm h-20" placeholder="Anote hallazgos relevantes de hoy...">${s.examen_fisico}</textarea>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                             ${ui.toggleCompact('hallazgo_edema', 'Edema', s.hallazgo_edema)}
                             ${ui.toggleCompact('hallazgo_crepitos', 'Crépitos', s.hallazgo_crepitos)}
                             ${ui.toggleCompact('hallazgo_acantosis', 'Acantosis', s.hallazgo_acantosis)}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    renderExamenes: () => {
        const s = window.APS.state;
        const ui = window.APS.ui; // Usamos nuestros legos

        return `
        <div class="space-y-6 animate-in fade-in duration-500">
            <header>
                <h2 class="font-display text-2xl font-black text-slate-900 tracking-tight">Exámenes de Laboratorio</h2>
                <p class="text-xs text-slate-500 font-medium">Cribado anual y seguimiento según guías PSCV</p>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white p-7 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
                    <div class="border-b pb-3 mb-2">
                        <h4 class="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Batería Base PSCV</h4>
                        <p class="text-[8px] text-slate-400 font-bold">Solicitados en ingreso o control anual</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        ${ui.toggleCompact('ex_hematocrito', 'Hematocrito', s.ex_hematocrito)}
                        ${ui.toggleCompact('ex_orina', 'Orina Completa', s.ex_orina)}
                        ${ui.toggleCompact('ex_glicemia', 'Glicemia', s.ex_glicemia)}
                        ${ui.toggleCompact('ex_electrolitos', 'Electrolitos', s.ex_electrolitos)}
                        ${ui.toggleCompact('ex_lipidos', 'Perfil Lipídico', s.ex_lipidos)}
                        ${ui.toggleCompact('ex_creatinina', 'Creatinina / VFG', s.ex_creatinina)}
                        ${ui.toggleCompact('ex_uricemia', 'Uricemia', s.ex_uricemia)}
                        ${ui.toggleCompact('ex_ecg', 'ECG Reposo', s.ex_ecg)}
                    </div>
                </div>

                <div class="bg-blue-600 p-8 rounded-[40px] shadow-2xl shadow-blue-500/20 text-white space-y-6">
                    <div class="border-b border-white/20 pb-3 mb-2">
                        <h4 class="text-[10px] font-black uppercase text-blue-100 tracking-[0.2em]">Solicitud x Comorbilidad</h4>
                        <p class="text-[8px] text-blue-200 font-bold">Activados automáticamente según diagnóstico</p>
                    </div>
                    <div class="space-y-3">
                        ${ui.toggleWhite('ex_rac', 'RAC (Microalbuminuria/Crea)', s.ex_rac)}
                        ${ui.toggleWhite('ex_hba1c', 'HbA1c (Diabetes)', s.ex_hba1c)}
                        ${ui.toggleWhite('ex_fo', 'Fondo de Ojo', s.ex_fo)}
                    </div>
                    <div class="mt-8 p-5 bg-white/10 rounded-[28px] border border-white/10">
                        <p class="text-[9px] font-medium leading-relaxed italic opacity-80 underline underline-offset-4 decoration-white/20">Nota: RAC es obligatorio en DM2 e HTA con alto riesgo. Fondo de Ojo es anual en DM2.</p>
                    </div>
                </div>
            </div>
        </div>`;
    },

    renderNota: () => {
        const s = window.APS.state;
        return `
        <div class="space-y-6 animate-in fade-in duration-500 pb-16">
            <header>
                <h2 class="font-display text-2xl font-black text-slate-900 tracking-tight">Cierre de Consulta</h2>
            </header>
            
            <div class="bg-white p-7 rounded-[40px] border border-slate-200 shadow-sm space-y-5">
                <h4 class="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Plan & Indicaciones No Farmacológicas</h4>
                <textarea name="ind_farmacos" class="w-full border-2 border-slate-50 p-6 rounded-[32px] focus:border-blue-500 outline-none transition-all text-sm h-48 bg-slate-50/30" placeholder="Anote indicaciones específicas, cambios de dosis, derivaciones o acuerdos con el paciente...">${s.ind_farmacos}</textarea>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center p-12 bg-slate-900 rounded-[48px] shadow-2xl relative overflow-hidden">
                <!-- Decoración -->
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-clinical-600/10 rounded-full blur-3xl"></div>
                
                <button id="btn-toggle-modal" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3">
                    <span class="text-xl">👁️</span> Ver Nota Completa
                </button>
                <button id="btn-copy-main" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-12 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 border-b-4 border-blue-800">
                    <span class="text-2xl">📋</span> Copiar al Portapapeles
                </button>
            </div>
        </div>`;
    },

    bindEvents: () => {
        const s = window.APS.state;
        
        const btnAdd = document.getElementById('btn-add-pa');
        if (btnAdd) btnAdd.addEventListener('click', () => { 
            if (!s.show_pa2) s.show_pa2 = true;
            else if (!s.show_pa3) s.show_pa3 = true;
            window.APS.form.render(); 
        });

        const btnRem = document.getElementById('btn-rem-pa');
        if (btnRem) btnRem.addEventListener('click', () => { 
            if (s.show_pa3) s.show_pa3 = false;
            else if (s.show_pa2) s.show_pa2 = false;
            window.APS.form.render(); 
        });
    },

    updateOutput: (data) => {
        const e = window.APS.evaluation;
        const rcv = !isNaN(parseInt(data.edad)) ? e.calculateRCV(data) : { level: '-', reason: 'Calculando...' };
        const metas = e.getPSCVMeta(data);
        const htaRes = e.evaluateHTA(data);
        
        // RCV UI
        const rcvBadge = document.getElementById('rcv-badge');
        if (rcvBadge) {
            rcvBadge.innerText = (rcv.level || '-').toUpperCase();
            rcvBadge.className = `px-10 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all ${rcv.level === 'Alto' ? 'bg-red-600 scale-105' : (rcv.level === 'Moderado' ? 'bg-amber-500' : 'bg-emerald-500')}`;
        }
        const rcvSumm = document.getElementById('rcv-summary');
        if (rcvSumm) rcvSumm.innerText = (rcv.reason || 'Sin factores calculados.') + (rcv.note ? `. ${rcv.note}` : '');

        // PA UI
        const metaPA = document.getElementById('meta-pa-lbl');
        const metaLDL = document.getElementById('meta-ldl-lbl');
        const metaHbA1c = document.getElementById('meta-hba1c-lbl');
        const metaHbA1cContainer = document.getElementById('meta-hba1c-container');
        
        if (metaPA) metaPA.innerText = `${metas.metaPA.s}/${metas.metaPA.d}`;
        if (metaLDL) metaLDL.innerText = `< ${metas.metaLDL} mg/dL`;
        
        if (metaHbA1cContainer) {
            if (data.dm2) {
                metaHbA1cContainer.classList.remove('hidden');
                if (metaHbA1c) metaHbA1c.innerText = metas.metaHbA1c;
            } else {
                metaHbA1cContainer.classList.add('hidden');
            }
        }
        
        const avgLbl = document.getElementById('pa-avg-label');
        if (avgLbl) {
            avgLbl.innerText = htaRes.avgS > 0 ? `Prom.: ${htaRes.avgS}/${htaRes.avgD}` : '...';
            if (htaRes.avgS >= metas.metaPA.s || htaRes.avgD >= metas.metaPA.d) avgLbl.classList.add('text-red-500');
            else avgLbl.classList.remove('text-red-500');
        }

        // HEARTS UI
        const heartsSugg = document.getElementById('hearts-suggestion');
        if (heartsSugg) {
            const h = e.evaluateManejoHTA(data);
            const hStatus = document.getElementById('hearts-status-badge');
            const hFreq = document.getElementById('hearts-freq');
            const hStepLabel = document.getElementById('hearts-step-label');
            
            heartsSugg.innerText = h.sugerencia;
            if (hFreq) hFreq.innerText = `Próximo Control: ${h.frecuencia}`;
            if (hStepLabel) hStepLabel.innerText = `HEARTS: ${h.pasoActual.label}`;
            
            if (hStatus) {
                hStatus.innerText = h.enMeta ? 'EN META' : 'FUERA DE META';
                hStatus.className = `px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${h.enMeta ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
            }
        }

        // Radar de Crisis Hipertensiva
        const crisisContainer = document.getElementById('crisis-container');
        if (crisisContainer) {
            const pas1 = parseInt(data.pa1_s) || 0;
            const pad1 = parseInt(data.pa1_d) || 0;
            const pas2 = parseInt(data.pa2_s) || 0;
            const pad2 = parseInt(data.pa2_d) || 0;
            const pas3 = parseInt(data.pa3_s) || 0;
            const pad3 = parseInt(data.pa3_d) || 0;

            const isCrisis = (pas1 >= 180 || pad1 >= 110) || (pas2 >= 180 || pad2 >= 110) || (pas3 >= 180 || pad3 >= 110);

            if (isCrisis) {
                crisisContainer.classList.remove('hidden');
                crisisContainer.classList.add('animate-in', 'slide-in-from-top-4');
                
                const hasDamage = data.danio_torax || data.danio_vision || data.danio_neuro || data.danio_respi;
                const crisisText = "Derivo paciente a urgencias por sospecha de hipertensión severa con daño de órgano blanco, toma de presión de control y medidas antihipertensivas, realizar ECG.";
                
                if (hasDamage) {
                    if (!data.ind_farmacos) {
                        data.ind_farmacos = crisisText;
                    } else if (!data.ind_farmacos.includes("urgencias por sospecha")) {
                        data.ind_farmacos = crisisText + "\n\n" + data.ind_farmacos;
                    }
                    
                    const planInput = document.querySelector('textarea[name="ind_farmacos"]');
                    if (planInput && planInput.value !== data.ind_farmacos) {
                        planInput.value = data.ind_farmacos;
                        planInput.classList.add('border-red-500', 'bg-red-50');
                        setTimeout(() => planInput.classList.remove('border-red-500', 'bg-red-50'), 1500);
                    }
                }
            } else {
                crisisContainer.classList.add('hidden');
                data.danio_torax = false;
                data.danio_vision = false;
                data.danio_neuro = false;
                data.danio_respi = false;
            }
        }
    }
};
