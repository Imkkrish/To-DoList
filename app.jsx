/* global React, ReactDOM */

const { useEffect, useMemo, useRef, useState } = React;

function useLocalStorageState(key, initialValue) {
	const [state, setState] = useState(() => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? JSON.parse(raw) : initialValue;
		} catch (_) {
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch (_) {}
	}, [key, state]);

	return [state, setState];
}

function App() {
	const [tasks, setTasks] = useLocalStorageState('tasks', []);
	const [theme, setTheme] = useLocalStorageState('theme', 'light');
	const [filter, setFilter] = useState('active');
	const [text, setText] = useState('');
	const [priority, setPriority] = useState('normal');
	const [toast, setToast] = useState('');
	const [showInstall, setShowInstall] = useState(false);
	const deferredPromptRef = useRef(null);
	const widgetWindowRef = useRef(null);

	const rootClass = useMemo(() => (theme === 'dark' ? 'dark' : ''), [theme]);

	useEffect(() => {
		const docRoot = document.documentElement;
		if (theme === 'dark') docRoot.classList.add('dark');
		else docRoot.classList.remove('dark');
	}, [theme]);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('sw.js').catch(() => {});
			});
		}
	}, []);

	useEffect(() => {
		function onBeforeInstall(e) {
			e.preventDefault();
			deferredPromptRef.current = e;
			if (!localStorage.getItem('install-dismissed')) {
				setTimeout(() => setShowInstall(true), 3000);
			}
		}
		window.addEventListener('beforeinstallprompt', onBeforeInstall);
		return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
	}, []);

	useEffect(() => {
		function onAppInstalled() {
			showQuickToast('🎉 App installed successfully!');
			setShowInstall(false);
		}
		window.addEventListener('appinstalled', onAppInstalled);
		return () => window.removeEventListener('appinstalled', onAppInstalled);
	}, []);

	useEffect(() => {
		function onMsg(event) {
			if (event.data?.type === 'WIDGET_TASKS_UPDATED') {
				setTasks(event.data.tasks);
				showQuickToast('📱 Widget synced!');
			}
		}
		window.addEventListener('message', onMsg);
		return () => window.removeEventListener('message', onMsg);
	}, [setTasks]);

	useEffect(() => {
		function onOnline() { showQuickToast('🌐 Back online!'); }
		function onOffline() { showQuickToast('📡 Working offline'); }
		window.addEventListener('online', onOnline);
		window.addEventListener('offline', onOffline);
		return () => {
			window.removeEventListener('online', onOnline);
			window.removeEventListener('offline', onOffline);
		};
	}, []);

	useEffect(() => {
		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission().catch(() => {});
		}
	}, []);

	const filteredTasks = useMemo(() => {
		const sorted = [...tasks].sort((a, b) => {
			const order = { urgent: 0, normal: 1, chill: 2 };
			return order[a.priority] - order[b.priority];
		});
		if (filter === 'active') return sorted.filter(t => !t.completed);
		if (filter === 'done') return sorted.filter(t => t.completed);
		return sorted;
	}, [tasks, filter]);

	function showQuickToast(message) {
		setToast(message);
		window.clearTimeout(showQuickToast._t);
		showQuickToast._t = window.setTimeout(() => setToast(''), 2000);
	}

	function saveTasks(next) {
		setTasks(next);
		if ('indexedDB' in window) {
			const req = indexedDB.open('TodoPWA', 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', { keyPath: 'id' });
			};
			req.onsuccess = () => {
				const db = req.result;
				const tx = db.transaction(['tasks'], 'readwrite');
				const store = tx.objectStore('tasks');
				next.forEach(task => store.put(task));
			};
		}
	}

	useEffect(() => {
		if ('indexedDB' in window) {
			const req = indexedDB.open('TodoPWA', 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains('tasks')) db.createObjectStore('tasks', { keyPath: 'id' });
			};
			req.onsuccess = () => {
				const db = req.result;
				if (db.objectStoreNames.contains('tasks')) {
					const tx = db.transaction(['tasks'], 'readonly');
					const store = tx.objectStore('tasks');
					const all = store.getAll();
					all.onsuccess = () => {
						if (Array.isArray(all.result) && all.result.length > 0) {
							setTasks(all.result);
						}
					};
				}
			};
		}
	}, [setTasks]);

	function addTask(e) {
		e.preventDefault();
		const value = text.trim();
		if (!value) return;
		const task = { id: Date.now(), text: value, completed: false, priority, timestamp: new Date().toISOString() };
		const next = [...tasks, task];
		saveTasks(next);
		setText('');
		showQuickToast('✅ Task Added!');
		if (widgetWindowRef.current && !widgetWindowRef.current.closed) {
			widgetWindowRef.current.postMessage({ type: 'SYNC_TASKS', tasks: next }, '*');
		}
		if ('Notification' in window && Notification.permission === 'granted') {
			try {
				new Notification('Task Added!', { body: `"${value}" added to your list`, icon: 'icons/icon-192x192.png', badge: 'icons/icon-72x72.png' });
			} catch (_) {}
		}
	}

	function toggleComplete(id) {
		const next = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
		saveTasks(next);
	}

	function editTask(id) {
		const current = tasks.find(t => t.id === id);
		const updated = prompt('Update your vibe:', current?.text || '');
		if (updated && updated.trim()) {
			const next = tasks.map(t => (t.id === id ? { ...t, text: updated.trim() } : t));
			saveTasks(next);
			showQuickToast('✏️ Task Updated!');
		}
	}

	function deleteTask(id) {
		const next = tasks.filter(t => t.id !== id);
		saveTasks(next);
		showQuickToast('🗑️ Task Deleted!');
	}

	function clearCompleted() {
		const next = tasks.filter(t => !t.completed);
		saveTasks(next);
		if (filter === 'done') setFilter('active');
		showQuickToast('🧹 Cleared Completed!');
	}

	function openWidget() {
		if (widgetWindowRef.current && !widgetWindowRef.current.closed) {
			widgetWindowRef.current.focus();
			return;
		}
		widgetWindowRef.current = window.open('widget.html', 'TodoWidget', 'width=350,height=450,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no');
		setTimeout(() => {
			if (widgetWindowRef.current && !widgetWindowRef.current.closed) {
				widgetWindowRef.current.postMessage({ type: 'SYNC_TASKS', tasks }, '*');
			}
		}, 500);
	}

	function onInstallClick() {
		const dp = deferredPromptRef.current;
		if (!dp) return;
		dp.prompt();
		dp.userChoice.finally(() => {
			deferredPromptRef.current = null;
			setShowInstall(false);
		});
	}

	function dismissInstall() {
		setShowInstall(false);
		localStorage.setItem('install-dismissed', 'true');
	}

	const activeCount = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);

	return (
		<div className={rootClass}>
			<div className="max-w-md mx-auto p-6 backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-2xl shadow-xl mt-16">
				<header className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-extrabold tracking-wider">To-Do's</h1>
					<div className="flex gap-2">
						<button onClick={openWidget} id="widget-btn" className="text-xl p-2 hover:bg-white/20 rounded-full" title="Open Desktop Widget">📱</button>
						<button id="mode-toggle" className="text-xl p-2 hover:bg-white/20 rounded-full" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '🌞' : '🌃'}</button>
					</div>
				</header>
				<div id="task-counter" className="text-sm text-white/70 mb-2 text-center">
					{tasks.length === 0 ? 'All clear! 😌' : activeCount === 0 ? 'All tasks done! 🎉' : `You have ${activeCount} task${activeCount > 1 ? 's' : ''} left. Let’s go! 🚀`}
				</div>
				<form id="task-form" className="flex gap-2 mb-4" onSubmit={addTask}>
					<input type="text" id="task-input" placeholder="What’s poppin’ today?" className="flex-1 p-3 rounded-lg bg-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400" required value={text} onChange={e => setText(e.target.value)} />
					<select id="task-priority" className="bg-white/20 text-white text-sm rounded-lg px-2" value={priority} onChange={e => setPriority(e.target.value)}>
						<option value="chill">🧘 Chill</option>
						<option value="normal">📌 Normal</option>
						<option value="urgent">🔥 Urgent</option>
					</select>
					<button type="submit" className="px-4 py-3 bg-pink-500 font-bold rounded-lg hover:scale-105 transform transition">Add</button>
				</form>
				<div className="flex justify-around mb-4">
					<button id="filter-all" className={`relative overflow-hidden px-4 py-2 ${filter === 'all' ? 'font-bold' : ''}`} onClick={() => setFilter('all')}>
						💀 All
						<span className={`underline-bar absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${filter === 'all' ? 'w-full' : 'w-0'}`}></span>
					</button>
					<button id="filter-active" className={`relative overflow-hidden px-4 py-2 ${filter === 'active' ? 'font-bold' : ''}`} onClick={() => setFilter('active')}>
						🆕 Active
						<span className={`underline-bar absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${filter === 'active' ? 'w-full' : 'w-0'}`}></span>
					</button>
					<button id="filter-done" className={`relative overflow-hidden px-4 py-2 ${filter === 'done' ? 'font-bold' : ''}`} onClick={() => setFilter('done')}>
						✅ Done
						<span className={`underline-bar absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${filter === 'done' ? 'w-full' : 'w-0'}`}></span>
					</button>
					<button id="clear-completed" className="relative overflow-hidden px-4 py-2" onClick={clearCompleted}>
						🗑️ Clear
						<span className="underline-bar absolute bottom-0 left-0 h-0.5 bg-white w-0 transition-all duration-300"></span>
					</button>
				</div>
				<ul id="task-list" className="space-y-2">
					{filteredTasks.length === 0 && <div id="empty-state" className="text-center mt-6 opacity-60"><p className="text-xl">✨ Nothing here. Manifesting productivity...</p></div>}
					{filteredTasks.map(task => (
						<li key={task.id} className={`flex justify-between items-center p-3 rounded-lg bg-white/20 hover:bg-white/30 transition ${task.completed ? 'opacity-60 line-through' : ''}`}>
							<div className="flex items-center gap-2">
								<span>{task.priority === 'urgent' ? '🔥' : task.priority === 'normal' ? '📌' : '🧘'}</span>
								<span className="cursor-pointer" onClick={() => toggleComplete(task.id)}>{task.text}</span>
							</div>
							<div className="space-x-2">
								<button className="hover:scale-110 transform" aria-label="Edit task" onClick={() => editTask(task.id)}>✏️</button>
								<button className="hover:scale-110 transform" aria-label="Delete task" onClick={() => deleteTask(task.id)}>🗑️</button>
							</div>
						</li>
					))}
				</ul>
			</div>
			{toast && (
				<div id="toast" className="fixed bottom-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-xl shadow-xl">{toast}</div>
			)}
			{showInstall && (
				<div id="install-prompt" className="fixed bottom-4 left-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 max-w-sm">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">📱</div>
						<div>
							<h3 className="font-bold text-white">Install App</h3>
							<p className="text-sm text-white/70">Add to home screen for quick access</p>
						</div>
					</div>
					<div className="flex gap-2">
						<button id="install-btn" className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition" onClick={onInstallClick}>Install</button>
						<button id="dismiss-install" className="px-4 py-2 text-white/70 hover:text-white transition" onClick={dismissInstall}>Later</button>
					</div>
				</div>
			)}
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

