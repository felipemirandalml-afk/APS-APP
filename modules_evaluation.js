// modules_evaluation.js
window.APS.evaluation = {
    // Determina las metas personalizadas del PSCV
    getPSCVMeta: (data) => {
        const age = parseInt(data.edad) || 0;
        const isDM2 = !!data.dm2;
        const isERC = !!data.erc_avanzada;
        const isRAC30 = !!data.albuminuria_ms;

        // Meta MINSAL
        let metaPA = { s: 140, d: 90 };
        if (age >= 80) metaPA = { s: 150, d: 90 };
        if (isERC && isRAC30) metaPA = { s: 130, d: 80 };

        // Meta Internacional (AHA/ESC 2024)
        let metaPA_intl = { s: 130, d: 80 };
        if (age >= 80) metaPA_intl = { s: 140, d: 90 }; // Tolerancia geriátrica

        let metaHbA1c = '< 7%';
        if (age >= 75) metaHbA1c = '< 8%';

        let metaLDL = '< 100 mg/dL';
        const rcvLevel = window.APS.evaluation.calculateRCV(data).level;
        if (rcvLevel === 'ALTO' || rcvLevel === 'Alto') metaLDL = '< 70 mg/dL';
        if (rcvLevel === 'MUY ALTO' || rcvLevel === 'Muy Alto' || data.ecv_ateroesclerotica) metaLDL = '< 55 mg/dL';

        return { metaPA, metaPA_intl, metaHbA1c, metaLDL };
    },

    // Lógica avanzada de Riesgo Cardiovascular (RCV) Chileno APS
    calculateRCV: (data) => {
        const age = parseInt(data.edad) || 0;
        const isMale = data.sexo === 'M';
        const waist = parseInt(data.cintura) || 0;
        const htaRes = window.APS.evaluation.evaluateHTA(data);
        
        // 1. Criterios Directos de Riesgo ALTO
        let directReason = "";
        if (data.ecv_ateroesclerotica) directReason = "Enfermedad Cardiovascular Ateroesclerótica documentada";
        else if (data.dm2) directReason = "Diabetes Mellitus tipo 2";
        else if (data.erc_avanzada) directReason = "Enfermedad Renal Crónica avanzada (Etapa 3 a 5)";
        else if (data.albuminuria_ms) directReason = "Albuminuria moderada o severa (RAC > 30)";
        else if (data.hta_refractaria) directReason = "Hipertensión Arterial Refractaria";
        else if (data.ldl_190) directReason = "Dislipidemia severa (LDL > 190 mg/dL)";
        else if (data.hipercolesterolemia_familiar) directReason = "Hipercolesterolemia familiar";
        else if (age >= 80) directReason = "Adulto Mayor (Edad ≥ 80 años)";

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
            // Norma Chilena: Promedio de 2da y 3ra toma
            avgS = Math.round((p2s + p3s) / 2);
            avgD = Math.round((p2d + p3d) / 2);
            methodLabel = "Promedio de 2da y 3ra toma";
        } else if (numTomas === 2 && p1s && p2s) {
            avgS = Math.round((p1s + p2s) / 2);
            avgD = Math.round((p1d + p2d) / 2);
            methodLabel = "Promedio de 1ra y 2da toma";
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
            classification = "HTA Severa (Crisis)";
            if (data.danio_torax || data.danio_disnea || data.danio_neuro || data.danio_vision || data.danio_confusion || data.danio_cefalea) {
                isEmergency = true;
                classification = "SOSPECHA DE EMERGENCIA HIPERTENSIVA";
                alerts.push("URGENTE: Derivación inmediata a centro de mayor complejidad.");
            } else {
                alerts.push("HTA Severa s/emergencia: Ajustar fármacos VO. Evitar sublinguales.");
            }
        } else if (avgS >= 140 || avgD >= 90) {
            classification = "PA Elevada (HTA)";
        } else if (avgS >= 130 || avgD >= 80) {
            classification = "PA Limítrofe (Pre-HTA)";
        }

        return { avgS, avgD, classification, alerts, isEmergency, isSevere, methodLabel, numTomas };
    },

    evaluateStatus: (data) => {
        const moduleDef = window.APS.formModules[data.module];
        
        // Si el módulo actual tiene su propia forma de evaluar el estado, la usamos.
        if (moduleDef && typeof moduleDef.evaluateStatus === 'function') {
            return moduleDef.evaluateStatus(data);
        }

        // Si el módulo no tiene una evaluación específica, usamos esta por defecto.
        let isCompensated = true;
        let evaluationText = [];
        const imc = window.APS.helpers.calculateBMI(data.peso, data.talla);
        
        if (imc >= 30) {
            evaluationText.push("Obesidad");
            isCompensated = false; // Asumimos que si hay obesidad, hay algo que observar.
        }
        
        return { 
            isCompensated, 
            text: evaluationText.length > 0 ? evaluationText.join(", ") : "Parámetros en evaluación." 
        };
    },

    evaluateManejoHTA: (data) => {
        const hta = window.APS.evaluation.evaluateHTA(data);
        const metas = window.APS.evaluation.getPSCVMeta(data);
        const rcv = window.APS.evaluation.calculateRCV(data).level;
        
        const pasoActual = parseInt(data.manejo_hta_paso) || 0;
        const enMeta = hta.avgS > 0 && hta.avgS < metas.metaPA.s && hta.avgD < metas.metaPA.d;
        
        const pasosHEARTS = [
            { id: 0, label: "Paso 0", drugs: "M. no farmacológicas", text: "Sin fármacos / Medidas estilo vida" },
            { id: 1, label: "Paso 1", drugs: "Losartán 50 + Amlodipino 5", text: "Losartán 50 mg + Amlodipino 5 mg" },
            { id: 2, label: "Paso 2", drugs: "Losartán 100 + Amlodipino 10", text: "Losartán 100 mg + Amlodipino 10 mg" },
            { id: 3, label: "Paso 3", drugs: "Triple terapia (+ Diurético)", text: "Losartán 100 + Amlodipino 10 + Hidroclorotiazida 12.5-25 mg" },
            { id: 4, label: "Paso 4", drugs: "HTA Resistente", text: "HTA resistente. Derivar. Considerar Espironolactona 25 mg." }
        ];

        let sugerencia = "";
        let frecuencia = "";
        let nextPaso = pasoActual;

        if (enMeta) {
            sugerencia = `Mantener ${pasosHEARTS[pasoActual].label}.`;
            if (rcv === 'Alto') frecuencia = "3 a 4 meses";
            else if (rcv === 'Moderado') frecuencia = "4 a 6 meses";
            else frecuencia = "6 a 12 meses";
        } else if (hta.avgS > 0) {
            frecuencia = "1 mes";
            if (pasoActual < 4) {
                nextPaso = pasoActual + 1;
                sugerencia = `Subir a ${pasosHEARTS[nextPaso].label}: ${pasosHEARTS[nextPaso].drugs}.`;
            } else {
                sugerencia = "Persiste fuera de meta con terapia triple. Confirmar HTA resistente y derivar.";
            }
        } else {
            sugerencia = "Ingrese cifras de PA para evaluar.";
            frecuencia = "Pte.";
        }

        return { 
            enMeta, 
            pasoActual: pasosHEARTS[pasoActual],
            nextPaso: pasosHEARTS[nextPaso],
            sugerencia, 
            frecuencia 
        };
    },

    evaluateManejoLipidos: (data) => {
        const metas = window.APS.evaluation.getPSCVMeta(data);
        const ldl_actual = parseInt(data.ldl_actual) || 0;
        const estatina = data.estatina_actual || 'ninguna';
        
        let metaVal = 100;
        if (metas.metaLDL.includes('130')) metaVal = 130;
        if (metas.metaLDL.includes('100')) metaVal = 100;
        if (metas.metaLDL.includes('70')) metaVal = 70;
        if (metas.metaLDL.includes('55')) metaVal = 55;

        const suspender = data.suspendida_lipidos || false;
        const intolerancia = data.intolerancia_estatinas || false;

        let enMeta = ldl_actual > 0 && ldl_actual < metaVal;
        let sugerencia = "";
        let accion = "mantener";
        let frecuencia = enMeta ? "6 a 12 meses" : "4 a 12 semanas";

        if (suspender) {
            enMeta = false;
            accion = "suspender";
            sugerencia = "Condición de alto riesgo o fin de vida. Suspender estatina.";
            frecuencia = "Evolución clínica";
        } else if (intolerancia) {
            if (enMeta) {
                sugerencia = "En meta pero con STAM/mialgias. Vigilar tolerancia.";
            } else if (ldl_actual > 0) {
                accion = "escalar";
                sugerencia = "Fuera de meta + intolerancia. Suspender estatina y considerar Ezetimiba 10 mg.";
            } else {
                sugerencia = "Intolerancia consignada. Ingrese LDL para evaluar alternativas.";
                frecuencia = "1 mes";
            }
        } else if (ldl_actual > 0) {
            if (enMeta) {
                sugerencia = "LDL en rango meta. Mantener terapia lipídica actual.";
            } else {
                accion = "escalar";
                if (estatina === 'alta') {
                    sugerencia = "Fuera de meta con estatina alta intensidad. Asociar Ezetimiba 10 mg.";
                } else if (estatina === 'ezetimiba') {
                    sugerencia = "Fuera de meta con terapia múltiple. Derivar o usar Ac. Bempedoico.";
                } else {
                    const nextStatin = (estatina === 'ninguna' || estatina === 'baja') ? 'moderada' : 'alta';
                    sugerencia = "Paciente fuera de meta. Escalar a estatina de " + nextStatin + " intensidad.";
                }
            }
        } else {
            sugerencia = "Ingrese nivel de LDL para evaluar metas lipídicas.";
            frecuencia = "--";
            enMeta = false;
        }

        return { enMeta, ldl_actual, metaVal, sugerencia, frecuencia, accion, estatina };
    }
};