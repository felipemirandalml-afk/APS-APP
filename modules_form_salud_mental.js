window.APS.formModules = window.APS.formModules || {};

window.APS.formModules['salud-mental'] = {
    sidebarSubtitle: 'Clinical Dashboard v2.0 · Salud Mental',
    getTabs: () => [
        { id: 'datos', label: '👤 Datos Paciente', sub: 'Identificación clínica' },
        { id: 'tamizaje', label: '🧠 Tamizaje', sub: 'Estado emocional y riesgo' },
        { id: 'nota', label: '📝 Nota Final', sub: 'Plan terapéutico' }
    ],
    getInitialState: () => ({
        edad: 0, sexo: 'F', motivo_consulta_sm: '', sintomas_sm: '',
        sueno_sm: 'conservado', apetito_sm: 'conservado', ansiedad_sm: false, depresion_sm: false,
        riesgo_suicida_sm: 'bajo', red_apoyo_sm: '', plan_sm: '', ind_farmacos: ''
    }),
    renderTab: (tabId) => {
        if (tabId === 'datos') return `
            <div class="space-y-6"><h2 class="font-display text-3xl font-bold">Datos de Salud Mental</h2>
            <div class="bg-white p-8 rounded-3xl border space-y-4">
                <input type="number" name="edad" value="${window.APS.state.edad}" placeholder="Edad" class="w-full border p-3 rounded-xl">
                <select name="sexo" class="w-full border p-3 rounded-xl"><option value="F" ${window.APS.state.sexo === 'F' ? 'selected' : ''}>Femenino</option><option value="M" ${window.APS.state.sexo === 'M' ? 'selected' : ''}>Masculino</option></select>
                <textarea name="motivo_consulta_sm" class="w-full border p-3 rounded-xl h-24" placeholder="Motivo de consulta">${window.APS.state.motivo_consulta_sm}</textarea>
            </div></div>`;
        if (tabId === 'tamizaje') return `
            <div class="space-y-6"><h2 class="font-display text-3xl font-bold">Tamizaje Psicológico</h2>
            <div class="bg-white p-8 rounded-3xl border space-y-4">
                ${window.APS.form.toggle('ansiedad_sm', 'Síntomas ansiosos')}
                ${window.APS.form.toggle('depresion_sm', 'Síntomas depresivos')}
                <select name="sueno_sm" class="w-full border p-3 rounded-xl"><option value="conservado" ${window.APS.state.sueno_sm === 'conservado' ? 'selected' : ''}>Sueño conservado</option><option value="alterado" ${window.APS.state.sueno_sm === 'alterado' ? 'selected' : ''}>Sueño alterado</option></select>
                <select name="apetito_sm" class="w-full border p-3 rounded-xl"><option value="conservado" ${window.APS.state.apetito_sm === 'conservado' ? 'selected' : ''}>Apetito conservado</option><option value="alterado" ${window.APS.state.apetito_sm === 'alterado' ? 'selected' : ''}>Apetito alterado</option></select>
                <select name="riesgo_suicida_sm" class="w-full border p-3 rounded-xl"><option value="bajo" ${window.APS.state.riesgo_suicida_sm === 'bajo' ? 'selected' : ''}>Riesgo suicida bajo</option><option value="moderado" ${window.APS.state.riesgo_suicida_sm === 'moderado' ? 'selected' : ''}>Riesgo suicida moderado</option><option value="alto" ${window.APS.state.riesgo_suicida_sm === 'alto' ? 'selected' : ''}>Riesgo suicida alto</option></select>
                <textarea name="red_apoyo_sm" class="w-full border p-3 rounded-xl h-20" placeholder="Red de apoyo">${window.APS.state.red_apoyo_sm}</textarea>
                <textarea name="plan_sm" class="w-full border p-3 rounded-xl h-24" placeholder="Plan terapéutico y seguimiento">${window.APS.state.plan_sm}</textarea>
            </div></div>`;
        return `<div class="space-y-8 pb-20"><h2 class="font-display text-3xl font-bold">Nota & Plan Final</h2><div class="bg-white p-8 rounded-3xl border"><textarea name="ind_farmacos" class="w-full border p-6 rounded-3xl h-48" placeholder="Indicaciones adicionales">${window.APS.state.ind_farmacos}</textarea></div><div class="flex gap-4 justify-center p-8 bg-slate-950 rounded-[40px]"><button id="btn-toggle-modal" class="bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl text-[10px]">Ver Completo</button><button id="btn-copy-main" class="bg-blue-600 text-white font-black py-4 px-10 rounded-2xl text-[10px]">Copiar Nota</button></div></div>`;
    }
};
