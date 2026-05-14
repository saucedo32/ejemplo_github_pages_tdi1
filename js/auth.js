const SESSION_KEY = 'session';
const NOTICIAS_KEY = 'noticias';

const NOTICIAS_PRELOAD = [
  { id: 1, titulo: "JavaScript: El Lenguaje que Domina la Web", descripcion: "JavaScript se ha consolidado como el lenguaje de programacion mas usado en el desarrollo web. Con Node.js y frameworks modernos, su alcance se ha expandido significativamente.", imagen: "https://images.unsplash.com/photo-1579468118864-1b8eaee9685f?w=400" },
  { id: 2, titulo: "Introduccion a React.js", descripcion: "React.js revolutiono la forma de construir interfaces de usuario. Su componente basado en arquitectura y virtual DOM lo convierten en una herramienta indispensable.", imagen: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400" },
  { id: 3, titulo: "CSS Grid vs Flexbox", descripcion: "Entender las diferencias entre CSS Grid y Flexbox es crucial para el diseno web moderno. Grid brilla en layouts bidimensionales complejos.", imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  { id: 4, titulo: "Machine Learning con Python", descripcion: "Python se ha convertido en el lenguaje preferido para cientificos de datos. Librerias como Scikit-learn y TensorFlow facilitan la implementacion de ML.", imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400" },
  { id: 5, titulo: "Data Science: El Rol del Siglo XXI", descripcion: "Los cientificos de datos son profesionistas altamente demandados. Las empresas buscan profesionales capaces de transformar datos en actionable insights.", imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
  { id: 6, titulo: "Big Data y Analisis Predictivo", descripcion: "El analisis predictivo permite a las organizaciones anticipar tendencias y comportamientos futuros. Apache Spark y Hadoop son fundamentales.", imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52c?w=400" }
];

function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

function setSession(userData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function login(username, password) {
  const result = await loginAPI(username, password);
  
  if (result.success) {
    const sessionData = {
      username: result.data.username,
      email: result.data.email,
      token: result.data.token,
      isAdmin: true
    };
    setSession(sessionData);
  }
  
  return result;
}

function logout() {
  clearSession();
  window.location.href = 'index.html';
}

function isLoggedIn() {
  const session = getSession();
  return session !== null && session.isAdmin === true;
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function initNoticias() {
  const noticias = localStorage.getItem(NOTICIAS_KEY);
  if (!noticias) {
    localStorage.setItem(NOTICIAS_KEY, JSON.stringify(NOTICIAS_PRELOAD));
  }
  loadNoticias();
}

function getNoticias() {
  const noticias = localStorage.getItem(NOTICIAS_KEY);
  return noticias ? JSON.parse(noticias) : [];
}

function saveNoticias(noticias) {
  localStorage.setItem(NOTICIAS_KEY, JSON.stringify(noticias));
}

function loadNoticias() {
  const noticias = JSON.parse(localStorage.getItem(NOTICIAS_KEY)) || [];
  const container = document.getElementById('noticiasContainer');
  
  if (!container) return;
  
  if (noticias.length === 0) {
    container.innerHTML = '<p class="no-news">No hay noticias disponibles.</p>';
    return;
  }
  
  container.innerHTML = noticias.map(noticia => 
    '<article class="noticia-card">' +
      '<img src="' + noticia.imagen + '" alt="' + noticia.titulo + '" class="noticia-imagen">' +
      '<div class="noticia-content">' +
        '<h3 class="noticia-titulo">' + noticia.titulo + '</h3>' +
        '<p class="noticia-descripcion">' + noticia.descripcion + '</p>' +
      '</div>' +
    '</article>'
  ).join('');
}