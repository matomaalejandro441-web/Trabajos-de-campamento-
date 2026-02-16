// ============================================
// Datos de la entidad
// ============================================
const entityData = {
  name: 'BrickFund',
  description:
    'Plataforma de crowdfunding inmobiliario que permite invertir en proyectos de construcción de forma colaborativa y segura.',
  identifier: 'CF-001',

  contact: {
    email: 'crowdfunding222@gmail.com',
    phone: '+57 3105673291',
    location: 'Colombia',
  },

  items: [
    { name: 'Inversión en apartamentos', level: 90, category: 'Residencial' },
    { name: 'Proyectos comerciales', level: 75, category: 'Comercial' },
    { name: 'Proyectos sostenibles', level: 80, category: 'Eco' },
    { name: 'Remodelaciones', level: 65, category: 'Construcción' },
  ],

  links: [
    { platform: 'Website', url: '#', icon: '🌐' },
    { platform: 'LinkedIn', url: '#', icon: '💼' },
  ],

  stats: {
    total: 120,
    active: 45,
    rating: 4.8,
    custom: 500,
  },
};

// ============================================
// Referencias al DOM
// ============================================
const entityName = document.getElementById('userName');
const entityDescription = document.getElementById('userBio');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');
const userLocation = document.getElementById('userLocation');

const itemsList = document.getElementById('skillsList');
const statsContainer = document.getElementById('stats');
const linksContainer = document.getElementById('socialLinks');

const themeToggle = document.getElementById('themeToggle');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyPhoneBtn = document.getElementById('copyPhoneBtn');
const toggleItemsBtn = document.getElementById('toggleSkills');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// ============================================
// Renderizar información básica
// ============================================
const renderBasicInfo = () => {
  const { name, description, contact } = entityData;

  entityName.textContent = name;
  entityDescription.textContent = description;

  userEmail.textContent = contact.email;
  userPhone.textContent = contact.phone;
  userLocation.textContent = `📍 ${contact.location}`;
};

// ============================================
// Renderizar items
// ============================================
const renderItems = (showAll = false) => {
  const { items } = entityData;

  const itemsToShow = showAll ? items : items.slice(0, 4);

  const itemsHtml = itemsToShow
    .map(
      ({ name, level }) => `
      <div class="item">
        <div class="item-name">${name}</div>
        <div class="item-level">
          <span>${level}%</span>
          <div class="level-bar">
            <div class="level-fill" style="width: ${level}%"></div>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  itemsList.innerHTML = itemsHtml;
};

// ============================================
// Renderizar enlaces
// ============================================
const renderLinks = () => {
  const { links } = entityData;

  const linksHtml = links
    .map(
      ({ url, icon, platform }) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        ${icon} ${platform}
      </a>
    `
    )
    .join('');

  linksContainer.innerHTML = linksHtml;
};

// ============================================
// Renderizar estadísticas
// ============================================
const renderStats = () => {
  const { stats } = entityData;

  const statsArray = [
    { label: 'Total proyectos', value: stats.total },
    { label: 'Activos', value: stats.active },
    { label: 'Rating', value: stats.rating },
    { label: 'Inversionistas', value: stats.custom },
  ];

  const statsHtml = statsArray
    .map(
      ({ label, value }) => `
      <div class="stat-item">
        <span class="stat-value">${value}</span>
        <span class="stat-label">${label}</span>
      </div>
    `
    )
    .join('');

  statsContainer.innerHTML = statsHtml;
};

// ============================================
// Tema claro/oscuro
// ============================================
const toggleTheme = () => {
  const currentTheme = document.documentElement.dataset.theme || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.dataset.theme = newTheme;
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';

  localStorage.setItem('theme', newTheme);
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';

  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

// ============================================
// Copiar al portapapeles
// ============================================
const showToast = (message) => {
  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 3000);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('¡Copiado al portapapeles!');
  } catch {
    showToast('No se pudo copiar');
  }
};

const copyEmail = () => copyToClipboard(entityData.contact.email);
const copyPhone = () => copyToClipboard(entityData.contact.phone);

// ============================================
// Mostrar / ocultar items
// ============================================
let showingAllItems = false;

const handleToggleItems = () => {
  showingAllItems = !showingAllItems;
  renderItems(showingAllItems);

  toggleItemsBtn.textContent = showingAllItems
    ? 'Mostrar menos'
    : 'Mostrar más';
};

// ============================================
// Inicialización
// ============================================
const init = () => {
  loadTheme();
  renderBasicInfo();
  renderItems();
  renderLinks();
  renderStats();

  themeToggle.addEventListener('click', toggleTheme);
  copyEmailBtn.addEventListener('click', copyEmail);
  copyPhoneBtn.addEventListener('click', copyPhone);
  toggleItemsBtn.addEventListener('click', handleToggleItems);

  console.log('✅ Proyecto cargado correctamente');
};

// Esperar a que cargue el DOM
window.addEventListener('DOMContentLoaded', init);
