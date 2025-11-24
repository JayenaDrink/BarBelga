// Función para formatear fecha como clave
function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

// Función para formatear fecha para mostrar
function formatDateDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para obtener el nombre del mes
function getMonthName(date) {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para cargar todos los datos
function loadAllData() {
    const data = localStorage.getItem('barbelga_data');
    return data ? JSON.parse(data) : {};
}

// Función para obtener todos los meses únicos de los datos
function getUniqueMonths(data) {
    const months = new Set();
    Object.keys(data).forEach(dateKey => {
        const date = new Date(dateKey);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = getMonthName(date);
        months.add(JSON.stringify({ key: monthKey, name: monthName }));
    });
    return Array.from(months).map(m => JSON.parse(m)).sort((a, b) => a.key.localeCompare(b.key));
}

// Función para filtrar datos por mes
function filterDataByMonth(data, monthKey) {
    if (monthKey === 'all') return data;
    
    const filtered = {};
    Object.keys(data).forEach(dateKey => {
        const date = new Date(dateKey);
        const dataMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (dataMonthKey === monthKey) {
            filtered[dateKey] = data[dateKey];
        }
    });
    return filtered;
}

// Función para crear tarjeta de voluntario
function createVolunteerCard(volunteer) {
    const card = document.createElement('div');
    card.className = 'volunteer-card';
    
    const hasData = volunteer.name || volunteer.role || volunteer.extras;
    if (!hasData) return null;
    
    card.innerHTML = `
        <h3>${volunteer.name || 'Sin nombre'}</h3>
        <div class="volunteer-info">
            <div class="volunteer-info-item">
                <label>Rol/Función</label>
                <span>${volunteer.role || 'No especificado'}</span>
            </div>
        </div>
        ${volunteer.extras ? `
            <div class="responsables-extras-display">
                <label>Responsables Extras</label>
                <span>${volunteer.extras}</span>
            </div>
        ` : ''}
    `;
    
    return card;
}

// Función para crear elemento de horario
function createScheduleItem(dateKey, volunteers) {
    const date = new Date(dateKey);
    const item = document.createElement('div');
    item.className = 'schedule-item';
    
    item.innerHTML = `
        <div class="schedule-item-header">
            <h2>${formatDateDisplay(date)}</h2>
            <span class="date">${dateKey}</span>
        </div>
        <div class="volunteers-list">
            ${volunteers.map(vol => {
                const card = createVolunteerCard(vol);
                return card ? card.outerHTML : '';
            }).join('')}
        </div>
    `;
    
    return item;
}

// Función para renderizar el horario
function renderSchedule(data) {
    const container = document.getElementById('schedule-container');
    container.innerHTML = '';
    
    if (Object.keys(data).length === 0) {
        container.innerHTML = '<p class="empty-message">No hay voluntarios registrados aún.</p>';
        return;
    }
    
    // Ordenar fechas
    const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
    
    sortedDates.forEach(dateKey => {
        const volunteers = data[dateKey];
        if (volunteers && volunteers.length > 0) {
            const scheduleItem = createScheduleItem(dateKey, volunteers);
            container.appendChild(scheduleItem);
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const monthFilter = document.getElementById('month-filter');
    const allData = loadAllData();
    
    // Cargar opciones de meses
    const months = getUniqueMonths(allData);
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.key;
        option.textContent = month.name.charAt(0).toUpperCase() + month.name.slice(1);
        monthFilter.appendChild(option);
    });
    
    // Renderizar todos los datos inicialmente
    renderSchedule(allData);
    
    // Evento de filtro por mes
    monthFilter.addEventListener('change', (e) => {
        const filteredData = filterDataByMonth(allData, e.target.value);
        renderSchedule(filteredData);
    });
    
    // Actualizar datos cada 2 segundos (por si se modifican en otra pestaña)
    setInterval(() => {
        const updatedData = loadAllData();
        const currentFilter = monthFilter.value;
        const filteredData = filterDataByMonth(updatedData, currentFilter);
        renderSchedule(filteredData);
    }, 2000);
});

