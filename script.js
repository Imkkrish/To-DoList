const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const priority = document.getElementById('task-priority');
const list = document.getElementById('task-list');
const modeToggle = document.getElementById('mode-toggle');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterDone = document.getElementById('filter-done');
const clearCompleted = document.getElementById('clear-completed');
const counter = document.getElementById('task-counter');
const emptyState = document.getElementById('empty-state');
const toast = document.getElementById('toast');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'active';

const filters = [filterAll, filterActive, filterDone];
const root = document.documentElement;
const toggle = document.getElementById('mode-toggle');

if (localStorage.getItem('theme') === 'dark') {
  root.classList.add('dark');
  toggle.textContent = '🌞';
} else {
  root.classList.remove('dark');
  toggle.textContent = '🌃';
}

toggle.addEventListener('click', () => {
  root.classList.toggle('dark');
  const isDark = root.classList.contains('dark');
  toggle.textContent = isDark ? '🌞' : '🌃';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2000);
}

function updateCounter() {
  const activeCount = tasks.filter(task => !task.completed).length;
  if (tasks.length === 0) {
    counter.textContent = 'All clear! 😌';
  } else if (activeCount === 0) {
    counter.textContent = 'All tasks done! 🎉';
  } else {
    counter.textContent = `You have ${activeCount} task${activeCount > 1 ? 's' : ''} left. Let’s go! 🚀`;
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'done') return task.completed;
    return true;
  });

  filtered.sort((a, b) => {
    const order = { urgent: 0, normal: 1, chill: 2 };
    return order[a.priority] - order[b.priority];
  });

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  filtered.forEach(task => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement('li');
    li.className = `flex justify-between items-center p-3 rounded-lg bg-white/20 hover:bg-white/30 transition ${
      task.completed ? 'opacity-60 line-through' : ''
    }`;

    const left = document.createElement('div');
    left.className = 'flex items-center gap-2';

    const priorityTag = document.createElement('span');
    priorityTag.textContent = {
      urgent: '🔥',
      normal: '📌',
      chill: '🧘',
    }[task.priority] || '';

    const txt = document.createElement('span');
    txt.textContent = task.text;
    txt.classList.add('cursor-pointer');
    txt.onclick = () => toggleComplete(realIndex);

    left.appendChild(priorityTag);
    left.appendChild(txt);

    const btns = document.createElement('div');
    btns.className = 'space-x-2';

    const edit = document.createElement('button');
    edit.innerHTML = '✏️';
    edit.className = 'hover:scale-110 transform';
    edit.setAttribute('aria-label', 'Edit task');
    edit.onclick = () => editTask(realIndex);

    const del = document.createElement('button');
    del.innerHTML = '🗑️';
    del.className = 'hover:scale-110 transform';
    del.setAttribute('aria-label', 'Delete task');
    del.onclick = () => deleteTask(realIndex);

    btns.appendChild(edit);
    btns.appendChild(del);

    li.appendChild(left);
    li.appendChild(btns);
    list.appendChild(li);
  });

  updateCounter();
}

function addTask(text, priority) {
  tasks.push({ text, completed: false, priority });
  saveTasks();
  renderTasks();
  showToast('✅ Task Added!');
}

function editTask(i) {
  const updated = prompt('Update your vibe:', tasks[i].text);
  if (updated && updated.trim()) {
    tasks[i].text = updated.trim();
    saveTasks();
    renderTasks();
    showToast('✏️ Task Updated!');
  }
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
  showToast('🗑️ Task Deleted!');
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
  renderTasks();
}

function updateFilterHighlight(activeBtn) {
  filters.forEach(btn => {
    btn.classList.remove('font-bold');
    const bar = btn.querySelector('.underline-bar');
    if (bar) {
      bar.classList.remove('w-full');
      bar.classList.add('w-0');
    }
  });

  activeBtn.classList.add('font-bold');
  const activeBar = activeBtn.querySelector('.underline-bar');
  if (activeBar) {
    activeBar.classList.remove('w-0');
    activeBar.classList.add('w-full');
  }
}

filterAll.onclick = () => {
  currentFilter = 'all';
  updateFilterHighlight(filterAll);
  renderTasks();
};

filterActive.onclick = () => {
  currentFilter = 'active';
  updateFilterHighlight(filterActive);
  renderTasks();
};

filterDone.onclick = () => {
  currentFilter = 'done';
  updateFilterHighlight(filterDone);
  renderTasks();
};

clearCompleted.onclick = () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();

  if (currentFilter === 'done') {
    currentFilter = 'active';
    updateFilterHighlight(filterActive);
  }

  renderTasks();
  showToast('🧹 Cleared Completed!');
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  const pri = priority.value;
  if (text) {
    addTask(text, pri);
    input.value = '';
  }
});

renderTasks();
updateFilterHighlight(filterActive);
