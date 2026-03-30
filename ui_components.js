// ui_components.js
window.APS.ui = {
    inputNumber: (name, label, value) => `
        <div class="space-y-1">
            <label class="text-xs font-black uppercase text-slate-500 ml-1">${label}</label>
            <input type="number" name="${name}" value="${value}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm">
        </div>
    `,

    textArea: (name, label, value, placeholder) => `
         <div class="mt-4">
            <label class="text-xs font-black uppercase text-slate-500 ml-1">${label}</label>
            <textarea name="${name}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all text-sm h-12 mt-1" placeholder="${placeholder}">${value}</textarea>
        </div>
    `,

    select: (name, label, options, currentValue) => `
        <div class="space-y-1">
            <label class="text-xs font-black uppercase text-slate-500 ml-1">${label}</label>
            <select name="${name}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm">
                ${options.map(opt => `<option value="${opt.value}" ${currentValue == opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
        </div>
    `,

    toggle: (name, label, isChecked) => `
        <label class="flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group select-none ${isChecked ? 'border-blue-100 bg-blue-50/50' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}">
            <span class="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">${label}</span>
            <input type="checkbox" name="${name}" class="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" ${isChecked ? 'checked' : ''}>
        </label>
    `,

    toggleCompact: (name, label, isChecked) => `
        <label class="flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group select-none ${isChecked ? 'border-blue-100 bg-blue-50/50' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}">
            <span class="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">${label}</span>
            <input type="checkbox" name="${name}" class="w-4 h-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" ${isChecked ? 'checked' : ''}>
        </label>
    `,

    toggleWhite: (name, label, isChecked) => `
        <label class="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer group select-none border border-white/10">
            <span class="text-sm font-bold text-white">${label}</span>
            <input type="checkbox" name="${name}" class="w-5 h-5 rounded-lg bg-transparent border-white/30 text-white focus:ring-white transition-all cursor-pointer" ${isChecked ? 'checked' : ''}>
        </label>
    `
};
