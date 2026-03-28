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
            alert("¡Copiado al portapapeles!");
        } catch (err) {
            alert("Error al copiar.");
        }
    },

    // Formatea el texto clínico: capitaliza y asegura punto final
    formatClinicalText: (str) => {
        if (!str || typeof str !== 'string') return "";
        let s = str.trim();
        if (s.length === 0) return "";
        
        // Capitalizar primera letra
        s = s.charAt(0).toUpperCase() + s.slice(1);
        
        // Asegurar punto final si no tiene ya puntuación final (. ! ?)
        if (!/[.!?]$/.test(s)) s += ".";
        
        return s;
    }
};