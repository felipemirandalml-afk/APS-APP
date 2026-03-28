// app.js
window.APS.app = {
    init: () => {
        const container = document.getElementById('app-container');
        const btnHome = document.getElementById('btn-home');

        // Pantalla Inicial: Módulos
        const renderHome = () => {
            btnHome.classList.add('hidden');
            container.innerHTML = `
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-light text-gray-600">Seleccione el Programa</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onclick="window.APS.app.selectType('Cardiovascular')" class="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 p-8 rounded-xl shadow-sm text-xl font-semibold transition-all">❤️ Control Cardiovascular</button>
                    <button onclick="window.APS.app.selectType('Salud Mental')" class="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 p-8 rounded-xl shadow-sm text-xl font-semibold transition-all">🧠 Salud Mental</button>
                    <button onclick="window.APS.app.selectType('Morbilidad')" class="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 p-8 rounded-xl shadow-sm text-xl font-semibold transition-all">🩺 Morbilidad General</button>
                </div>
            `;
        };

        // Función global accesible desde el HTML generado
        window.APS.app.selectType = (moduleName) => {
            btnHome.classList.remove('hidden');
            container.innerHTML = `
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-light text-gray-600">Atención de ${moduleName}</h2>
                    <p class="text-gray-500 mt-2">Seleccione el tipo de atención</p>
                </div>
                <div class="flex justify-center gap-6">
                    <button onclick="window.APS.form.render('${moduleName.toLowerCase()}', 'ingreso')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl shadow-md text-lg font-bold">Ingreso Nuevo</button>
                    <button onclick="window.APS.form.render('${moduleName.toLowerCase()}', 'control')" class="bg-teal-600 hover:bg-teal-700 text-white px-10 py-5 rounded-xl shadow-md text-lg font-bold">Control de Seguimiento</button>
                </div>
            `;
        };

        // Botón "Volver al Inicio"
        btnHome.addEventListener('click', renderHome);

        // Arrancar
        renderHome();
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', window.APS.app.init);