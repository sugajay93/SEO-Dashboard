// Initialisation de l'application
let currentUser = null;

// Définition des données de démonstration
const demoClients = [
  {
    id: 'demo-1',
    name: 'Dupont Consulting',
    email: 'contact@dupont.fr',
    status: 'active',
    phone: '01 23 45 67 89',
    notes: 'Client depuis janvier 2023',
    created_at: '2023-01-15T10:00:00Z'
  },
  {
    id: 'demo-2',
    name: 'Martin Logistics',
    email: 'info@martinlog.com',
    status: 'active',
    phone: '01 23 45 67 90',
    notes: 'Demande un rapport mensuel',
    created_at: '2023-02-20T14:30:00Z'
  },
  {
    id: 'demo-3',
    name: 'Tech Enterprises',
    email: 'contact@techent.fr',
    status: 'pending',
    phone: '01 23 45 67 91',
    notes: 'En attente de validation',
    created_at: '2023-03-05T09:15:00Z'
  },
  {
    id: 'demo-4',
    name: 'Santé Services',
    email: 'info@sante.fr',
    status: 'inactive',
    phone: '01 23 45 67 92',
    notes: 'Contrat terminé',
    created_at: '2023-01-10T16:45:00Z'
  }
];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async function() {
  showLoadingOverlay();
  
  try {
    console.log('Démarrage en mode démo automatique');
    
    // Toujours utiliser le mode démo dans cet environnement
    window.demoMode = true;
    window.demoClients = [...demoClients]; // Copie pour permettre les modifications
    
    // Mettre à jour l'URL dans les paramètres
    document.getElementById('supabase-url').value = 'Mode démo (Supabase non disponible)';
    
    // Initialiser l'application en mode démo
    await initializeApp();
    
    // Masquer l'écran de chargement
    hideLoadingOverlay();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    alert(`Erreur lors de l'initialisation: ${error.message}`);
    hideLoadingOverlay();
  } finally {
    // Initialiser les écouteurs d'événements
    initEventListeners();
  }
});

// Initialisation de l'application
async function initializeApp() {
  try {
    // Mettre à jour l'interface utilisateur avec un utilisateur de démo
    document.getElementById('user-name').textContent = 'Mode Démo';
    document.getElementById('user-avatar').textContent = 'D';
    document.getElementById('settings-username').value = 'Mode Démo';
    document.getElementById('settings-email').value = 'demo@example.com';
    
    // Mettre à jour le statut de la base de données
    document.getElementById('db-status').className = 'db-status-demo';
    document.getElementById('db-status').textContent = 'Mode démo (local)';
    
    // Charger les données du tableau de bord
    await loadDashboardData();
    
    // Charger les clients
    await loadClients();
    
    // Générer le graphique
    generateChart(document.getElementById('chart-area'));
    
    showToast('info', 'Mode démonstration activé');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error);
    showToast('error', 'Erreur lors du chargement des données');
  }
}

// Chargement des données du tableau de bord
async function loadDashboardData() {
  try {
    const clients = window.demoClients;
    
    // Compter par statut
    const activeClients = clients.filter(c => c.status === 'active').length;
    const pendingClients = clients.filter(c => c.status === 'pending').length;
    const inactiveClients = clients.filter(c => c.status === 'inactive').length;
    
    // Mettre à jour les statistiques
    document.querySelector('#clients-stat h3').textContent = activeClients;
    document.querySelector('#clients-stat').classList.remove('skeleton');
    
    // Simuler d'autres statistiques
    const totalKeywords = Math.floor(Math.random() * 2000) + 500;
    const topPositions = Math.floor(Math.random() * 500) + 100;
    const totalBacklinks = Math.floor(Math.random() * 1500) + 300;
    
    document.querySelector('#keywords-stat h3').textContent = totalKeywords;
    document.querySelector('#keywords-stat').classList.remove('skeleton');
    
    document.querySelector('#positions-stat h3').textContent = topPositions;
    document.querySelector('#positions-stat').classList.remove('skeleton');
    
    document.querySelector('#backlinks-stat h3').textContent = totalBacklinks;
    document.querySelector('#backlinks-stat').classList.remove('skeleton');
    
    // Mettre à jour les statistiques de l'onglet clients
    const clientStats = document.getElementById('client-stats').querySelectorAll('.stat-card');
    clientStats[0].querySelector('h3').textContent = activeClients;
    clientStats[1].querySelector('h3').textContent = pendingClients;
    clientStats[2].querySelector('h3').textContent = inactiveClients;
    clientStats.forEach(stat => stat.classList.remove('skeleton'));
    
  } catch (error) {
    console.error('Erreur lors du chargement des données du tableau de bord:', error);
    showToast('error', 'Erreur lors du chargement des données');
  }
}

// Chargement des clients
async function loadClients() {
  try {
    const clients = window.demoClients;
    
    // Mise à jour de la liste des clients dans le tableau de bord
    updateDashboardClientsList(clients);
    
    // Mise à jour du tableau des clients
    updateClientsTable(clients);
    
  } catch (error) {
    console.error('Erreur lors du chargement des clients:', error);
    showToast('error', 'Erreur lors du chargement des clients');
  }
}

// Mise à jour de la liste des clients dans le tableau de bord
function updateDashboardClientsList(clients) {
  const container = document.getElementById('clients-list-container');
  container.innerHTML = '';
  
  // Limiter à 5 clients maximum
  const displayClients = clients.slice(0, 5);
  
  if (displayClients.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Aucun client trouvé</p>';
    return;
  }
  
  displayClients.forEach(client => {
    const initials = getInitials(client.name);
    const statusClass = `status-${client.status}`;
    const statusText = getStatusText(client.status);
    const backgroundColor = getRandomColor(client.name);
    
    const clientElement = document.createElement('div');
    clientElement.className = 'client-item';
    clientElement.setAttribute('data-id', client.id);
    clientElement.innerHTML = `
      <div class="client-avatar" style="background-color: ${backgroundColor};">${initials}</div>
      <div class="client-info">
        <div class="client-name">${client.name}</div>
        <div class="client-email">${client.email || 'Pas d\'email'}</div>
      </div>
      <span class="status ${statusClass}">${statusText}</span>
    `;
    
    clientElement.addEventListener('click', () => showClientDetail(client));
    container.appendChild(clientElement);
  });
}

// Mise à jour du tableau des clients
function updateClientsTable(clients) {
  const tableBody = document.getElementById('clients-table-body');
  tableBody.innerHTML = '';
  
  if (clients.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5" style="text-align: center;">Aucun client trouvé</td>';
    tableBody.appendChild(row);
    return;
  }
  
  clients.forEach(client => {
    const row = document.createElement('tr');
    
    const statusClass = `status-${client.status}`;
    const statusText = getStatusText(client.status);
    const formattedDate = new Date(client.created_at).toLocaleDateString();
    
    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email || '-'}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td>${formattedDate}</td>
      <td>
        <div class="table-actions">
          <button class="view-btn" title="Voir les détails">👁️</button>
          <button class="edit-btn" title="Modifier">✏️</button>
          <button class="delete-btn" title="Supprimer">🗑️</button>
        </div>
      </td>
    `;
    
    // Ajouter des écouteurs d'événements aux boutons
    row.querySelector('.view-btn').addEventListener('click', () => showClientDetail(client));
    row.querySelector('.edit-btn').addEventListener('click', () => editClient(client));
    row.querySelector('.delete-btn').addEventListener('click', () => confirmDeleteClient(client));
    
    tableBody.appendChild(row);
  });
}

// Afficher la modal de détail du client
function showClientDetail(client) {
  const detailModal = document.getElementById('client-detail-modal');
  const detailTitle = document.getElementById('detail-client-name');
  const detailContent = document.getElementById('client-details-content');
  
  detailTitle.textContent = client.name;
  
  const formattedDate = new Date(client.created_at).toLocaleDateString();
  const statusText = getStatusText(client.status);
  
  // Générer des statistiques aléatoires pour le client
  const keywordsCount = Math.floor(Math.random() * 50) + 10;
  const backlinksCount = Math.floor(Math.random() * 100) + 20;
  const projectsCount = Math.floor(Math.random() * 3) + 1;
  
  detailContent.innerHTML = `
    <div class="section">
      <div class="section-title">Informations générales</div>
      <div class="detail-row">
        <div class="detail-label">ID Client</div>
        <div class="detail-value">${client.id}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Nom</div>
        <div class="detail-value">${client.name}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Email</div>
        <div class="detail-value">${client.email || '-'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Téléphone</div>
        <div class="detail-value">${client.phone || '-'}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Statut</div>
        <div class="detail-value">
          <span class="status status-${client.status}">${statusText}</span>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Date d'ajout</div>
        <div class="detail-value">${formattedDate}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Statistiques</div>
      <div class="detail-row">
        <div class="detail-label">Mots-clés suivis</div>
        <div class="detail-value">${keywordsCount}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Backlinks</div>
        <div class="detail-value">${backlinksCount}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Projets actifs</div>
        <div class="detail-value">${projectsCount}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Notes</div>
      <div class="detail-row">
        <div class="detail-value">${client.notes || 'Aucune note'}</div>
      </div>
    </div>
  `;
  
  document.getElementById('edit-client').onclick = () => editClient(client);
  document.getElementById('delete-client').onclick = () => confirmDeleteClient(client);
  
  detailModal.classList.add('active');
}

// Afficher la modal d'édition du client
function editClient(client) {
  const clientModal = document.getElementById('client-modal');
  const modalTitle = document.getElementById('client-modal-title');
  
  modalTitle.textContent = 'Modifier un client';
  
  document.getElementById('client-id').value = client.id;
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-email').value = client.email || '';
  document.getElementById('client-status').value = client.status;
  document.getElementById('client-phone').value = client.phone || '';
  document.getElementById('client-notes').value = client.notes || '';
  
  // Fermer la modal de détail si elle est ouverte
  document.getElementById('client-detail-modal').classList.remove('active');
  
  clientModal.classList.add('active');
}

// Demander confirmation avant de supprimer un client
function confirmDeleteClient(client) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.name} ?`)) {
    deleteClient(client.id);
  }
}

// Supprimer un client
async function deleteClient(id) {
  showLoadingOverlay();
  
  try {
    // Supprimer le client localement
    window.demoClients = window.demoClients.filter(client => client.id !== id);
    
    // Fermer la modal de détail
    document.getElementById('client-detail-modal').classList.remove('active');
    
    // Recharger les données
    await loadDashboardData();
    await loadClients();
    
    showToast('success', 'Client supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    showToast('error', 'Erreur lors de la suppression du client');
  }
  
  hideLoadingOverlay();
}

// Enregistrer un client (ajout ou modification)
async function saveClient() {
  const id = document.getElementById('client-id').value;
  const name = document.getElementById('client-name').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const status = document.getElementById('client-status').value;
  const phone = document.getElementById('client-phone').value.trim();
  const notes = document.getElementById('client-notes').value.trim();
  
  if (!name) {
    alert('Le nom du client est obligatoire.');
    return;
  }
  
  showLoadingOverlay();
  
  try {
    if (id) {
      // Mise à jour d'un client existant
      const index = window.demoClients.findIndex(c => c.id === id);
      if (index !== -1) {
        window.demoClients[index] = {
          ...window.demoClients[index],
          name,
          email,
          status,
          phone,
          notes,
          updated_at: new Date().toISOString()
        };
      }
    } else {
      // Ajout d'un nouveau client
      const newClient = {
        id: 'demo-' + (window.demoClients.length + 1),
        name,
        email,
        status,
        phone,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      window.demoClients.unshift(newClient);
    }
    
    // Fermer la modal
    document.getElementById('client-modal').classList.remove('active');
    
    // Réinitialiser le formulaire
    document.getElementById('client-id').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-status').value = 'active';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-notes').value = '';
    
    // Recharger les données
    await loadDashboardData();
    await loadClients();
    
    showToast('success', id ? 'Client mis à jour avec succès' : 'Client ajouté avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du client:', error);
    showToast('error', 'Erreur lors de l\'enregistrement du client');
  }
  
  hideLoadingOverlay();
}

// Initialisation des écouteurs d'événements
function initEventListeners() {
  // Navigation par onglets
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Mise à jour de l'onglet actif
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Affichage du contenu correspondant
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId + '-tab') {
          content.classList.add('active');
        }
      });
    });
  });
  
  // Bouton d'ajout de client
  const addClientBtn = document.getElementById('add-client-btn');
  const clientModal = document.getElementById('client-modal');
  const cancelClientBtn = document.getElementById('cancel-client');
  const saveClientBtn = document.getElementById('save-client');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  
  addClientBtn.addEventListener('click', function() {
    document.getElementById('client-modal-title').textContent = 'Ajouter un client';
    document.getElementById('client-id').value = '';
    document.getElementById('client-name').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-status').value = 'active';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-notes').value = '';
    
    clientModal.classList.add('active');
  });
  
  cancelClientBtn.addEventListener('click', function() {
    clientModal.classList.remove('active');
  });
  
  saveClientBtn.addEventListener('click', saveClient);
  
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.modal').classList.remove('active');
    });
  });
  
  // Fermeture de la modal de détail
  document.getElementById('close-detail').addEventListener('click', function() {
    document.getElementById('client-detail-modal').classList.remove('active');
  });
  
  // Bouton de connexion
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  
  // Bouton de déconnexion
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Enregistrement des paramètres
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  
  // Test de connexion à la base de données
  document.getElementById('test-connection').addEventListener('click', testDatabaseConnection);
  
  // Période du graphique
  document.getElementById('chart-period').addEventListener('change', function() {
    generateChart(document.getElementById('chart-area'));
  });
  
  // Recherche de clients
  document.getElementById('client-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const tableRows = document.getElementById('clients-table-body').querySelectorAll('tr');
    
    tableRows.forEach(row => {
      const clientName = row.cells[0].textContent.toLowerCase();
      const clientEmail = row.cells[1].textContent.toLowerCase();
      
      if (clientName.includes(searchTerm) || clientEmail.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
  
  // Mise à jour de l'interface utilisateur lors du clic sur le profil
  document.getElementById('user-profile').addEventListener('click', function() {
    showTab('settings');
  });
  
  // Activer/désactiver le mode démo (sera toujours activé dans cette version)
  document.getElementById('force-demo-mode').addEventListener('click', async function() {
    showToast('info', 'Mode démonstration déjà activé');
  });
  
  // Tentative de connexion à Supabase (montrera juste un message dans cette version)
  document.getElementById('force-production-mode').addEventListener('click', async function() {
    showToast('error', 'La connexion à Supabase n\'est pas disponible dans cet environnement');
    alert("La connexion à Supabase n'est pas disponible dans l'environnement Bind. Utilisez le mode démo ou exécutez cette application sur votre machine locale pour une connexion réelle à Supabase.");
  });
}

// Gérer la connexion
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorElement = document.getElementById('login-error');
  
  if (!email) {
    errorElement.textContent = 'L\'email est obligatoire';
    return;
  }
  
  showLoadingOverlay();
  
  try {
    // En mode démo, on simule une connexion
    document.getElementById('login-modal').classList.remove('active');
    hideLoadingOverlay();
    showToast('success', 'Connecté en mode démonstration');
  } catch (error) {
    console.error('Erreur de connexion:', error);
    errorElement.textContent = 'Erreur de connexion';
    hideLoadingOverlay();
  }
}

// Gérer la déconnexion
async function handleLogout() {
  if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
  
  showLoadingOverlay();
  
  try {
    // Simuler une déconnexion
    showToast('info', 'Déconnexion réussie');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    showToast('error', 'Erreur lors de la déconnexion');
    hideLoadingOverlay();
  }
}

// Enregistrer les paramètres
async function saveSettings() {
  const username = document.getElementById('settings-username').value.trim();
  const language = document.getElementById('settings-language').value;
  
  if (!username) {
    alert('Le nom d\'utilisateur est obligatoire');
    return;
  }
  
  showLoadingOverlay();
  
  try {
    // Mettre à jour l'interface utilisateur
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-avatar').textContent = username.charAt(0).toUpperCase();
    
    showToast('success', 'Paramètres enregistrés avec succès (mode démonstration)');
    hideLoadingOverlay();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des paramètres:', error);
    showToast('error', 'Erreur lors de l\'enregistrement des paramètres');
    hideLoadingOverlay();
  }
}

// Tester la connexion à la base de données
async function testDatabaseConnection() {
  showLoadingOverlay();
  
  try {
    document.getElementById('db-status').className = 'db-status-demo';
    document.getElementById('db-status').textContent = 'Mode démo (local)';
    showToast('info', 'Mode démonstration actif - La connexion à Supabase n\'est pas disponible');
    hideLoadingOverlay();
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    hideLoadingOverlay();
  }
}

// Générer un graphique
function generateChart(container) {
  // Effacer le conteneur
  container.innerHTML = '';
  
  // Période sélectionnée
  const period = document.getElementById('chart-period').value;
  const barCount = period === '30' ? 10 : (period === '90' ? 15 : 20);
  const maxHeight = 250;
  
  // Générer des données aléatoires avec une tendance à la hausse
  let previousHeight = Math.floor(Math.random() * 100) + 50;
  
  for (let i = 0; i < barCount; i++) {
    // Générer une valeur qui suit une tendance (50% chance de hausse)
    const change = Math.random() > 0.3 ? Math.random() * 30 : -Math.random() * 20;
    let height = previousHeight + change;
    
    // Limites
    height = Math.max(30, Math.min(maxHeight, height));
    previousHeight = height;
    
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = height + 'px';
    bar.style.left = (i * (100 / barCount)) + '%';
    
    // Tooltip avec la valeur
    bar.title = `Position moyenne: ${Math.floor(21 - (height / maxHeight) * 20)}`;
    
    container.appendChild(bar);
  }
}

// Utilitaires
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function getStatusText(status) {
  switch (status) {
    case 'active': return 'Actif';
    case 'pending': return 'En attente';
    case 'inactive': return 'Inactif';
    default: return status;
  }
}

function getRandomColor(seed) {
  // Générer une couleur basée sur le texte
  const colors = [
    '#5c7cfa', '#339af0', '#51cf66', '#fcc419', 
    '#ff6b6b', '#cc5de8', '#20c997', '#ff922b'
  ];
  
  const hashCode = seed.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
  
  return colors[Math.abs(hashCode) % colors.length];
}

function showTab(tabId) {
  const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
  if (tab) {
    tab.click();
  }
}

// Afficher un toast
function showToast(type, message) {
  const container = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  // Ajouter au conteneur
  container.appendChild(toast);
  
  // Fermeture du toast
  toast.querySelector('.toast-close').addEventListener('click', () => {
    container.removeChild(toast);
  });
  
  // Supprimer automatiquement après 3 secondes
  setTimeout(() => {
    if (container.contains(toast)) {
      container.removeChild(toast);
    }
  }, 3000);
}

// Afficher l'overlay de chargement
function showLoadingOverlay() {
  document.getElementById('loading-overlay').classList.add('active');
}

// Masquer l'overlay de chargement
function hideLoadingOverlay() {
  document.getElementById('loading-overlay').classList.remove('active');
  
  // Temps d'attente maximum - si après 5 secondes l'overlay est toujours visible, le forcer à se cacher
  setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      console.warn('Forçage de la fermeture du chargement après timeout');
    }
  }, 5000);
}