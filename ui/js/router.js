// ===== Hash Router =====

import { setState, getState } from './store.js';

const routes = {};

export function registerRoute(name, renderFn) {
    routes[name] = renderFn;
}

export function navigate(page) {
    setState({ currentPage: page });
    window.location.hash = '#' + page;
}

export function getCurrentRoute() {
    return window.location.hash.replace('#', '') || 'login';
}

export function startRouter() {
    window.addEventListener('hashchange', () => {
        const page = getCurrentRoute();
        const state = getState();
        // 未登录只能访问 login 和 project-select
        if (!state.user && page !== 'login' && page !== 'project-select') {
            navigate('login');
            return;
        }
        setState({ currentPage: page });
        renderPage();
    });
}

export function renderPage() {
    const page = getState().currentPage;
    const fn = routes[page];
    if (fn) {
        fn();
    }
}
