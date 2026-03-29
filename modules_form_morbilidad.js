window.APS.formModules = window.APS.formModules || {};

window.APS.formModules.morbilidad = {
    sidebarSubtitle: 'Clinical Dashboard v2.0 · Morbilidad',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Ingreso general' },
        { id: 'clinico', label: '🩺 Evaluación', sub: 'Síntomas y examen' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Conducta y tratamiento' }
    ],
    getInitialState: () => ({
        edad: 0, sexo: 'F', peso: 0, talla: 0, imc: 0,
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
        if (tabId === 'datos') return `<div class="space-y-6"><h2 class="font-display text-3xl font-bold">Datos de Morbilidad</h2><div class="bg-white p-8 rounded-3xl border space-y-4"><input type="number" name="edad" value="${window.APS.state.edad}" placeholder="Edad" class="w-full border p-3 rounded-xl"><select name="sexo" class="w-full border p-3 rounded-xl"><option value="F" ${window.APS.state.sexo === 'F' ? 'selected' : ''}>Femenino</option><option value="M" ${window.APS.state.sexo === 'M' ? 'selected' : ''}>Masculino</option></select><div class="grid grid-cols-2 gap-4"><input type="number" name="peso" value="${window.APS.state.peso}" placeholder="Peso" class="w-full border p-3 rounded-xl"><input type="number" name="talla" value="${window.APS.state.talla}" placeholder="Talla" class="w-full border p-3 rounded-xl"></div><div class="bg-blue-600 text-white rounded-xl p-3">IMC: <span id="imc-display-val">${window.APS.state.imc || '--'}</span> · <span id="imc-desc">Evaluando...</span></div><textarea name="motivo_morb" class="w-full border p-3 rounded-xl h-20" placeholder="Motivo de consulta">${window.APS.state.motivo_morb}</textarea></div></div>`;
        if (tabId === 'clinico') return `<div class="space-y-6"><h2 class="font-display text-3xl font-bold">Evaluación Clínica</h2><div class="bg-white p-8 rounded-3xl border space-y-4">${window.APS.form.toggle('fiebre_morb','Fiebre')}${window.APS.form.toggle('tos_morb','Tos')}${window.APS.form.toggle('disnea_morb','Disnea')}<textarea name="sintomas_morb" class="w-full border p-3 rounded-xl h-24" placeholder="Evolución de síntomas">${window.APS.state.sintomas_morb}</textarea><textarea name="examen_morb" class="w-full border p-3 rounded-xl h-24" placeholder="Examen físico">${window.APS.state.examen_morb}</textarea><input name="diagnostico_morb" value="${window.APS.state.diagnostico_morb}" class="w-full border p-3 rounded-xl" placeholder="Diagnóstico"><textarea name="plan_morb" class="w-full border p-3 rounded-xl h-24" placeholder="Plan y tratamiento">${window.APS.state.plan_morb}</textarea></div></div>`;
        return `<div class="space-y-8 pb-20"><h2 class="font-display text-3xl font-bold">Nota & Plan Final</h2><div class="bg-white p-8 rounded-3xl border"><textarea name="ind_farmacos" class="w-full border p-6 rounded-3xl h-48" placeholder="Indicaciones adicionales">${window.APS.state.ind_farmacos}</textarea></div><div class="flex gap-4 justify-center p-8 bg-slate-950 rounded-[40px]"><button id="btn-toggle-modal" class="bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl text-[10px]">Ver Completo</button><button id="btn-copy-main" class="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl text-[10px]">Copiar Nota</button></div></div>`;
    }
};
