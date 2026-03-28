// modules_generator.js
window.APS.generator = {
    generateText: (data) => {
        const h = window.APS.helpers;
        const e = window.APS.evaluation;
        const isCV = data.module === 'cardiovascular';
        const isIngreso = data.type === 'ingreso';

        let text = `=== NOTA CLÍNICA - ${data.module.toUpperCase()} (${data.type.toUpperCase()}) ===\n\n`;
        
        // 1. EVALUACIÓN CLÍNICA Y ANTROPOMETRÍA
        text += `[EV CLÍNICA]\n`;
        text += `Paciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}.\n`;
        if (data.peso && data.talla) {
            text += `Peso: ${data.peso} kg, Talla: ${data.talla} cm (IMC ${data.imc || '--'}). `;
            if (data.cintura) text += `Cintura: ${data.cintura} cm.`;
            text += `\n`;
        }
        
        if (isCV) {
            const rcv = e.calculateRCV(data);
            const { metaPA, metaLDL } = e.getPSCVMeta(data);
            text += `RCV: ${rcv.level.toUpperCase()} (${rcv.method}). Fundamento: ${rcv.reason}.\n`;
            text += `Meta PA: ${metaPA.label}. Meta LDL: < ${metaLDL} mg/dL.\n`;
        }
        
        // 2. EXAMEN FÍSICO (Lógica segmentaria)
        text += `\n[EXAMEN FÍSICO]\n`;
        text += window.APS.generator.buildPhysicalExamSegmentary(data);
        
        const htaRes = e.evaluateHTA(data);
        if (isCV && htaRes.avgS) {
            text += `\nPA de evaluación: ${htaRes.avgS}/${htaRes.avgD} mmHg (${htaRes.methodLabel}). Clasificación: ${htaRes.classification}.`;
        }
        text += `\n\n`;

        // 3. EXÁMENES SOLICITADOS (Nuevo bloque dinámico para Ingreso CV)
        if (isIngreso && isCV) {
            const examString = window.APS.generator.buildExamString(data);
            if (examString) {
                text += `[EXÁMENES SOLICITADOS]\n`;
                text += `${examString}\n\n`;
            }
        }

        // 4. PLAN E INDICACIONES
        text += `[PLAN E INDICACIONES]\n`;
        text += `Control: ${e.evaluateStatus(data).text.toUpperCase()}.\n`;
        
        if (isCV) {
            const h = e.evaluateManejoHTA(data);
            if (h.pasoActual.id === 0 && !h.enMeta) {
                text += `Medidas no farmacológicas: restricción de sodio, alimentación saludable, actividad física y cese de tabaco. `;
                text += `Dado cifras fuera de meta, se propone iniciar Paso 1 HEARTS (${h.nextPaso.drugs}). `;
            } else if (!h.enMeta) {
                text += `Paciente fuera de meta en su esquema actual (${h.pasoActual.label}). Se sugiere ajustar a ${h.nextPaso.label}: ${h.nextPaso.drugs}. `;
            } else {
                text += `PA en rango meta. Mantener esquema actual (${h.pasoActual.label}). `;
            }
            text += `Control en ${h.frecuencia}.\n`;
        }

        text += `${data.ind_farmacos || (isCV ? '' : 'Mantener indicaciones farmacológicas vigentes y enfatizar cambios estilo vida saludable.')}`;

        return text;
    },

    // Construye el texto de exámenes solicitados
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

    // Genera el examen físico segmentario para evitar contradicciones
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