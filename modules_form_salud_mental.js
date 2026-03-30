window.APS.formModules = window.APS.formModules || {};

window.APS.formModules['salud-mental'] = {
    sidebarSubtitle: 'Clinical Dashboard v2.0 · Salud Mental',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Identificación clínica' },
        { id: 'tamizaje', label: '🧠 Tamizaje', sub: 'Estado emocional y riesgo' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Plan terapéutico' }
    ],
    getInitialState: () => ({ 
        tipo_atencion: 'control',
        historia_biografica: '',
        edad: '', sexo: 'F', motivo_consulta_sm: '', sintomas_sm: '',
        sueno_sm: 'conservado', apetito_sm: 'conservado', ansiedad_sm: false, depresion_sm: false,
        riesgo_suicida_sm: 'bajo', red_apoyo_sm: '', plan_sm: '', ind_farmacos: ''
    }),
    onStateChange: (name, state) => {
        if (name === 'tipo_atencion') {
            setTimeout(() => window.APS.form.render(), 10);
        }
    },
    generateText: (data) => {
        const h = window.APS.helpers;
        const flags = [];
        if (data.ansiedad_sm) flags.push('síntomas ansiosos');
        if (data.depresion_sm) flags.push('síntomas depresivos');
        const title = data.tipo_atencion === 'ingreso' ? 'INGRESO SALUD MENTAL' : 'CONTROL SALUD MENTAL';
        return `--- ${title} ---\n\n` +
            `[MOTIVO CONSULTA]\n${h.formatClinicalText(data.motivo_consulta_sm) || 'Sin motivo consignado.'}\n\n` +
            `[TAMIZAJE]\nPaciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}. ` +
            `Se pesquisan ${flags.join(' y ') || 'sin síntomas predominantes en tamizaje inicial'}. ` +
            `Sueño ${data.sueno_sm || 'no consignado'}, apetito ${data.apetito_sm || 'no consignado'}. ` +
            `Riesgo suicida: ${data.riesgo_suicida_sm || 'no evaluado'}.\n\n` +
            `[PLAN]\nRed de apoyo: ${h.formatClinicalText(data.red_apoyo_sm) || 'No descrita.'}\n` +
            `${h.formatClinicalText(data.plan_sm) || 'Se indica seguimiento en controles de salud mental APS.'}\n` +
            `${h.formatClinicalText(data.ind_farmacos) || ''}`;
    },
    renderTab: (tabId) => {
        const s = window.APS.state;
        const ui = window.APS.ui;

        if (tabId === 'datos') return `
            <div class="space-y-6 animate-in fade-in duration-500">
                <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Datos de Salud Mental</h2>
                    <div class="w-full sm:w-64">
                        ${ui.segmentedControl('tipo_atencion', [
                            {value: 'ingreso', label: 'Ingreso'},
                            {value: 'control', label: 'Control'}
                        ], s.tipo_atencion)}
                    </div>
                </header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        ${ui.inputNumber('edad', 'Edad', s.edad)}
                        ${ui.select('sexo', 'Sexo', [{value: 'F', label: 'Femenino'}, {value: 'M', label: 'Masculino'}], s.sexo)}
                    </div>
                    
                    ${s.tipo_atencion === 'ingreso' ? 
                        ui.textArea('historia_biografica', 'Historia Biográfica y Dinámica Familiar (Solo Ingreso)', s.historia_biografica, 'Hitos del desarrollo, relaciones significativas, red de apoyo estructural...') 
                        : ''
                    }

                    ${ui.textArea('motivo_consulta_sm', 'Motivo de consulta / Evolución', s.motivo_consulta_sm, 'Relato del paciente...')}
                </div>
            </div>`;

        if (tabId === 'tamizaje') return `
            <div class="space-y-6 animate-in fade-in duration-500">
                <header><h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Tamizaje Psicológico</h2></header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${ui.toggle('ansiedad_sm', 'Síntomas ansiosos', s.ansiedad_sm)}
                        ${ui.toggle('depresion_sm', 'Síntomas depresivos', s.depresion_sm)}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        ${ui.select('sueno_sm', 'Sueño', [{value: 'conservado', label: 'Conservado'}, {value: 'alterado', label: 'Alterado'}], s.sueno_sm)}
                        ${ui.select('apetito_sm', 'Apetito', [{value: 'conservado', label: 'Conservado'}, {value: 'alterado', label: 'Alterado'}], s.apetito_sm)}
                        ${ui.select('riesgo_suicida_sm', 'Riesgo Suicida', [{value: 'bajo', label: 'Bajo'}, {value: 'moderado', label: 'Moderado'}, {value: 'alto', label: 'Alto'}], s.riesgo_suicida_sm)}
                    </div>
                    ${ui.textArea('red_apoyo_sm', 'Red de apoyo', s.red_apoyo_sm, 'Con quién vive, apoyo familiar...')}
                    ${ui.textArea('plan_sm', 'Plan terapéutico y seguimiento', s.plan_sm, 'Derivaciones, consejería...')}
                </div>
            </div>`;

        return `
            <div class="space-y-8 pb-20 animate-in fade-in duration-500">
                <header><h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Nota & Plan Final</h2></header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    ${ui.textArea('ind_farmacos', 'Indicaciones Adicionales o Fármacos', s.ind_farmacos, 'Ej: Sertralina 50mg/día...')}
                </div>
                <div class="flex flex-col sm:flex-row gap-4 items-center justify-center p-10 bg-slate-900 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <button id="btn-toggle-modal" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all">Ver Completo</button>
                    <button id="btn-copy-main" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest transition-all border-b-4 border-blue-800">Copiar Nota</button>
                </div>
            </div>`;
    }
};
