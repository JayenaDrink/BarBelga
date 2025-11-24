// Función para obtener todos los jueves del mes actual y siguientes
function getThursdays() {
    const thursdays = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Obtener jueves del mes actual
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Encontrar el primer jueves del mes
    let firstThursday = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
    if (daysUntilThursday === 0 && dayOfWeek !== 4) {
        firstThursday.setDate(firstDay.getDate() + 7);
    } else {
        firstThursday.setDate(firstDay.getDate() + daysUntilThursday);
    }
    
    // Agregar todos los jueves del mes actual
    let currentThursday = new Date(firstThursday);
    while (currentThursday <= lastDay) {
        thursdays.push(new Date(currentThursday));
        currentThursday.setDate(currentThursday.getDate() + 7);
    }
    
    // Agregar jueves del próximo mes (hasta 4 jueves)
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth === 12 ? currentYear + 1 : currentYear;
    const nextMonthFirstDay = new Date(nextYear, nextMonth % 12, 1);
    const nextMonthLastDay = new Date(nextYear, (nextMonth % 12) + 1, 0);
    
    let nextMonthFirstThursday = new Date(nextMonthFirstDay);
    const nextDayOfWeek = nextMonthFirstDay.getDay();
    const nextDaysUntilThursday = (4 - nextDayOfWeek + 7) % 7;
    nextMonthFirstThursday.setDate(nextMonthFirstDay.getDate() + nextDaysUntilThursday);
    
    let nextThursday = new Date(nextMonthFirstThursday);
    let count = 0;
    while (nextThursday <= nextMonthLastDay && count < 4) {
        thursdays.push(new Date(nextThursday));
        nextThursday.setDate(nextThursday.getDate() + 7);
        count++;
    }
    
    return thursdays;
}

// Función para formatear fecha como clave
function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

// Función para formatear fecha para mostrar
function formatDateDisplay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para cargar datos desde localStorage
function loadData(dateKey) {
    const data = localStorage.getItem('barbelga_data');
    if (!data) return null;
    
    const allData = JSON.parse(data);
    return allData[dateKey] || null;
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
            <div class="field-group">
                <label for="volunteer-role-${index}">Rol/Función:</label>
                <input type="text" id="volunteer-role-${index}" 
                       value="${volunteer.role || ''}" 
                       placeholder="Ej: Barra, Cocina, etc.">
            </div>
            <div class="responsables-extras">
                <label for="volunteer-extras-${index}">Responsables Extras (una por línea):</label>
                <textarea id="volunteer-extras-${index}" 
                          placeholder="Agrega nombres de responsables extras, uno por línea">${volunteer.extras || ''}</textarea>
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
        item.querySelector('h3').textContent = `Voluntario ${index + 1}`;
        const inputs = item.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const id = input.id.split('-');
            id[2] = index;
            input.id = id.join('-');
        });
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
        const role = document.getElementById(`volunteer-role-${index}`).value.trim();
        const extras = document.getElementById(`volunteer-extras-${index}`).value.trim();
        
        if (name || role || extras) {
            volunteers.push({
                name: name || '',
                role: role || '',
                extras: extras || ''
            });
        }
    });
    
    return volunteers;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const thursdaySelect = document.getElementById('thursday-select');
    const volunteersSection = document.getElementById('volunteers-section');
    const volunteersContainer = document.getElementById('volunteers-container');
    const addVolunteerBtn = document.getElementById('add-volunteer-btn');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Cargar jueves disponibles
    const thursdays = getThursdays();
    thursdays.forEach(thursday => {
        const option = document.createElement('option');
        option.value = formatDateKey(thursday);
        option.textContent = formatDateDisplay(thursday);
        thursdaySelect.appendChild(option);
    });
    
    // Evento cuando se selecciona un jueves
    thursdaySelect.addEventListener('change', (e) => {
        const dateKey = e.target.value;
        if (dateKey) {
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
        } else {
            volunteersSection.style.display = 'none';
        }
    });
    
    // Agregar nuevo voluntario
    addVolunteerBtn.addEventListener('click', () => {
        const currentCount = volunteersContainer.querySelectorAll('.volunteer-item').length;
        const volunteerEl = createVolunteerElement(currentCount);
        volunteersContainer.appendChild(volunteerEl);
    });
    
    // Guardar datos
    saveBtn.addEventListener('click', () => {
        const dateKey = thursdaySelect.value;
        if (!dateKey) {
            showMessage('Por favor selecciona un jueves primero', 'error');
            return;
        }
        
        const volunteers = getVolunteersData();
        if (volunteers.length === 0) {
            showMessage('Agrega al menos un voluntario antes de guardar', 'error');
            return;
        }
        
        saveData(dateKey, volunteers);
        showMessage('¡Datos guardados correctamente!', 'success');
    });
    
    // Limpiar formulario
    clearBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres limpiar todos los campos?')) {
            volunteersContainer.innerHTML = '';
            const volunteerEl = createVolunteerElement(0);
            volunteersContainer.appendChild(volunteerEl);
        }
    });
});

