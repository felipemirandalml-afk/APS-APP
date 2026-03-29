// modules_helpers.js
window.APS.helpers = {
    calculateBMI: (weight, height) => {
        if (!weight || !height) return 0;
        const h = height / 100;
        return (weight / (h * h)).toFixed(1);
    },

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Error al copiar portapapeles.");
        }
    },

    formatClinicalText: (str) => {
        if (!str || typeof str !== 'string') return "";
        let s = str.trim();
        if (s.length === 0) return "";
        s = s.charAt(0).toUpperCase() + s.slice(1);
        if (!/[.!?]$/.test(s)) s += ".";
        return s;
    },

    getIMCCategory: (imc, age) => {
        const val = parseFloat(imc);
        if (!val || val === 0) return { label: 'Sin datos', color: 'gray' };
        if (val < 18.5) return { label: 'Bajo Peso', color: 'yellow' };
        if (val < 25) return { label: 'Normal', color: 'green' };
        if (val < 30) return { label: 'Sobrepeso', color: 'yellow' };
        return { label: 'Obesidad', color: 'red' };
    }
};