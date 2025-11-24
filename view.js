// Función para formatear fecha como clave
function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

// Función para formatear fecha para mostrar
function formatDateDisplay(date) {
    const lang = getCurrentLanguage();
    const locale = lang === 'nl' ? 'nl-NL' : 'es-ES';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
}

// Función para obtener el nombre del mes
function getMonthName(date) {
    const lang = getCurrentLanguage();
    const locale = lang === 'nl' ? 'nl-NL' : 'es-ES';
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString(locale, options);
}

// Función para cargar todos los datos
function loadAllData() {
    try {
        const data = localStorage.getItem('barbelga_data');
        if (!data) return {};
        const parsed = JSON.parse(data);
        return parsed || {};
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return {};
    }
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
    
    if (!volunteer.name || volunteer.name.trim() === '') return null;
    
    card.innerHTML = `
        <h3>${volunteer.name}</h3>
    `;
    
    return card;
}

// Función para crear elemento de horario
function createScheduleItem(dateKey, volunteers) {
    const date = new Date(dateKey);
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', dateKey);
        return null;
    }
    
    const item = document.createElement('div');
    item.className = 'schedule-item';
    
    const header = document.createElement('div');
    header.className = 'schedule-item-header';
    
    const title = document.createElement('h2');
    title.textContent = formatDateDisplay(date);
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'date';
    dateSpan.textContent = dateKey;
    
    header.appendChild(title);
    header.appendChild(dateSpan);
    
    const volunteersList = document.createElement('div');
    volunteersList.className = 'volunteers-list';
    
    volunteers.forEach(vol => {
        const card = createVolunteerCard(vol);
        if (card) {
            volunteersList.appendChild(card);
        }
    });
    
    // Botón de editar
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-edit';
    editButton.textContent = t('edit');
    editButton.addEventListener('click', () => {
        window.location.href = `index.html?date=${dateKey}`;
    });
    
    item.appendChild(header);
    item.appendChild(volunteersList);
    item.appendChild(editButton);
    
    return item;
}

// Función para renderizar el horario
function renderSchedule(data) {
    const container = document.getElementById('schedule-container');
    if (!container) {
        console.error('No se encontró el contenedor schedule-container');
        return;
    }
    
    container.innerHTML = '';
    
    if (!data || Object.keys(data).length === 0) {
        container.innerHTML = `<p class="empty-message">${t('noVolunteers')}</p>`;
        return;
    }
    
    // Ordenar fechas
    const sortedDates = Object.keys(data).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA - dateB;
    });
    
    let hasValidData = false;
    
    sortedDates.forEach(dateKey => {
        const volunteers = data[dateKey];
        if (volunteers && Array.isArray(volunteers) && volunteers.length > 0) {
            // Filtrar voluntarios que tengan nombre (compatible con formato antiguo y nuevo)
            const validVolunteers = volunteers.filter(vol => {
                if (!vol) return false;
                // Aceptar tanto el formato nuevo (solo name) como el antiguo (name, role, extras)
                const name = vol.name || '';
                return name.trim() !== '';
            });
            
            // Solo mostrar si hay al menos un voluntario válido
            if (validVolunteers.length > 0) {
                hasValidData = true;
                const scheduleItem = createScheduleItem(dateKey, validVolunteers);
                if (scheduleItem) {
                    container.appendChild(scheduleItem);
                }
            }
        }
    });
    
    if (!hasValidData) {
        container.innerHTML = `<p class="empty-message">${t('noVolunteers')}</p>`;
    }
}

// Función para actualizar la visualización
function updateView() {
    const monthFilter = document.getElementById('month-filter');
    const allData = loadAllData();
    
    // Limpiar opciones de meses existentes (excepto "Todos los meses")
    while (monthFilter.children.length > 1) {
        monthFilter.removeChild(monthFilter.lastChild);
    }
    
    // Cargar opciones de meses
    const months = getUniqueMonths(allData);
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month.key;
        option.textContent = month.name.charAt(0).toUpperCase() + month.name.slice(1);
        monthFilter.appendChild(option);
    });
    
    // Renderizar datos según el filtro actual
    const currentFilter = monthFilter.value;
    const filteredData = filterDataByMonth(allData, currentFilter);
    renderSchedule(filteredData);
}

// Función para aplicar traducciones a la página de visualización
function applyViewTranslations() {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `🍺 ${t('titleView')}`;
    
    const navManage = document.getElementById('nav-manage');
    const navView = document.getElementById('nav-view');
    if (navManage) navManage.textContent = t('navManage');
    if (navView) navView.textContent = t('navView');
    
    const labelFilterMonth = document.getElementById('label-filter-month');
    if (labelFilterMonth) labelFilterMonth.textContent = t('filterByMonth');
    
    const optionAllMonths = document.getElementById('option-all-months');
    if (optionAllMonths) optionAllMonths.textContent = t('allMonths');
    
    const emptyMessage = document.getElementById('empty-message');
    if (emptyMessage) emptyMessage.textContent = t('noVolunteers');
    
    // Actualizar banderas activas
    const currentLang = getCurrentLanguage();
    document.querySelectorAll('.flag-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((btn.id === 'lang-es' && currentLang === 'es') || 
            (btn.id === 'lang-nl' && currentLang === 'nl')) {
            btn.classList.add('active');
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Configurar cambio de idioma
    document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-nl').addEventListener('click', () => setLanguage('nl'));
    
    // Aplicar traducciones
    applyViewTranslations();
    
    const monthFilter = document.getElementById('month-filter');
    
    // Renderizar vista inicial
    updateView();
    
    // Evento de filtro por mes
    monthFilter.addEventListener('change', () => {
        updateView();
    });
    
    // Actualizar datos cada 2 segundos (por si se modifican en otra pestaña)
    setInterval(() => {
        updateView();
    }, 2000);
});

