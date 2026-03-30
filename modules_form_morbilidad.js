window.APS.formModules = window.APS.formModules || {};

window.APS.formModules.morbilidad = {
    sidebarSubtitle: 'Clinical Dashboard v2.0 · Morbilidad',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Ingreso general' },
        { id: 'clinico', label: '🩺 Evaluación', sub: 'Síntomas y examen' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Conducta y tratamiento' }
    ],
    getInitialState: () => ({
        edad: '', sexo: 'F', peso: '', talla: '', imc: '',
        motivo_morb: '', sintomas_morb: '', fiebre_morb: false, tos_morb: false, disnea_morb: false,
        examen_morb: '', diagnostico_morb: '', plan_morb: '', ind_farmacos: ''
    }),
    generateText: (data) => {
        const h = window.APS.helpers;
        const sintomas = [];
        if (data.fiebre_morb) sintomas.push('fiebre');
        if (data.tos_morb) sintomas.push('tos');
        if (data.disnea_morb) sintomas.push('disnea');
        return `=== NOTA CLÍNICA - MORBILIDAD (${data.type.toUpperCase()}) ===\n\n` +
            `[ANAMNESIS]\nPaciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}. ` +
            `Motivo: ${h.formatClinicalText(data.motivo_morb) || 'Sin motivo consignado.'} ` +
            `Síntomas principales: ${sintomas.join(', ') || 'no referidos en checklist'}. ` +
            `${h.formatClinicalText(data.sintomas_morb) || ''}\n\n` +
            `[EXAMEN FÍSICO]\n${h.formatClinicalText(data.examen_morb) || 'Sin hallazgos relevantes consignados.'}\n\n` +
            `[IMPRESIÓN DIAGNÓSTICA]\n${h.formatClinicalText(data.diagnostico_morb) || 'Diagnóstico en evaluación.'}\n\n` +
            `[PLAN]\n${h.formatClinicalText(data.plan_morb) || 'Manejo sintomático, signos de alarma y control según evolución.'}\n` +
            `${h.formatClinicalText(data.ind_farmacos) || ''}`;
    },
    renderTab: (tabId) => {
        const s = window.APS.state;
        const ui = window.APS.ui;

        if (tabId === 'datos') return `
            <div class="space-y-6 animate-in fade-in duration-500">
                <header><h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Datos de Morbilidad</h2></header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        ${ui.inputNumber('edad', 'Edad', s.edad)}
                        ${ui.select('sexo', 'Sexo', [{value: 'F', label: 'Femenino'}, {value: 'M', label: 'Masculino'}], s.sexo)}
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        ${ui.inputNumber('peso', 'Peso (kg)', s.peso)}
                        ${ui.inputNumber('talla', 'Talla (cm)', s.talla)}
                    </div>
                    <div class="bg-blue-600 text-white rounded-2xl p-4 shadow-lg shadow-blue-200/50 flex justify-between items-center">
                        <div>
                            <p class="text-[10px] font-black uppercase opacity-70">Índice de Masa Corporal</p>
                            <p class="text-2xl font-black"><span id="imc-display-val">${s.imc || '--'}</span></p>
                        </div>
                        <div id="imc-desc" class="text-xs font-bold px-3 py-1 bg-white/20 rounded-full">Evaluando...</div>
                    </div>
                    ${ui.textArea('motivo_morb', 'Motivo de consulta', s.motivo_morb, 'Describa el motivo principal...')}
                </div>
            </div>`;

        if (tabId === 'clinico') return `
            <div class="space-y-6 animate-in fade-in duration-500">
                <header><h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Evaluación Clínica</h2></header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        ${ui.toggle('fiebre_morb', 'Fiebre', s.fiebre_morb)}
                        ${ui.toggle('tos_morb', 'Tos', s.tos_morb)}
                        ${ui.toggle('disnea_morb', 'Disnea', s.disnea_morb)}
                    </div>
                    ${ui.textArea('sintomas_morb', 'Evolución de síntomas', s.sintomas_morb, 'Detalles de los síntomas...')}
                    ${ui.textArea('examen_morb', 'Examen Físico', s.examen_morb, 'Hallazgos al examen físico...')}
                    <div class="space-y-1 mt-4">
                        <label class="text-[10px] font-black uppercase text-slate-400 ml-1">Diagnóstico</label>
                        <input type="text" name="diagnostico_morb" value="${s.diagnostico_morb}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all font-bold" placeholder="Impresión diagnóstica...">
                    </div>
                    ${ui.textArea('plan_morb', 'Plan y Tratamiento', s.plan_morb, 'Indicaciones generales...')}
                </div>
            </div>`;

        return `
            <div class="space-y-8 pb-20 animate-in fade-in duration-500">
                <header><h2 class="font-display text-3xl font-bold text-slate-900 tracking-tight">Nota & Plan Final</h2></header>
                <div class="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    ${ui.textArea('ind_farmacos', 'Indicaciones Adicionales o Fármacos', s.ind_farmacos, 'Recetas, derivaciones, reposo...')}
                </div>
                <div class="flex flex-col sm:flex-row gap-4 items-center justify-center p-10 bg-slate-900 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <button id="btn-toggle-modal" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all">Ver Completo</button>
                    <button id="btn-copy-main" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl text-[10px] uppercase tracking-widest transition-all border-b-4 border-blue-800">Copiar Nota</button>
                </div>
            </div>`;
    }
};
