// Traducciones para la aplicación BarBelga
const translations = {
    es: {
        // Títulos y navegación
        title: "BarBelga - Gestión de Voluntarios",
        titleView: "BarBelga - Visualización de Voluntarios",
        navManage: "Gestionar",
        navView: "Visualizar",
        
        // Selector de fecha
        selectThursday: "Selecciona un jueves:",
        
        // Sección de voluntarios
        volunteersTitle: "Voluntarios del Bar",
        volunteerName: "Nombre del Voluntario:",
        volunteerNamePlaceholder: "Nombre completo",
        addVolunteer: "+ Agregar Voluntario",
        removeVolunteer: "Eliminar",
        volunteer: "Voluntario",
        
        // Botones
        save: "Guardar",
        clear: "Limpiar",
        edit: "✏️ Editar",
        
        // Mensajes
        selectThursdayFirst: "Por favor selecciona un jueves primero",
        dataSaved: "¡Datos guardados correctamente!",
        clearConfirm: "¿Estás seguro de que quieres limpiar todos los campos?",
        
        // Visualización
        filterByMonth: "Filtrar por mes:",
        allMonths: "Todos los meses",
        noVolunteers: "No hay voluntarios registrados aún.",
        
        // Calendario
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        weekdays: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        weekdaysFull: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    },
    nl: {
        // Títulos y navegación
        title: "BarBelga - Beheer Vrijwilligers",
        titleView: "BarBelga - Overzicht Vrijwilligers",
        navManage: "Beheren",
        navView: "Overzicht",
        
        // Selector de fecha
        selectThursday: "Selecteer een donderdag:",
        
        // Sección de voluntarios
        volunteersTitle: "Vrijwilligers van de Bar",
        volunteerName: "Naam van de Vrijwilliger:",
        volunteerNamePlaceholder: "Volledige naam",
        addVolunteer: "+ Vrijwilliger Toevoegen",
        removeVolunteer: "Verwijderen",
        volunteer: "Vrijwilliger",
        
        // Botones
        save: "Opslaan",
        clear: "Wissen",
        edit: "✏️ Bewerken",
        
        // Mensajes
        selectThursdayFirst: "Selecteer eerst een donderdag",
        dataSaved: "Gegevens succesvol opgeslagen!",
        clearConfirm: "Weet je zeker dat je alle velden wilt wissen?",
        
        // Visualización
        filterByMonth: "Filteren op maand:",
        allMonths: "Alle maanden",
        noVolunteers: "Er zijn nog geen vrijwilligers geregistreerd.",
        
        // Calendario
        months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
        weekdays: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
        weekdaysFull: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"]
    }
};

// Función para obtener el idioma actual
function getCurrentLanguage() {
    return localStorage.getItem('barbelga_language') || 'es';
}

// Función para establecer el idioma
function setLanguage(lang) {
    localStorage.setItem('barbelga_language', lang);
    // Recargar la página para aplicar todos los cambios
    location.reload();
}

// Función para obtener una traducción
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.es[key] || key;
}

