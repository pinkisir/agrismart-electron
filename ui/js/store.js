// ===== Simple State Store =====

const state = {
    user: null,
    project: null,
    currentPage: 'login',
    theme: 'dark',   // 'dark' | 'light'
    valves: [],
    alerts: [],
};

const listeners = [];

export function getState() { return state; }

export function setState(updates) {
    Object.assign(state, updates);
    listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
    listeners.push(fn);
    return () => { listeners.splice(listeners.indexOf(fn), 1); };
}

export function login(user) { setState({ user }); }
export function logout() { setState({ user: null, project: null, currentPage: 'login' }); }
export function selectProject(project) { setState({ project, currentPage: 'dashboard' }); }
export function setCurrentPage(page) { setState({ currentPage: page }); }

export function toggleTheme() {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    setState({ theme: next });
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('agrismart-theme', next);
}

export function initTheme() {
    const saved = localStorage.getItem('agrismart-theme') || 'dark';
    setState({ theme: saved });
    document.documentElement.classList.toggle('dark', saved === 'dark');
}

export function toggleValve(valveId, newStatus) {
    const valves = [...state.valves];
    const idx = valves.findIndex(v => v.id === valveId);
    if (idx >= 0) {
        valves[idx] = { ...valves[idx], status: newStatus, flow: newStatus === 'open' ? +(Math.random() * 4 + 1).toFixed(1) : 0 };
        setState({ valves });
    }
}

export function markAlertRead(alertId) {
    const alerts = state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a);
    setState({ alerts });
}
