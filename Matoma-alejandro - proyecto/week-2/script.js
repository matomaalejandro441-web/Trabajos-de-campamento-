// ============================================
// ESTADO GLOBAL
// ============================================

// Array principal donde se almacenan los proyectos en memoria
let items = [];

// Guarda el ID del proyecto que se está editando (si aplica)
let editingItemId = null;

// ============================================
// CATEGORÍAS - Crowdfunding Inmobiliario
// ============================================

// Tipos de proyectos inmobiliarios disponibles
// Cada categoría tiene un nombre y un emoji representativo
const CATEGORIES = {
  residential: { name: 'Residencial', emoji: '🏠' },
  commercial: { name: 'Comercial', emoji: '🏢' },
  industrial: { name: 'Industrial', emoji: '🏭' },
  mixed: { name: 'Uso Mixto', emoji: '🏬' },
};

// Niveles de riesgo/prioridad del proyecto
// Se incluye un color para futura personalización visual
const PRIORITIES = {
  high: { name: 'Alto', color: '#ef4444' },
  medium: { name: 'Medio', color: '#f59e0b' },
  low: { name: 'Bajo', color: '#22c55e' },
};

// ============================================
// PERSISTENCIA
// ============================================

// Carga los proyectos almacenados en localStorage
// Si no existen datos previos, devuelve un array vacío
const loadItems = () =>
  JSON.parse(localStorage.getItem('realEstateProjects') ?? '[]');

// Guarda los proyectos en localStorage
// Se almacenan en formato JSON
const saveItems = itemsToSave =>
  localStorage.setItem('realEstateProjects', JSON.stringify(itemsToSave));

// ============================================
// CRUD (Create, Read, Update, Delete)
// ============================================

// Crea un nuevo proyecto
// Se generan valores por defecto si no se envían datos
const createItem = (itemData = {}) => {
  const newItem = {
    id: Date.now(), // ID único basado en timestamp
    name: itemData.name ?? '',
    description: itemData.description ?? '',
    category: itemData.category ?? 'residential',
    priority: itemData.priority ?? 'medium',
    amount: Number(itemData.amount ?? 0), // Se asegura que sea número
    active: true, // Por defecto el proyecto está activo
    createdAt: new Date().toISOString(),
    updatedAt: null,
    ...itemData,
  };

  const newItems = [...items, newItem];
  saveItems(newItems);
  return newItems;
};

// Actualiza un proyecto existente según su ID
// Se registra la fecha de modificación
const updateItem = (id, updates) => {
  const updatedItems = items.map(item =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );

  saveItems(updatedItems);
  return updatedItems;
};

// Elimina un proyecto por ID
const deleteItem = id => {
  const filtered = items.filter(item => item.id !== id);
  saveItems(filtered);
  return filtered;
};

// Activa o desactiva un proyecto (toggle)
const toggleItemActive = id => {
  const updated = items.map(item =>
    item.id === id
      ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
      : item
  );
  saveItems(updated);
  return updated;
};

// Elimina todos los proyectos inactivos
const clearInactive = () => {
  const activeItems = items.filter(item => item.active);
  saveItems(activeItems);
  return activeItems;
};

// ============================================
// FILTROS
// ============================================

// Filtra por estado (activo, inactivo o todos)
const filterByStatus = (itemsToFilter, status = 'all') => {
  if (status === 'active') return itemsToFilter.filter(i => i.active);
  if (status === 'inactive') return itemsToFilter.filter(i => !i.active);
  return itemsToFilter;
};

// Filtra por categoría
const filterByCategory = (itemsToFilter, category = 'all') =>
  category === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.category === category);

// Filtra por prioridad
const filterByPriority = (itemsToFilter, priority = 'all') =>
  priority === 'all'
    ? itemsToFilter
    : itemsToFilter.filter(i => i.priority === priority);

// Búsqueda por nombre o descripción (no sensible a mayúsculas)
const searchItems = (itemsToFilter, query = '') => {
  if (!query.trim()) return itemsToFilter;

  const term = query.toLowerCase();
  return itemsToFilter.filter(
    i =>
      i.name.toLowerCase().includes(term) ||
      (i.description ?? '').toLowerCase().includes(term)
  );
};

// Aplica todos los filtros en conjunto
const applyFilters = (itemsToFilter, filters = {}) => {
  const {
    status = 'all',
    category = 'all',
    priority = 'all',
    search = '',
  } = filters;

  return searchItems(
    filterByPriority(
      filterByCategory(filterByStatus(itemsToFilter, status), category),
      priority
    ),
    search
  );
};

// ============================================
// ESTADÍSTICAS
// ============================================

// Calcula métricas generales del sistema
const getStats = (itemsToAnalyze = []) => {
  const total = itemsToAnalyze.length;
  const active = itemsToAnalyze.filter(i => i.active).length;
  const inactive = total - active;

  // Suma total invertido
  const totalInvestment = itemsToAnalyze.reduce(
    (acc, item) => acc + Number(item.amount ?? 0),
    0
  );

  // Conteo por categoría
  const byCategory = itemsToAnalyze.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return { total, active, inactive, totalInvestment, byCategory };
};

// ============================================
// RENDER (Interfaz)
// ============================================

// Formatea valores monetarios en USD
const formatCurrency = value =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

// Genera el HTML de un proyecto individual
const renderItem = item => {
  const {
    id,
    name,
    description,
    category,
    priority,
    amount,
    active,
    createdAt,
  } = item;

  return `
    <div class="item ${active ? '' : 'inactive'}" data-item-id="${id}">
      <input type="checkbox" class="item-checkbox" ${
        active ? 'checked' : ''
      }>
      <div class="item-content">
        <h3>${getCategoryEmoji(category)} ${name}</h3>
        ${description ? `<p>${description}</p>` : ''}
        <div class="item-meta">
          <span>${CATEGORIES[category]?.name}</span>
          <span>Riesgo: ${PRIORITIES[priority]?.name}</span>
          <span>Meta: ${formatCurrency(amount)}</span>
          <span>📅 ${new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-delete">🗑️</button>
      </div>
    </div>
  `;
};

// Renderiza la lista completa de proyectos
const renderItems = itemsToRender => {
  const list = document.getElementById('item-list');
  const empty = document.getElementById('empty-state');

  if (itemsToRender.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = itemsToRender.map(renderItem).join('');
  }
};

// Renderiza estadísticas en el dashboard
const renderStats = stats => {
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-inactive').textContent = stats.inactive;

  document.getElementById(
    'stats-details'
  ).innerHTML = `💰 Inversión Total: ${formatCurrency(
    stats.totalInvestment
  )}`;
};

// Devuelve el emoji correspondiente a la categoría
const getCategoryEmoji = category =>
  CATEGORIES[category]?.emoji ?? '🏗️';

// ============================================
// INIT
// ============================================

// Inicializa la aplicación cuando el DOM está listo
// 1. Carga datos
// 2. Renderiza lista
// 3. Calcula estadísticas
// 4. Asigna eventos
const init = () => {
  items = loadItems();
  renderItems(items);
  renderStats(getStats(items));
  attachEventListeners();
  console.log('✅ Plataforma de Crowdfunding Inmobiliario iniciada');
};

document.addEventListener('DOMContentLoaded', init);


// ============================================
// EVENTOS
// ============================================

const attachEventListeners = () => {
  const form = document.getElementById('item-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const category = document.getElementById('item-category').value;
    const priority = document.getElementById('item-priority').value;
    const amount = document.getElementById('item-amount').value;

    items = createItem({
      name,
      description,
      category,
      priority,
      amount,
    });

    renderItems(items);
    renderStats(getStats(items));

    form.reset();
  });
};
