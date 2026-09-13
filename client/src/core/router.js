/**
 * CoreTrade ERP — SPA Router
 * Hash-based routing (#/page) for simplicity and compatibility
 */

const routes = new Map();
let currentRoute = null;
let notFoundHandler = null;
let beforeEach = null;

export function route(path, handler) {
  routes.set(path, handler);
}

export function setNotFound(handler) {
  notFoundHandler = handler;
}

export function beforeEachRoute(fn) {
  beforeEach = fn;
}

function getPath() {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '/';
  return hash.slice(1); // Remove leading #
}

function parseRoute(path) {
  // Extract path params e.g. /customers/:id
  for (const [pattern, handler] of routes) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexStr}$`);
    const match = path.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler, params };
    }
  }
  return null;
}

async function resolve() {
  const path = getPath();
  const matched = parseRoute(path);
  const handler = matched?.handler || notFoundHandler;
  const params = matched?.params || {};

  if (beforeEach) {
    const canProceed = await beforeEach(path, params);
    if (!canProceed) return;
  }

  currentRoute = { path, params };
  if (handler) await handler(params);
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  window.addEventListener('hashchange', resolve);
  resolve(); // Initial load
}

export { resolve as refreshRoute };
