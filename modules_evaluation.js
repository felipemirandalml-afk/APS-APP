// modules_evaluation.js
window.APS.evaluation = {
    // Determina las metas personalizadas del PSCV
    getPSCVMeta: (data) => {
        const age = parseInt(data.edad) || 0;
        const rcv = window.APS.evaluation.calculateRCV(data).level;
        const isDM2 = !!data.dm2;
        const isERC = !!data.erc;
        const isRAC30 = !!data.rac30;
        const isFragil = !!data.fragilidad;

        // Meta PA
        let metaPA = { s: 140, d: 90, label: "< 140/90 mmHg" };
        if (age >= 80) {
            metaPA = { s: 150, d: 90, label: "< 150/90 mmHg (Evitar < 120/60)" };
        } else if (isERC && isRAC30) {
            metaPA = { s: 130, d: 80, label: "< 130/80 mmHg" };
        }

        // Meta LDL
        let metaLDL = 130;
        if (rcv === 'Alto') metaLDL = 70;
        else if (rcv === 'Moderado') metaLDL = 100;

        // Meta HbA1c
        let metaHbA1c = "N/A";
        if (isDM2) {
            metaHbA1c = (age >= 80 || isFragil) ? "Individualizada" : "< 7%";
        }

        return { metaPA, metaLDL, metaHbA1c, rcv };
    },

    // Lógica avanzada de Riesgo Cardiovascular (RCV) Chileno APS
    calculateRCV: (data) => {
        const age = parseInt(data.edad) || 0;
        const isMale = data.sexo === 'M';
        const waist = parseInt(data.cintura) || 0;
        const htaRes = window.APS.evaluation.evaluateHTA(data);
        
        // 1. Criterios Directos de Riesgo ALTO
        let directReason = "";
        if (data.ecv_ateroesclerotica) directReason = "ECV ateroesclerótica documentada";
        else if (data.dm2) directReason = "Diabetes mellitus";
        else if (data.erc_avanzada || (data.erc && data.erc_etapa >= 3)) directReason = "Enfermedad renal crónica avanzada";
        else if (data.albuminuria_ms) directReason = "Albuminuria moderada/severa";
        else if (data.hta_refractaria) directReason = "HTA refractaria";
        else if (data.ldl_190) directReason = "LDL > 190 mg/dL / Dislipidemia severa";
        else if (data.hipercolesterolemia_familiar) directReason = "Hipercolesterolemia familiar";
        else if (age >= 80) directReason = "Edad ≥ 80 años";

        if (directReason) {
            return { level: 'Alto', method: 'Criterio directo', reason: directReason, modifiersActive: false };
        }

        // 2. Estimación Simplificada (si no hay criterios directos)
        let riskFactors = [];
        if (data.tabaquismo) riskFactors.push("Tabaquismo");
        if (data.hta) riskFactors.push("HTA diagnosticada");
        if (data.dislipidemia) riskFactors.push("Dislipidemia");
        if (age >= 40) riskFactors.push("Edad ≥ 40 años");
        if (htaRes.avgS >= 140 || htaRes.avgD >= 90) riskFactors.push("PA elevada en consulta");
        if (data.af_ecv_prematura) riskFactors.push("Antecedente familiar ECV prematura");
        
        // Obesidad Abdominal (90/80)
        if ((isMale && waist >= 90) || (!isMale && waist >= 80)) {
            riskFactors.push("Obesidad abdominal");
        }

        let level = 'Bajo';
        if (riskFactors.length >= 3) level = 'Alto';
        else if (riskFactors.length >= 1) level = 'Moderado';

        // 3. Modificadores de Riesgo
        let modifiers = [];
        if (data.af_ecv_prematura) modifiers.push("AF ECV Prematura");
        if (data.ante_obstetricos) modifiers.push("Antecedentes obstétricos riesgo");
        if (data.menopausia_precoz) modifiers.push("Menopausia precoz");
        if (data.enf_autoinmune) modifiers.push("Enfermedad autoinmune");
        if (data.vih) modifiers.push("VIH");
        if (data.trastorno_mental) modifiers.push("Trastorno mental grave");
        if (data.cac_elevado) modifiers.push("CAC elevado");

        let note = "";
        if (level === 'Bajo' && modifiers.length >= 2) {
            level = 'Moderado';
            note = "Reclasificado por modificadores";
        } else if (level === 'Moderado' && modifiers.length >= 2) {
            note = "Considerar reclasificación por modificadores";
        }

        return { 
            level, 
            method: 'Estimación simplificada', 
            reason: riskFactors.length > 0 ? riskFactors.join(" + ") : "Sin factores de riesgo clásicos",
            note,
            modifiers: modifiers.join(", ")
        };
    },

    evaluateHTA: (data) => {
        const p1s = parseInt(data.pa1_s) || 0;
        const p1d = parseInt(data.pa1_d) || 0;
        const p2s = parseInt(data.pa2_s) || 0;
        const p2d = parseInt(data.pa2_d) || 0;
        const p3s = parseInt(data.pa3_s) || 0;
        const p3d = parseInt(data.pa3_d) || 0;

        let numTomas = 1;
        if (data.show_pa3) numTomas = 3;
        else if (data.show_pa2) numTomas = 2;

        let avgS = 0, avgD = 0;
        let methodLabel = "";

        if (numTomas === 3 && p2s && p3s) {
            avgS = Math.round((p2s + p3s) / 2);
            avgD = Math.round((p2d + p3d) / 2);
            methodLabel = "Promedio de 2da y 3ra toma";
        } else if (numTomas === 2 && p1s && p2s) {
            avgS = Math.round((p1s + p2s) / 2);
            avgD = Math.round((p1d + p2d) / 2);
            methodLabel = "Promedio de ambas tomas";
        } else if (p1s) {
            avgS = p1s;
            avgD = p1d;
            methodLabel = "Basado en toma única";
        }

        let classification = "Normal";
        let alerts = [];
        let isEmergency = false;
        let isSevere = false;

        if (avgS >= 180 || avgD >= 110) {
            isSevere = true;
            classification = "HTA Severa";
            if (data.danio_torax || data.danio_disnea || data.danio_neuro || data.danio_vision || data.danio_confusion || data.danio_cefalea) {
                isEmergency = true;
                classification = "SOSPECHA DE EMERGENCIA HIPERTENSIVA";
                alerts.push("URGENTE: Derivación inmediata a centro de mayor complejidad.");
            } else {
                alerts.push("HTA Severa sin emergencia: Ajustar fármacos VO. Evitar sublinguales.");
            }
        } else if (avgS >= 140 || avgD >= 90) {
            classification = "PA Elevada";
            if (data.diagnostico_hta === 'pendiente') {
                alerts.push("Requiere confirmación diagnóstica fuera de consulta.");
            }
        }

        return { avgS, avgD, classification, alerts, isEmergency, isSevere, methodLabel, numTomas };
    },

    evaluateStatus: (data) => {
        if (data.module !== 'cardiovascular') {
            let isCompensated = true;
            let evaluationText = [];
            const imc = window.APS.helpers.calculateBMI(data.peso, data.talla);
            if (imc >= 30) evaluationText.push("Obesidad");
            return { isCompensated, text: evaluationText.join(", ") || "Parámetros aceptables." };
        }

        const htaResult = window.APS.evaluation.evaluateHTA(data);
        const metas = window.APS.evaluation.getPSCVMeta(data);
        
        let isCompensated = true;
        let evaluationText = [];

        const pas = htaResult.avgS;
        const pad = htaResult.avgD;

        if (pas > 0 && pad > 0) {
            if (pas >= metas.metaPA.s || pad >= metas.metaPA.d) {
                isCompensated = false;
                evaluationText.push(`PA fuera de meta`);
            }
        }

        const imc = window.APS.helpers.calculateBMI(data.peso, data.talla);
        if (imc >= 30) evaluationText.push("Obesidad");

        return { isCompensated, text: evaluationText.join(". ") || (isCompensated ? "En rango meta." : "Fuera de meta.") };
    },

    getIngresoExams: () => "- Perfil lipídico\n- HbA1c\n- Creatinina\n- RAC\n- Electrolitos\n- ECG"
};