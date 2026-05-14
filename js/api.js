const API_BASE = 'https://dummyjson.com';
const BLUElytics_BASE = 'https://api.bluelytics.com.ar';

async function loginAPI(username, password) {
  try {
    const response = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Credenciales invalidas');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

const DOLAR_CACHE_KEY = 'dolarCache';
const DOLAR_CACHE_DURATION = 60 * 60 * 1000;
const DOLAR_FALLBACK = { oficial: 'N/A', blue: 'N/A' };

async function getDolarPrice() {
  const cached = localStorage.getItem(DOLAR_CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < DOLAR_CACHE_DURATION) {
      return { success: true, data, fromCache: true };
    }
  }

  try {
    const response = await fetch('https://api.bluelytics.com.ar/v2/latest', { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Error al obtener precio del dolar');
    }
    
    const data = await response.json();
    const result = { 
      success: true, 
      data: {
        oficial: data.oficial?.value_sell || 'No disponible',
        blue: data.blue?.value_sell || 'No disponible'
      }
    };
    localStorage.setItem(DOLAR_CACHE_KEY, JSON.stringify({
      data: result.data,
      timestamp: Date.now()
    }));
    return result;
  } catch (error) {
    if (cached) {
      const { data } = JSON.parse(cached);
      return { success: true, data, fromCache: true };
    }
    return { success: true, data: DOLAR_FALLBACK };
  }
}