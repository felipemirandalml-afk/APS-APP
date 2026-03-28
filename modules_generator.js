// modules_generator.js
window.APS.generator = {
    generateText: (data) => {
        const h = window.APS.helpers;
        const e = window.APS.evaluation;
        const isCV = data.module === 'cardiovascular';
        const isIngreso = data.type === 'ingreso';
        const htaRes = isCV ? e.evaluateHTA(data) : {};
        const rcv = isCV ? e.calculateRCV(data) : null;
        const metas = isCV ? e.getPSCVMeta(data) : {};

        let text = `=== NOTA CLÍNICA - ${data.module.toUpperCase()} (${data.type.toUpperCase()}) ===\n\n`;

        // 1. ANTECEDENTES Y ANTROPOMETRÍA
        text += `[EV CLÍNICA]\n`;
        text += `Paciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}.\n`;
        if (data.peso && data.talla) {
            text += `Antropometría: Peso ${data.peso} kg, Talla ${data.talla} cm (IMC ${data.imc || '--'}). `;
        }
        if (data.cintura) text += `Cintura: ${data.cintura} cm. `;
        
        const comorbidities = ['hta', 'dm2', 'erc', 'dislipidemia', 'tabaquismo']
            .filter(key => data[key]).map(key => key.toUpperCase()).join(', ');
        if (comorbidities) text += `\nAntecedentes: ${comorbidities}.`;
        
        if (isCV && rcv) {
            text += `\nRCV: ${rcv.level.toUpperCase()} (${rcv.method}). Fundamento: ${rcv.reason}.`;
            if (metas.metaPA) text += ` Meta PA: ${metas.metaPA.label}. Meta LDL: < ${metas.metaLDL}.`;
        }
        text += `\n\n`;

        // 2. EXAMEN FÍSICO
        text += `[EXAMEN FÍSICO]\n`;
        text += window.APS.generator.buildPhysicalExamSegmentary(data);
        if (isCV && htaRes.avgS) {
            text += `\nPA de evaluación: ${htaRes.avgS}/${htaRes.avgD} mmHg. Clasificación: ${htaRes.classification}.`;
        }
        text += `\n\n`;

        // 3. EXÁMENES SOLICITADOS (Nuevo bloque para Ingreso CV)
        if (isIngreso && isCV) {
            const examString = window.APS.generator.buildExamString(data);
            if (examString) {
                text += `[EXÁMENES SOLICITADOS]\n`;
                text += `${examString}\n\n`;
            }
        }

        // 4. EVALUACIÓN Y PLAN
        text += `[PLAN E INDICACIONES]\n`;
        text += `Control: ${e.evaluateStatus(data).text.toUpperCase()}.\n`;
        text += `${data.ind_farmacos || 'Mantener indicaciones farmacológicas vigentes y enfatizar cambios estilo vida saludable.'}\n`;

        return text;
    },

    // Construye el texto de exámenes solicitados (Refactorizado)
    buildExamString: (data) => {
        // Exámenes PSCV Básicos
        const basicExams = [];
        if (data.ex_hematocrito) basicExams.push("hematocrito");
        if (data.ex_orina) basicExams.push("orina completa");
        if (data.ex_glicemia) basicExams.push("glicemia");
        if (data.ex_electrolitos) basicExams.push("electrolitos plasmáticos");
        if (data.ex_lipidos) basicExams.push("perfil lipídico");
        if (data.ex_creatinina) basicExams.push("creatinina plasmática");
        if (data.ex_uricemia) basicExams.push("uricemia");
        if (data.ex_ecg) basicExams.push("ECG");

        if (basicExams.length === 0 && !data.ex_rac && !data.ex_hba1c && !data.ex_fo && !data.ex_tsh && !data.ex_calcio) return "";

        let res = `Se solicitan exámenes de ingreso a PSCV: ${basicExams.join(", ")}.`;

        // Adicionales por comorbilidad
        const addExams = [];
        if (data.ex_rac) addExams.push("razón albúmina-creatinina (RAC)");
        if (data.ex_hba1c) addExams.push("HbA1c");
        if (data.ex_fo) addExams.push("fondo de ojo");

        if (addExams.length > 0) {
            const reason = data.dm2 ? "diabetes mellitus" : "hipertensión arterial";
            res += ` Por antecedente de ${reason}, se agrega ${addExams.join(", ")}.`;
        }

        // Complementarios
        const extraExams = [];
        if (data.ex_tsh) extraExams.push("TSH");
        if (data.ex_calcio) extraExams.push("calcio sérico");

        if (extraExams.length > 0) {
            res += ` Además, se solicitan exámenes complementarios: ${extraExams.join(" y ")}.`;
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
            extremidades: "Extremidades simétricas, sin edema, pulso periférico presente, sensibilidad conservada.",
            piel: "" 
        };

        if (data.hallazgo_crepitos) {
            const loc = { 'bilateral': 'bilaterales', 'izquierdo': 'en campo pulmonar izquierdo', 'derecho': 'en campo pulmonar derecho', 'bases': 'en bases' };
            s.pulmonar = `Murmullo pulmonar presente con crépitos ${loc[data.hallazgo_crepitos_tipo] || 'bilaterales'}.`;
        }
        if (data.hallazgo_edema) {
            const loc = { 'bilateral': 'bilateral en EEII', 'izquierdo': 'en EEII izquierda', 'derecho': 'en EEII derecha' };
            s.extremidades = `Extremidades con edema ${loc[data.hallazgo_edema_tipo] || 'bilateral'}, pulso periférico presente.`;
        }
        if (data.hallazgo_acantosis) s.piel = "Piel con presencia de acantosis nigricans.";

        let res = `${s.general} ${s.mucosas} ${s.cuello} ${s.cardiaco} ${s.pulmonar} ${s.abdomen} ${s.extremidades}`;
        if (s.piel) res += " " + s.piel;
        if (data.examen_fisico?.trim()) res += ` Además, destaca: ${h.formatClinicalText(data.examen_fisico)}.`;

        return res;
    }
};