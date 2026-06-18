const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

let isSending = false;
const queuedLogs = [];

function normalizeError(error) {
  if (!error) return { message: 'Unknown frontend error', stack: null };
  if (error instanceof Error) return { message: error.message, stack: error.stack || null };
  return { message: String(error), stack: null };
}

function buildPayload(error, extra = {}) {
  const normalized = normalizeError(error);
  return {
    level: extra.level || 'ERROR',
    message: extra.message || normalized.message,
    stack: extra.stack || normalized.stack,
    componentStack: extra.componentStack || null,
    url: window.location.href,
    userAgent: window.navigator.userAgent,
    timestamp: new Date().toISOString()
  };
}

async function flushQueue() {
  if (isSending || queuedLogs.length === 0) return;
  isSending = true;
  const payload = queuedLogs.shift();

  try {
    await fetch(`${API_BASE_URL}/api/logs/frontend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch (error) {
    console.error('Failed to write frontend error log', error);
  } finally {
    isSending = false;
    if (queuedLogs.length > 0) flushQueue();
  }
}

export function logFrontendError(error, extra = {}) {
  queuedLogs.push(buildPayload(error, extra));
  flushQueue();
}

export function installGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    logFrontendError(event.error || event.message, {
      message: event.message,
      stack: event.error?.stack || null
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logFrontendError(event.reason, {
      message: event.reason?.message || 'Unhandled promise rejection'
    });
  });
}
