// ui_components.js
window.APS.ui = {
    inputNumber: (name, label, value) => `
        <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-1">${label}</label>
            <input type="number" name="${name}" value="${value}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all font-bold">
        </div>
    `,
    textArea: (name, label, value, placeholder) => `
         <div class="mt-4">
            <label class="text-[10px] font-black uppercase text-slate-400 ml-1">${label}</label>
            <textarea name="${name}" class="w-full border-2 border-slate-50 p-3 rounded-xl focus:border-blue-500 outline-none transition-all text-sm h-12 mt-1" placeholder="${placeholder}">${value}</textarea>
        </div>
    `
};
