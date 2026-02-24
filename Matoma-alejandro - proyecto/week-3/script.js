// ============================================
// CLASE BASE - RealEstateProject
// ============================================

class RealEstateProject {
  #id;
  #name;
  #location;
  #active;

  constructor(name, location) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#location = location;
    this.#active = true;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get location() { return this.#location; }
  get isActive() { return this.#active; }

  activate() { this.#active = true; }
  deactivate() { this.#active = false; }

  getType() {
    return this.constructor.name;
  }
}

// ============================================
// CLASES DERIVADAS
// ============================================

class ResidentialProject extends RealEstateProject {}
class CommercialProject extends RealEstateProject {}
class IndustrialProject extends RealEstateProject {}

// ============================================
// PERSONAS
// ============================================

class Person {
  #id;
  #name;
  #email;

  constructor(name, email) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#email = email;
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get email() { return this.#email; }
}

class Investor extends Person {}
class Developer extends Person {}

// ============================================
// SISTEMA PRINCIPAL
// ============================================

class CrowdfundingPlatform {
  #projects = [];
  #users = [];

  addProject(project) {
    this.#projects.push(project);
  }

  removeProject(id) {
    this.#projects = this.#projects.filter(p => p.id !== id);
  }

  getProjects() {
    return [...this.#projects];
  }

  findProject(id) {
    return this.#projects.find(p => p.id === id);
  }

  addUser(user) {
    this.#users.push(user);
  }

  getUsers() {
    return [...this.#users];
  }

  getStats() {
    return {
      total: this.#projects.length,
      active: this.#projects.filter(p => p.isActive).length,
      inactive: this.#projects.filter(p => !p.isActive).length,
      users: this.#users.length
    };
  }
}

// ============================================
// INSTANCIA
// ============================================

const platform = new CrowdfundingPlatform();

// ============================================
// TABS
// ============================================

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabPanels.forEach(panel => panel.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(tab).classList.add("active");
  });
});

// ============================================
// MODAL PROYECTO
// ============================================

const itemModal = document.getElementById("item-modal");
const addItemBtn = document.getElementById("add-item-btn");
const closeModal = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-btn");
const itemForm = document.getElementById("item-form");

addItemBtn.onclick = () => itemModal.style.display = "flex";
closeModal.onclick = () => itemModal.style.display = "none";
cancelBtn.onclick = () => itemModal.style.display = "none";

// ============================================
// MODAL USUARIO
// ============================================

const userModal = document.getElementById("user-modal");
const addUserBtn = document.getElementById("add-user-btn");
const closeUserModal = document.getElementById("close-user-modal");
const cancelUserBtn = document.getElementById("cancel-user-btn");
const userForm = document.getElementById("user-form");

addUserBtn.onclick = () => userModal.style.display = "flex";
closeUserModal.onclick = () => userModal.style.display = "none";
cancelUserBtn.onclick = () => userModal.style.display = "none";

// ============================================
// RENDER PROYECTOS
// ============================================

const itemList = document.getElementById("item-list");

function renderProjects() {
  const projects = platform.getProjects();

  itemList.innerHTML = projects.map(p => `
    <div class="item-card">
      <h3>${p.name}</h3>
      <p>📍 ${p.location}</p>
      <p>${p.getType()}</p>
      <p>${p.isActive ? "Activo" : "Inactivo"}</p>
      <button onclick="toggleProject('${p.id}')">
        ${p.isActive ? "Desactivar" : "Activar"}
      </button>
      <button onclick="deleteProject('${p.id}')">Eliminar</button>
    </div>
  `).join("");

  renderStats();
}

// ============================================
// RENDER USUARIOS
// ============================================

const userList = document.getElementById("user-list");

function renderUsers() {
  const users = platform.getUsers();

  userList.innerHTML = users.map(u => `
    <div class="item-card">
      <h3>${u.name}</h3>
      <p>${u.email}</p>
      <p>${u.constructor.name}</p>
    </div>
  `).join("");

  renderStats();
}

// ============================================
// ESTADÍSTICAS
// ============================================

function renderStats() {
  const stats = platform.getStats();

  document.getElementById("stat-total").textContent = stats.total;
  document.getElementById("stat-active").textContent = stats.active;
  document.getElementById("stat-inactive").textContent = stats.inactive;
  document.getElementById("stat-users").textContent = stats.users;
}

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.toggleProject = function(id) {
  const project = platform.findProject(id);
  project.isActive ? project.deactivate() : project.activate();
  renderProjects();
};

window.deleteProject = function(id) {
  platform.removeProject(id);
  renderProjects();
};

// ============================================
// FORMULARIOS
// ============================================

itemForm.addEventListener("submit", e => {
  e.preventDefault();

  const type = document.getElementById("item-type").value;
  const name = document.getElementById("item-name").value;
  const location = document.getElementById("item-location").value;

  let project;

  if (type === "ResidentialProject") {
    project = new ResidentialProject(name, location);
  }
  if (type === "CommercialProject") {
    project = new CommercialProject(name, location);
  }
  if (type === "IndustrialProject") {
    project = new IndustrialProject(name, location);
  }

  platform.addProject(project);
  itemModal.style.display = "none";
  itemForm.reset();
  renderProjects();
});

userForm.addEventListener("submit", e => {
  e.preventDefault();

  const role = document.getElementById("user-role").value;
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;

  let user;

  if (role === "Investor") {
    user = new Investor(name, email);
  }
  if (role === "Developer") {
    user = new Developer(name, email);
  }

  platform.addUser(user);
  userModal.style.display = "none";
  userForm.reset();
  renderUsers();
});