const formEl = document.getElementById('quick-form');
const inputEl = document.getElementById('quick-input');
const priorityEl = document.getElementById('quick-priority');
const cancelEl = document.getElementById('cancel');
const statusEl = document.getElementById('status');

function readTasks() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch (e) {
    return [];
  }
}

function writeTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

async function setAppBadge(count) {
  try {
    if (navigator.setAppBadge) {
      if (count > 0) await navigator.setAppBadge(count); else await navigator.clearAppBadge();
    }
  } catch (e) {}
}

function addTask(text, priority) {
  const tasks = readTasks();
  tasks.push({ text, completed: false, priority });
  writeTasks(tasks);
  const activeCount = tasks.filter(t => !t.completed).length;
  setAppBadge(activeCount);
}

function getParam(name) {
  const params = new URLSearchParams(location.search);
  return params.get(name) || '';
}

function initFromParams() {
  const pri = getParam('priority');
  const text = getParam('text');
  if (pri) priorityEl.value = pri;
  if (text) inputEl.value = decodeURIComponent(text);
}

function closeOrHome() {
  try { window.close(); } catch (_) {}
  location.href = '/';
}

formEl.addEventListener('submit', e => {
  e.preventDefault();
  const text = inputEl.value.trim();
  const pri = priorityEl.value;
  if (!text) {
    statusEl.textContent = 'Please enter a task';
    return;
  }
  addTask(text, pri);
  statusEl.textContent = 'Task added!';
  setTimeout(closeOrHome, 500);
});

cancelEl.addEventListener('click', closeOrHome);

window.addEventListener('load', () => {
  initFromParams();
  const auto = getParam('auto');
  if (auto && inputEl.value.trim()) {
    addTask(inputEl.value.trim(), priorityEl.value);
    setTimeout(closeOrHome, 100);
  }
});

