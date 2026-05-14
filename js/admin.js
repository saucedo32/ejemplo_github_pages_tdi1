import { requireAuth, getNoticias, saveNoticias } from './auth.js';

let modoEdicion = false;
let noticiaEditandoId = null;

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  cargarNoticiasEnTabla();
  setupFormulario();
  
  document.getElementById('cerrarSesionBtn')?.addEventListener('click', () => {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
  });
  
  document.getElementById('volverHomeBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});

function setupFormulario() {
  const form = document.getElementById('noticiaForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const imagen = document.getElementById('imagen').value;
    
    if (!titulo || !descripcion || !imagen) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    if (modoEdicion) {
      modificarNoticia(noticiaEditandoId, { titulo, descripcion, imagen });
    } else {
      agregarNoticia({ titulo, descripcion, imagen });
    }
    
    form.reset();
    modoEdicion = false;
    noticiaEditandoId = null;
    document.getElementById('btnSubmit').textContent = 'Agregar Noticia';
    document.getElementById('btnCancelar').style.display = 'none';
  });
}

function agregarNoticia(noticia) {
  const noticias = getNoticias();
  const nuevoId = noticias.length > 0 ? Math.max(...noticias.map(n => n.id)) + 1 : 1;
  
  noticias.push({ ...noticia, id: nuevoId });
  saveNoticias(noticias);
  cargarNoticiasEnTabla();
}

function modificarNoticia(id, noticiaActualizada) {
  const noticias = getNoticias();
  const index = noticias.findIndex(n => n.id === id);
  
  if (index !== -1) {
    noticias[index] = { ...noticias[index], ...noticiaActualizada };
    saveNoticias(noticias);
    cargarNoticiasEnTabla();
  }
}

function eliminarNoticia(id) {
  if (!confirm('¿Está seguro de eliminar esta noticia?')) return;
  
  const noticias = getNoticias();
  const filtradas = noticias.filter(n => n.id !== id);
  saveNoticias(filtradas);
  cargarNoticiasEnTabla();
}

function cargarNoticiasEnTabla() {
  const tbody = document.getElementById('noticiasTableBody');
  const noticias = getNoticias();
  
  if (!tbody) return;
  
  if (noticias.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No hay noticias</td></tr>';
    return;
  }
  
  tbody.innerHTML = noticias.map(n => `
    <tr>
      <td>${n.titulo}</td>
      <td>${n.descripcion.substring(0, 50)}...</td>
      <td><img src="${n.imagen}" alt="${n.titulo}" class="thumb"></td>
      <td>
        <button onclick="editarNoticia(${n.id})" class="btn-edit">✏️</button>
        <button onclick="eliminarNoticia(${n.id})" class="btn-delete">🗑️</button>
      </td>
    </tr>
  `).join('');
}

window.editarNoticia = function(id) {
  const noticias = getNoticias();
  const noticia = noticias.find(n => n.id === id);
  
  if (!noticia) return;
  
  document.getElementById('titulo').value = noticia.titulo;
  document.getElementById('descripcion').value = noticia.descripcion;
  document.getElementById('imagen').value = noticia.imagen;
  
  modoEdicion = true;
  noticiaEditandoId = id;
  document.getElementById('btnSubmit').textContent = 'Actualizar Noticia';
  document.getElementById('btnCancelar').style.display = 'inline-block';
};

window.eliminarNoticia = eliminarNoticia;