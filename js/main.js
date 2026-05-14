const DARK_MODE_KEY = 'darkMode';

document.addEventListener('DOMContentLoaded', function() {
  initDarkMode();
  initNoticias();
  updateAuthUI();
  loadDolarPrice();
});

function initDarkMode() {
  const savedMode = localStorage.getItem(DARK_MODE_KEY);
  if (savedMode === 'true') {
    document.body.classList.add('dark-mode');
    updateToggleButton(true);
  }
}

function updateToggleButton(isDark) {
  const toggleBtn = document.getElementById('darkModeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? '☀️' : '🌙';
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem(DARK_MODE_KEY, isDark);
  updateToggleButton(isDark);
}

function updateAuthUI() {
  const authLinks = document.getElementById('authLinks');
  if (!authLinks) return;
  
  if (isLoggedIn()) {
    const session = getSession();
    const isDark = document.body.classList.contains('dark-mode');
    authLinks.innerHTML = 
      '<span class="user-welcome">Hola, ' + session.username + '</span>' +
      '<a href="admin.html" class="btn-admin">Panel Admin</a>' +
      '<button id="logoutBtn" class="btn-logout">Cerrar Sesion</button>' +
      '<button id="darkModeToggle" class="btn-darkmode" onclick="toggleDarkMode()">' + (isDark ? '☀️' : '🌙') + '</button>';
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    const isDark = document.body.classList.contains('dark-mode');
    authLinks.innerHTML = '<a href="login.html" class="btn-login">Iniciar Sesion</a>' +
      '<button id="darkModeToggle" class="btn-darkmode" onclick="toggleDarkMode()">' + (isDark ? '☀️' : '🌙') + '</button>';
  }
}

function loadDolarPrice() {
  const dolarContainer = document.getElementById('dolarContainer');
  if (!dolarContainer) return;
  
  getDolarPrice().then(function(result) {
    if (result.success) {
      const cached = localStorage.getItem('dolarCache');
      let lastUpdate = '';
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        const date = new Date(timestamp);
        lastUpdate = ' | Actualizado: ' + date.toLocaleTimeString('es-AR');
      }
      dolarContainer.innerHTML = 
        '<div class="dolar-info">' +
          '<span class="dolar-label">Dolar Oficial: $' + result.data.oficial + '</span>' +
          '<span class="dolar-label">Dolar Blue: $' + result.data.blue + lastUpdate + '</span>' +
        '</div>';
    } else {
      dolarContainer.innerHTML = '<p class="dolar-error">Error al cargar precio: ' + result.error + '</p>';
    }
  });
}

window.toggleDarkMode = toggleDarkMode;