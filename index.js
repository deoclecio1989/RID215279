
// Carregar tarefas
window.onload = function() {
    loadTasks();
};

const taskList = document.getElementById('task-list');
const addTaskButton = document.getElementById('add-task-btn');
const taskNameInput = document.getElementById('task-name');
const taskTagInput = document.getElementById('task-tag');
const completedCountSpan = document.getElementById('completed-count');
const messageBox = document.getElementById('message-box');
const clearCompletedButton = document.getElementById('clear-completed-btn');

let taskCount = 0;
let completedCount = 0;

// Carregar tarefas persistidas do localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToList(task.name, task.tag, task.date, task.id, task.completed);
    });
    
    // Atualiza o contador de tarefas concluídas após o carregamento
    updateCompletedCount();
}

// Função para adicionar a tarefa na lista
function addTaskToList(taskName, taskTag, taskDate, taskId, isCompleted) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.setAttribute('data-id', taskId);

    taskDiv.innerHTML = `
        <div class="task-left">
            <div class="task-name">${taskName}</div>
            <p class="info">
                <span class="task-tag">${taskTag}</span>
                <span class="task-date">Criado em: ${taskDate}</span>
            </p>
        </div>
        <div class="task-right">
            <button class="complete-btn">Concluir</button>
            <input type="checkbox" class="complete-checkbox" style="display: none;">
        </div>
    `;

    const completeButton = taskDiv.querySelector('.complete-btn');
    const completeCheckbox = taskDiv.querySelector('.complete-checkbox');

    if (isCompleted) {
        taskDiv.classList.add('completed');
        completeButton.style.display = 'none';
        completeCheckbox.style.display = 'inline-block';
        completeCheckbox.checked = true;
        completedCount++;
    }

    completeButton.addEventListener('click', () => markTaskAsCompleted(taskDiv));
    completeCheckbox.addEventListener('change', () => toggleCheckboxStatus(taskDiv));

    taskList.appendChild(taskDiv);
}

// Função para adicionar uma nova tarefa
function addTask() {
    const taskName = taskNameInput.value.trim();
    const taskTag = taskTagInput.value.trim();

    // Verificando se algum campo está vazio
    if (!taskName || !taskTag) {
        showMessage('Por favor, preencha todos os campos');
        return;
    }

    const taskId = `task-${Date.now()}`;
    const taskDate = new Date().toLocaleString();

    addTaskToList(taskName, taskTag, taskDate, taskId, false);

    const newTask = {
        name: taskName,
        tag: taskTag,
        date: taskDate,
        id: taskId,
        completed: false
    };

    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));

    taskNameInput.value = '';
    taskTagInput.value = '';
    taskCount++;
    hideMessage();
}

// Exibe a mensagem de erro
function showMessage(message) {
    messageBox.textContent = message;
    messageBox.style.display = 'block';  // Torna a mensagem visível
}

// Esconde a mensagem de erro
function hideMessage() {
    messageBox.style.display = 'none';  // Esconde a mensagem
}

// Marca a tarefa como concluída
function markTaskAsCompleted(taskDiv) {
    taskDiv.classList.add('completed');
    const completeButton = taskDiv.querySelector('.complete-btn');
    const completeCheckbox = taskDiv.querySelector('.complete-checkbox');

    completeButton.style.display = 'none';
    completeCheckbox.style.display = 'inline-block';
    completeCheckbox.checked = true;

    completedCount++;
    completedCountSpan.textContent = completedCount;

    updateTaskCount();
    updateTaskInStorage(taskDiv, true);
}

// Alterna o estado do checkbox (concluído ou não)
function toggleCheckboxStatus(taskDiv) {
    const completeButton = taskDiv.querySelector('.complete-btn');
    const completeCheckbox = taskDiv.querySelector('.complete-checkbox');

    if (completeCheckbox.checked) {
        taskDiv.classList.add('completed');
        completedCount++;
        completeButton.style.display = 'none';  
    } else {
        taskDiv.classList.remove('completed');
        completedCount--;
        completeButton.style.display = 'inline-block';  
        completeCheckbox.style.display = 'none';
    }

    completedCountSpan.textContent = completedCount;
    updateTaskInStorage(taskDiv, completeCheckbox.checked);
}

// Atualiza o número total de tarefas e pendentes
function updateTaskCount() {
    const totalTasks = taskList.children.length;
    const pendingCount = totalTasks - completedCount;
}

// Atualiza a tarefa no localStorage
function updateTaskInStorage(taskDiv, isCompleted) {
    const taskId = taskDiv.getAttribute('data-id');
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = savedTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        savedTasks[taskIndex].completed = isCompleted;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }
}

// Limpar tarefas concluídas
function clearCompletedTasks() {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.remove();  // Remove da interface
        }
    });

    // Atualiza o localStorage removendo as tarefas concluídas
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const remainingTasks = savedTasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(remainingTasks));

    completedCount = 0;
    completedCountSpan.textContent = completedCount;
}

// Atualiza o contador de tarefas concluídas
function updateCompletedCount() {
    const completedTasks = document.querySelectorAll('.task-item.completed');
    completedCount = completedTasks.length;
    completedCountSpan.textContent = completedCount;
}

// Carregar as tarefas ao carregar a página
window.onload = loadTasks;

// Evento para o botão de limpar tarefas concluídas
clearCompletedButton.addEventListener('click', clearCompletedTasks);

addTaskButton.addEventListener('click', addTask);