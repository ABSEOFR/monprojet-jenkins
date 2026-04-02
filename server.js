const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DB_FILE = './contacts.json';

app.use(express.json());

// Lire les contacts
function lireContacts() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Sauvegarder les contacts
function sauvegarderContacts(contacts) {
  fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2));
}

// GET / - Page d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'API Gestion de Contacts',
    version: '1.0.0',
    routes: {
      'GET /contacts': 'Lister tous les contacts',
      'GET /contacts/:id': 'Voir un contact',
      'POST /contacts': 'Ajouter un contact',
      'PUT /contacts/:id': 'Modifier un contact',
      'DELETE /contacts/:id': 'Supprimer un contact'
    }
  });
});

// GET /contacts - Lister tous les contacts
app.get('/contacts', (req, res) => {
  const contacts = lireContacts();
  res.json({
    total: contacts.length,
    contacts: contacts
  });
});

// GET /contacts/:id - Voir un contact
app.get('/contacts/:id', (req, res) => {
  const contacts = lireContacts();
  const contact = contacts.find(c => c.id === parseInt(req.params.id));
  if (!contact) {
    return res.status(404).json({ erreur: 'Contact non trouve' });
  }
  res.json(contact);
});

// POST /contacts - Ajouter un contact
app.post('/contacts', (req, res) => {
  const contacts = lireContacts();
  const { nom, prenom, email, telephone } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({
      erreur: 'nom, prenom et email sont obligatoires'
    });
  }

  const nouveauContact = {
    id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    nom,
    prenom,
    email,
    telephone: telephone || ''
  };

  contacts.push(nouveauContact);
  sauvegarderContacts(contacts);
  res.status(201).json(nouveauContact);
});

// PUT /contacts/:id - Modifier un contact
app.put('/contacts/:id', (req, res) => {
  const contacts = lireContacts();
  const index = contacts.findIndex(c => c.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ erreur: 'Contact non trouve' });
  }

  contacts[index] = {
    ...contacts[index],
    ...req.body,
    id: contacts[index].id
  };

  sauvegarderContacts(contacts);
  res.json(contacts[index]);
});

// DELETE /contacts/:id - Supprimer un contact
app.delete('/contacts/:id', (req, res) => {
  const contacts = lireContacts();
  const index = contacts.findIndex(c => c.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ erreur: 'Contact non trouve' });
  }

  const contactSupprime = contacts.splice(index, 1);
  sauvegarderContacts(contacts);
  res.json({
    message: 'Contact supprime',
    contact: contactSupprime[0]
  });
});

app.listen(PORT, () => {
  console.log(`Contacts API demarre sur le port ${PORT}`);
});
