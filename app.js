// Función para obtener todos los jueves hasta fin de 2026
function getAllThursdaysUntil2026() {
    const thursdays = [];
    const today = new Date();
    const endDate = new Date(2026, 11, 31); // 31 de diciembre de 2026
    
    // Encontrar el primer jueves desde hoy
    let currentDate = new Date(today);
    const dayOfWeek = currentDate.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
    
    if (dayOfWeek === 4) {
        // Si hoy es jueves, empezar desde hoy
        currentDate = new Date(today);
    } else {
        // Ir al próximo jueves
        currentDate.setDate(currentDate.getDate() + daysUntilThursday);
    }
    
    // Agregar todos los jueves hasta fin de 2026
    while (currentDate <= endDate) {
        thursdays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return thursdays;
}

// Función para verificar si una fecha es jueves
function isThursday(date) {
    return date.getDay() === 4;
}

// Función para verificar si una fecha está dentro del rango válido
function isValidDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(2026, 11, 31);
    return date >= today && date <= endDate && isThursday(date);
}

// Función para formatear fecha como clave
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función para formatear fecha para mostrar
function formatDateDisplay(date) {
    const lang = getCurrentLanguage();
    const locale = lang === 'nl' ? 'nl-NL' : 'es-ES';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale, options);
}

// Función para cargar datos desde localStorage
function loadData(dateKey) {
    const data = localStorage.getItem('barbelga_data');
    if (!data) return null;
    
    const allData = JSON.parse(data);
    return allData[dateKey] || null;
}

// Función para cargar todos los datos
function loadAllData() {
    const data = localStorage.getItem('barbelga_data');
    return data ? JSON.parse(data) : {};
}

// Función para guardar datos en localStorage
function saveData(dateKey, volunteers) {
    const data = localStorage.getItem('barbelga_data');
    let allData = data ? JSON.parse(data) : {};
    allData[dateKey] = volunteers;
    localStorage.setItem('barbelga_data', JSON.stringify(allData));
}

// Función para mostrar mensaje
function showMessage(text, type = 'success') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        messageEl.className = 'message';
    }, 3000);
}

// Función para crear un elemento de voluntario
function createVolunteerElement(index, volunteer = {}) {
    const volunteerDiv = document.createElement('div');
    volunteerDiv.className = 'volunteer-item';
    volunteerDiv.dataset.index = index;
    
    volunteerDiv.innerHTML = `
        <div class="volunteer-item-header">
            <h3>Voluntario ${index + 1}</h3>
            <button type="button" class="remove-volunteer-btn">Eliminar</button>
        </div>
        <div class="volunteer-fields">
            <div class="field-group">
                <label for="volunteer-name-${index}">Nombre del Voluntario:</label>
                <input type="text" id="volunteer-name-${index}" 
                       value="${volunteer.name || ''}" 
                       placeholder="Nombre completo">
            </div>
        </div>
    `;
    
    // Agregar evento para eliminar voluntario
    volunteerDiv.querySelector('.remove-volunteer-btn').addEventListener('click', () => {
        volunteerDiv.remove();
        updateVolunteerIndices();
    });
    
    return volunteerDiv;
}

// Función para actualizar índices de voluntarios
function updateVolunteerIndices() {
    const container = document.getElementById('volunteers-container');
    const items = container.querySelectorAll('.volunteer-item');
    items.forEach((item, index) => {
        item.dataset.index = index;
        item.querySelector('h3').textContent = `${t('volunteer')} ${index + 1}`;
        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const id = input.id.split('-');
            id[2] = index;
            input.id = id.join('-');
        });
        // Actualizar label y placeholder
        const label = item.querySelector('label');
        if (label) label.textContent = t('volunteerName');
        const input = item.querySelector('input');
        if (input) input.placeholder = t('volunteerNamePlaceholder');
        const removeBtn = item.querySelector('.remove-volunteer-btn');
        if (removeBtn) removeBtn.textContent = t('removeVolunteer');
    });
}

// Función para obtener datos de los voluntarios del formulario
function getVolunteersData() {
    const container = document.getElementById('volunteers-container');
    const items = container.querySelectorAll('.volunteer-item');
    const volunteers = [];
    
    items.forEach(item => {
        const index = item.dataset.index;
        const name = document.getElementById(`volunteer-name-${index}`).value.trim();
        
        if (name) {
            volunteers.push({
                name: name
            });
        }
    });
    
    return volunteers;
}

// Variables globales del calendario
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();
let selectedDate = null;
let allThursdays = [];

// Función para renderizar el calendario
function renderCalendar() {
    const container = document.getElementById('calendar-container');
    if (!container) return;
    
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const monthNames = t('months');
    const dayNames = t('weekdays');
    
    let html = `
        <div class="calendar">
            <div class="calendar-header">
                <button type="button" class="calendar-nav-btn" id="prev-month">‹</button>
                <h3>${monthNames[currentCalendarMonth]} ${currentCalendarYear}</h3>
                <button type="button" class="calendar-nav-btn" id="next-month">›</button>
            </div>
            <div class="calendar-weekdays">
                ${dayNames.map(day => `<div class="calendar-weekday">${day}</div>`).join('')}
            </div>
            <div class="calendar-days">
    `;
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Cargar datos guardados para verificar qué fechas tienen datos
    const savedData = loadAllData();
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentCalendarYear, currentCalendarMonth, day);
        const dateKey = formatDateKey(date);
        const isSelectableThursday = isValidDate(date);
        const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey;
        // Marcar como guardado si existe la clave en savedData (incluso si el array está vacío)
        const hasData = savedData.hasOwnProperty(dateKey);
        
        let dayClass = 'calendar-day';
        if (!isSelectableThursday) {
            dayClass += ' disabled';
        } else {
            dayClass += ' selectable';
            if (isSelected) {
                dayClass += ' selected';
            }
            if (hasData) {
                dayClass += ' has-data';
            }
        }
        
        html += `<div class="${dayClass}" data-date="${dateKey}" ${isSelectableThursday ? 'tabindex="0"' : ''}>${day}</div>`;
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Agregar event listeners
    document.getElementById('prev-month').addEventListener('click', () => {
        if (currentCalendarMonth === 0) {
            currentCalendarMonth = 11;
            currentCalendarYear--;
        } else {
            currentCalendarMonth--;
        }
        renderCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        if (currentCalendarMonth === 11) {
            currentCalendarMonth = 0;
            currentCalendarYear++;
        } else {
            currentCalendarMonth++;
        }
        // No permitir ir más allá de diciembre 2026
        if (currentCalendarYear > 2026 || (currentCalendarYear === 2026 && currentCalendarMonth > 11)) {
            currentCalendarYear = 2026;
            currentCalendarMonth = 11;
        }
        renderCalendar();
    });
    
    // Event listeners para días seleccionables
    container.querySelectorAll('.calendar-day.selectable').forEach(dayEl => {
        dayEl.addEventListener('click', () => {
            const dateKey = dayEl.dataset.date;
            const date = new Date(dateKey);
            selectDate(date);
        });
        
        dayEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dateKey = dayEl.dataset.date;
                const date = new Date(dateKey);
                selectDate(date);
            }
        });
    });
}

// Función para seleccionar una fecha
function selectDate(date) {
    selectedDate = date;
    const dateKey = formatDateKey(date);
    document.getElementById('selected-date').value = dateKey;
    
    // Actualizar calendario
    renderCalendar();
    
    // Mostrar sección de voluntarios
    const volunteersSection = document.getElementById('volunteers-section');
    const volunteersContainer = document.getElementById('volunteers-container');
    volunteersSection.style.display = 'block';
    volunteersContainer.innerHTML = '';
    
    // Cargar datos existentes si los hay
    const existingData = loadData(dateKey);
    if (existingData && existingData.length > 0) {
        existingData.forEach((volunteer, index) => {
            const volunteerEl = createVolunteerElement(index, volunteer);
            volunteersContainer.appendChild(volunteerEl);
        });
    } else {
        // Agregar un voluntario por defecto
        const volunteerEl = createVolunteerElement(0);
        volunteersContainer.appendChild(volunteerEl);
    }
}

// Función para aplicar traducciones a la página
function applyTranslations() {
    // Actualizar título
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        const isViewPage = window.location.pathname.includes('view.html');
        pageTitle.textContent = `🍺 ${isViewPage ? t('titleView') : t('title')}`;
    }
    
    // Actualizar navegación
    const navManage = document.getElementById('nav-manage');
    const navView = document.getElementById('nav-view');
    if (navManage) navManage.textContent = t('navManage');
    if (navView) navView.textContent = t('navView');
    
    // Actualizar labels y botones
    const labelSelectThursday = document.getElementById('label-select-thursday');
    if (labelSelectThursday) labelSelectThursday.textContent = t('selectThursday');
    
    const volunteersTitle = document.getElementById('volunteers-title');
    if (volunteersTitle) volunteersTitle.textContent = t('volunteersTitle');
    
    const addVolunteerBtn = document.getElementById('add-volunteer-btn');
    if (addVolunteerBtn) addVolunteerBtn.textContent = t('addVolunteer');
    
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) saveBtn.textContent = t('save');
    
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.textContent = t('clear');
    
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
    // Limpiar todos los datos guardados
    localStorage.removeItem('barbelga_data');
    
    // Configurar cambio de idioma
    document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-nl').addEventListener('click', () => setLanguage('nl'));
    
    // Aplicar traducciones
    applyTranslations();
    
    const volunteersSection = document.getElementById('volunteers-section');
    const volunteersContainer = document.getElementById('volunteers-container');
    const addVolunteerBtn = document.getElementById('add-volunteer-btn');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Cargar todos los jueves hasta 2026
    allThursdays = getAllThursdaysUntil2026();
    
    // Inicializar calendario
    renderCalendar();
    
    // Verificar si hay una fecha en la URL para seleccionarla automáticamente
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
        try {
            const date = new Date(dateParam);
            if (!isNaN(date.getTime()) && isValidDate(date)) {
                // Ajustar el mes y año del calendario a la fecha seleccionada
                currentCalendarMonth = date.getMonth();
                currentCalendarYear = date.getFullYear();
                // Seleccionar la fecha después de un pequeño delay para asegurar que el calendario esté renderizado
                setTimeout(() => {
                    selectDate(date);
                }, 100);
            }
        } catch (e) {
            console.error('Error al parsear fecha de URL:', e);
        }
    }
    
    // Agregar nuevo voluntario
    addVolunteerBtn.addEventListener('click', () => {
        const currentCount = volunteersContainer.querySelectorAll('.volunteer-item').length;
        const volunteerEl = createVolunteerElement(currentCount);
        volunteersContainer.appendChild(volunteerEl);
    });
    
    // Guardar datos
    saveBtn.addEventListener('click', () => {
        const dateKey = document.getElementById('selected-date').value;
        if (!dateKey || !selectedDate) {
            showMessage(t('selectThursdayFirst'), 'error');
            return;
        }
        
        const volunteers = getVolunteersData();
        // Permitir guardar incluso sin voluntarios (array vacío)
        saveData(dateKey, volunteers);
        showMessage(t('dataSaved'), 'success');
        // Actualizar calendario para mostrar indicador de datos guardados
        renderCalendar();
    });
    
    // Limpiar formulario
    clearBtn.addEventListener('click', () => {
        if (confirm(t('clearConfirm'))) {
            volunteersContainer.innerHTML = '';
            const volunteerEl = createVolunteerElement(0);
            volunteersContainer.appendChild(volunteerEl);
        }
    });
});

