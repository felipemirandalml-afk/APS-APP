// modules_generator.js
window.APS.generator = {
    generateText: (data) => {
        if (data.module === 'salud-mental') return window.APS.generator.generateMentalText(data);
        if (data.module === 'morbilidad') return window.APS.generator.generateMorbilidadText(data);

        const h = window.APS.helpers;
        const e = window.APS.evaluation;
        const isCV = data.module === 'cardiovascular';
        const isIngreso = data.type === 'ingreso';

        let text = `=== NOTA CLÍNICA - ${data.module.toUpperCase()} (${data.type.toUpperCase()}) ===\n\n`;

        text += `[EV CLÍNICA]\n`;
        text += `Paciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}.\n`;
        if (data.peso && data.talla) {
            text += `Antropometría: Peso: ${data.peso} kg, Talla: ${data.talla} cm (IMC ${data.imc || '--'}). `;
            if (data.cintura) text += `Cintura: ${data.cintura} cm.`;
            text += `\n`;
        }

        const coMorbs = [];
        if (data.hta) coMorbs.push('HTA');
        if (data.dm2) coMorbs.push('DM2');
        if (data.dislipidemia) coMorbs.push('dislipidemia');
        if (data.tabaquismo) coMorbs.push('tabaquismo');
        if (data.erc_avanzada) coMorbs.push('ERC');
        if (data.ecv_ateroesclerotica) coMorbs.push('ECV ateroesclerótica');

        let coMorbText = coMorbs.length > 0 ? coMorbs.join(', ') : '';
        if (data.otros_diagnosticos?.trim()) {
            const others = data.otros_diagnosticos.trim();
            coMorbText = coMorbText ? `${coMorbText}, ${others}` : others;
        }

        text += `Comorbilidades: ${coMorbText || 'no se registran'}.\n`;
        text += data.cirugias_previas?.trim()
            ? `Cirugías previas: ${h.formatClinicalText(data.cirugias_previas)}\n`
            : 'Cirugías previas: sin antecedentes quirúrgicos consignados.\n';

        text += data.farmacos_habituales?.trim()
            ? `Fármacos de uso habitual: ${h.formatClinicalText(data.farmacos_habituales)}\n`
            : 'Fármacos de uso habitual: no referidos.\n';

        if (isCV) {
            const rcv = e.calculateRCV(data);
            const { metaPA, metaLDL } = e.getPSCVMeta(data);
            text += `\nESTRATIFICACIÓN RCV: ${rcv.level.toUpperCase()} (${rcv.method}). Fundamento: ${rcv.reason}.\n`;
            text += `Metas PSCV: Meta PA: ${metaPA.label}. Meta LDL: < ${metaLDL} mg/dL.\n`;
        }

        text += `\n[EXAMEN FÍSICO]\n`;
        text += window.APS.generator.buildPhysicalExamSegmentary(data);

        const htaRes = e.evaluateHTA(data);
        if (isCV && htaRes.avgS) {
            text += `\nPA de evaluación: ${htaRes.avgS}/${htaRes.avgD} mmHg (${htaRes.methodLabel}). Clasificación: ${htaRes.classification}.`;
        }
        text += `\n\n`;

        if (isIngreso && isCV) {
            const examString = window.APS.generator.buildExamString(data);
            if (examString) {
                text += `[EXÁMENES SOLICITADOS]\n${examString}\n\n`;
            }
        }

        text += `[PLAN E INDICACIONES]\n`;
        text += `Control: ${e.evaluateStatus(data).text.toUpperCase()}.\n`;

        if (isCV) {
            const htaPlan = e.evaluateManejoHTA(data);
            if (htaPlan.pasoActual.id === 0 && !htaPlan.enMeta) {
                text += 'Medidas no farmacológicas: restricción de sodio, alimentación saludable, actividad física y cese de tabaco. ';
                text += `Dado cifras fuera de meta, se propone iniciar Paso 1 HEARTS (${htaPlan.nextPaso.drugs}). `;
            } else if (!htaPlan.enMeta) {
                text += `Paciente fuera de meta en su esquema actual (${htaPlan.pasoActual.label}). Se sugiere ajustar a ${htaPlan.nextPaso.label}: ${htaPlan.nextPaso.drugs}. `;
            } else {
                text += `PA en rango meta. Mantener esquema actual (${htaPlan.pasoActual.label}). `;
            }
            text += `Control en ${htaPlan.frecuencia}.\n`;
        }

        text += `${data.ind_farmacos || (isCV ? '' : 'Mantener indicaciones farmacológicas vigentes y enfatizar cambios estilo vida saludable.')}`;
        return text;
    },

    buildExamString: (data) => {
        const basics = [];
        if (data.ex_hematocrito) basics.push('hematocrito');
        if (data.ex_orina) basics.push('orina completa');
        if (data.ex_glicemia) basics.push('glicemia');
        if (data.ex_electrolitos) basics.push('electrolitos plasmáticos');
        if (data.ex_lipidos) basics.push('perfil lipídico');
        if (data.ex_creatinina) basics.push('creatinina plasmática');
        if (data.ex_uricemia) basics.push('uricemia');
        if (data.ex_ecg) basics.push('ECG');

        if (basics.length === 0 && !data.ex_rac && !data.ex_hba1c && !data.ex_fo) return '';

        let res = `Se solicitan exámenes de ingreso a PSCV: ${basics.join(', ')}.`;
        const adds = [];
        if (data.ex_rac) adds.push('RAC');
        if (data.ex_hba1c) adds.push('HbA1c');
        if (data.ex_fo) adds.push('fondo de ojo');

        if (adds.length > 0) {
            const reason = data.dm2 ? 'diabetes mellitus' : 'comorbilidad cardiovascular';
            res += ` Por antecedente de ${reason}, se agrega ${adds.join(' y ')}.`;
        }
        return res;
    },

    buildPhysicalExamSegmentary: (data) => {
        const h = window.APS.helpers;
        const s = {
            general: 'Paciente en buenas condiciones generales, vigil, hemodinámicamente estable.',
            mucosas: 'Mucosas orales hidratadas, conjuntivas rosadas.',
            cuello: 'Cuello móvil, sin adenopatías palpables.',
            cardiaco: 'Ruidos cardíacos rítmicos en dos tiempos, sin soplos.',
            pulmonar: 'Murmullo pulmonar presente bilateral, sin ruidos agregados.',
            abdomen: 'Abdomen blando, depresible, indoloro a la palpación.',
            extremidades: 'Extremidades simétricas, sin edema, pulso periférico presente, sensibilidad conservada.'
        };

        if (data.hallazgo_crepitos) s.pulmonar = 'Murmullo pulmonar con presencia de crépitos.';
        if (data.hallazgo_edema) s.extremidades = 'Extremidades con presencia de edema en EEII, pulso presente.';
        if (data.hallazgo_acantosis) s.general += ' Se observa presencia de acantosis nigricans.';

        let res = `${s.general} ${s.mucosas} ${s.cuello} ${s.cardiaco} ${s.pulmonar} ${s.abdomen} ${s.extremidades}`;
        if (data.examen_fisico?.trim()) res += ` Además, destaca: ${h.formatClinicalText(data.examen_fisico)}`;
        return res;
    },

    generateMentalText: (data) => {
        const h = window.APS.helpers;
        const flags = [];
        if (data.ansiedad_sm) flags.push('síntomas ansiosos');
        if (data.depresion_sm) flags.push('síntomas depresivos');

        return `=== NOTA CLÍNICA - SALUD MENTAL (${data.type.toUpperCase()}) ===\n\n` +
            `[MOTIVO CONSULTA]\n${h.formatClinicalText(data.motivo_consulta_sm) || 'Sin motivo consignado.'}\n\n` +
            `[TAMIZAJE]\nPaciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}. ` +
            `Se pesquisan ${flags.join(' y ') || 'sin síntomas predominantes en tamizaje inicial'}. ` +
            `Sueño ${data.sueno_sm || 'no consignado'}, apetito ${data.apetito_sm || 'no consignado'}. ` +
            `Riesgo suicida: ${data.riesgo_suicida_sm || 'no evaluado'}.\n\n` +
            `[SÍNTOMAS REFERIDOS]\n${h.formatClinicalText(data.sintomas_sm) || 'No se consignan síntomas adicionales.'}\n\n` +
            `[PLAN]\nRed de apoyo: ${h.formatClinicalText(data.red_apoyo_sm) || 'No descrita.'}\n` +
            `${h.formatClinicalText(data.plan_sm) || 'Se indica seguimiento en controles de salud mental APS.'}\n` +
            `${h.formatClinicalText(data.ind_farmacos) || ''}`;
    },

    generateMorbilidadText: (data) => {
        const h = window.APS.helpers;
        const sintomas = [];
        if (data.fiebre_morb) sintomas.push('fiebre');
        if (data.tos_morb) sintomas.push('tos');
        if (data.disnea_morb) sintomas.push('disnea');

        return `=== NOTA CLÍNICA - MORBILIDAD (${data.type.toUpperCase()}) ===\n\n` +
            `[ANAMNESIS]\nPaciente de ${data.edad || '--'} años, sexo ${data.sexo || '--'}. ` +
            `Motivo: ${h.formatClinicalText(data.motivo_morb) || 'Sin motivo consignado.'} ` +
            `Síntomas principales: ${sintomas.join(', ') || 'no referidos en checklist'}. ` +
            `${h.formatClinicalText(data.sintomas_morb) || ''}\n\n` +
            `[EXAMEN FÍSICO]\n${h.formatClinicalText(data.examen_morb) || 'Sin hallazgos relevantes consignados.'}\n\n` +
            `[IMPRESIÓN DIAGNÓSTICA]\n${h.formatClinicalText(data.diagnostico_morb) || 'Diagnóstico en evaluación.'}\n\n` +
            `[PLAN]\n${h.formatClinicalText(data.plan_morb) || 'Manejo sintomático, signos de alarma y control según evolución.'}\n` +
            `${h.formatClinicalText(data.ind_farmacos) || ''}`;
    }
};
