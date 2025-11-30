const addEntryBtn = document.getElementById('addEntryBtn');
const entryModal = document.getElementById('entryModal');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const entryForm = document.getElementById('entryForm');
const progressTimeline = document.getElementById('progressTimeline');

const months = [
    'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
];

document.addEventListener('DOMContentLoaded', function() {
    loadEntriesFromStorage();
    setupEventListeners();
});

function setupEventListeners() {
    addEntryBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === entryModal) {
            closeModal();
        }
    });

    entryForm.addEventListener('submit', handleFormSubmit);
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && entryModal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal() {
    entryModal.style.display = 'block';
    document.getElementById('entryDate').valueAsDate = new Date();
    document.getElementById('entryTask').focus();
}

function closeModal() {
    entryModal.style.display = 'none';
    entryForm.reset();
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const date = new Date(document.getElementById('entryDate').value);
    const task = document.getElementById('entryTask').value.trim();
    const description = document.getElementById('entryDescription').value.trim();
    const status = document.getElementById('entryStatus').value;
    
    if (!task) {
        alert('Пожалуйста, введите название задачи');
        document.getElementById('entryTask').focus();
        return;
    }
    
    if (!date || isNaN(date.getTime())) {
        alert('Пожалуйста, выберите корректную дату');
        return;
    }
    
    const formattedDate = formatDate(date);
    
    addNewEntry(formattedDate, task, description, status);
    
    saveEntryToStorage(formattedDate, task, description, status);
    
    closeModal();
    
    showNotification('Запись успешно добавлена!');
}

function formatDate(date) {
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${day} ${month}`;
}

function addNewEntry(date, task, description, status) {
    const newEntry = document.createElement('div');
    newEntry.className = `progress-item ${status}`;
    
    const statusSymbol = getStatusSymbol(status);
    
    newEntry.innerHTML = `
        <span class="date">${date}</span>
        <span class="task">${task}</span>
        <span class="status">${statusSymbol}</span>
    `;
    if (description) {
        newEntry.title = description;
        newEntry.addEventListener('click', function() {
            showEntryDescription(task, description, date);
        });
        newEntry.style.cursor = 'pointer';
    }
    
    newEntry.style.opacity = '0';
    newEntry.style.transform = 'translateX(-20px)';
    
    // Добавляем новую запись в начало списка
    progressTimeline.insertBefore(newEntry, progressTimeline.firstChild);
    
    // Запускаем анимацию
    setTimeout(() => {
        newEntry.style.transition = 'all 0.3s ease';
        newEntry.style.opacity = '1';
        newEntry.style.transform = 'translateX(0)';
    }, 10);
}

function getStatusSymbol(status) {
    switch (status) {
        case 'completed':
            return '✓';
        case 'in-progress':
            return 'in progress';
        case 'planned':
            return '○';
        default:
            return '○';
    }
}

function showEntryDescription(title, description, date) {
    if (description) {
        alert(`Задача: ${title}\nДата: ${date}\n\nОписание:\n${description}`);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function saveEntryToStorage(date, task, description, status) {
    try {
        const entries = getEntriesFromStorage();
        const newEntry = {
            id: Date.now(),
            date,
            task,
            description,
            status,
            createdAt: new Date().toISOString()
        };
        
        entries.unshift(newEntry);
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
    }
}

function getEntriesFromStorage() {
    try {
        const entries = localStorage.getItem('diaryEntries');
        return entries ? JSON.parse(entries) : [];
    } catch (error) {
        console.error('Ошибка при чтении из localStorage:', error);
        return [];
    }
}

function loadEntriesFromStorage() {
    const entries = getEntriesFromStorage();
    
    const initialEntries = Array.from(progressTimeline.children).length;
    
    if (entries.length > 0) {
        progressTimeline.innerHTML = '';
        entries.forEach(entry => {
            addNewEntry(entry.date, entry.task, entry.description, entry.status);
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);