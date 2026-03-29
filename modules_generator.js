// modules_generator.js
window.APS.generator = {
    generateText: (data) => {
        // Obtenemos la definición del módulo activo
        // El estado data.module nos dice qué módulo usar (cardiovascular, salud-mental, morbilidad)
        const moduleDef = window.APS.formModules[data.module];

        if (moduleDef && typeof moduleDef.generateText === 'function') {
            return moduleDef.generateText(data);
        }

        return "Error: Generador de texto no definido para este módulo.";
    },

    // Métodos auxiliares que pueden ser usados por los módulos
    buildExamString: (data) => {
        const basics = [];
        if (data.ex_hematocrito) basics.push("hematocrito");
        if (data.ex_orina) basics.push("orina completa");
        if (data.ex_glicemia) basics.push("glicemia");
        if (data.ex_electrolitos) basics.push("electrolitos plasmáticos");
        if (data.ex_lipidos) basics.push("perfil lipídico");
        if (data.ex_creatinina) basics.push("creatinina plasmática");
        if (data.ex_uricemia) basics.push("uricemia");
        if (data.ex_ecg) basics.push("ECG");

        if (basics.length === 0 && !data.ex_rac && !data.ex_hba1c && !data.ex_fo) return "";

        let res = `Se solicitan exámenes de ingreso a PSCV: ${basics.join(", ")}.`;

        const adds = [];
        if (data.ex_rac) adds.push("RAC");
        if (data.ex_hba1c) adds.push("HbA1c");
        if (data.ex_fo) adds.push("fondo de ojo");

        if (adds.length > 0) {
            const reason = (data.dm2) ? "diabetes mellitus" : "comorbilidad cardiovascular";
            res += ` Por antecedente de ${reason}, se agrega ${adds.join(" y ")}.`;
        }
        return res;
    },

    buildPhysicalExamSegmentary: (data) => {
        const h = window.APS.helpers;
        const s = {
            general: "Paciente en buenas condiciones generales, vigil, hemodinámicamente estable.",
            mucosas: "Mucosas orales hidratadas, conjuntivas rosadas.",
            cuello: "Cuello móvil, sin adenopatías palpables.",
            cardiaco: "Ruidos cardíacos rítmicos en dos tiempos, sin soplos.",
            pulmonar: "Murmullo pulmonar presente bilateral, sin ruidos agregados.",
            abdomen: "Abdomen blando, depresible, indoloro a la palpación.",
            extremidades: "Extremidades simétricas, sin edema, pulso periférico presente, sensibilidad conservada."
        };

        if (data.hallazgo_crepitos) s.pulmonar = "Murmullo pulmonar con presencia de crépitos.";
        if (data.hallazgo_edema) s.extremidades = "Extremidades con presencia de edema en EEII, pulso presente.";
        if (data.hallazgo_acantosis) s.general += " Se observa presencia de acantosis nigricans.";

        let res = `${s.general} ${s.mucosas} ${s.cuello} ${s.cardiaco} ${s.pulmonar} ${s.abdomen} ${s.extremidades}`;
        if (data.examen_fisico?.trim()) res += ` Además, destaca: ${h.formatClinicalText(data.examen_fisico)}`;
        return res;
    }
};
