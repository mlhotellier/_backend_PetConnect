# My Pet Diary - Backend

Bienvenue dans le backend de l'application **My Pet Diary**. Ce backend fournit les API nécessaires à la gestion des données des animaux de compagnie, des contacts vétérinaires, et plus encore. Il est construit avec **Node.js**, **Express**, et **MongoDB**.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure des fichiers](#structure-des-fichiers)
- [Technologies utilisées](#technologies-utilisées)
- [API Endpoints](#api-endpoints)
- [Contributeurs](#contributeurs)
- [License](#license)

---

## Installation

1. Clonez le projet depuis le dépôt Git :
   ```bash
   git clone https://votre-dépôt-url.git
   ```
2. Accédez au dossier du projet :
    ```bash
    cd _backend_my-pet-diary
    ```
3. Installez les dépendances du projet :
    ```bash
    npm install
    ```

Configurez vos variables d'environnement dans un fichier .env (voir la section Configuration ci-dessous).

## Configuration
Avant de démarrer l'application, vous devez configurer certaines variables d'environnement. Créez un fichier .env à la racine de votre projet et ajoutez les variables nécessaires.

Exemple de fichier .env :

```bash
# L'URL de la base de données MongoDB
MONGO_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/<your-database-name>?retryWrites=true&w=majority&appName=<your-app-name>

# Clé secrète pour la génération de tokens JWT
JWT_SECRET=your_jwt_secret_key
```


Note : Le fichier .env doit être ajouté dans votre .gitignore pour éviter de compromettre vos informations sensibles.

## Démarrage du projet
Pour démarrer le projet en mode développement, utilisez la commande suivante :

```bash
npm start
```
Cela démarrera le serveur backend sur http://localhost:5000.

## Structure des fichiers
Voici la structure des fichiers du projet :

```bash
/backend
  ├── /controllers            # Contrôleurs qui gèrent la logique des API
  ├── /models                 # Modèles Mongoose pour la base de données
  ├── /routes                 # Routes de l'API
  ├── /middleware             # Middleware pour l'authentification, validation, etc.
  ├── /config                 # Fichiers de configuration
  ├── .env                    # Variables d'environnement
  ├── .gitignore              # Fichiers à ignorer par Git
  ├── app.js                  # Fichier principal du serveur
  ├── server.js               # Point d'entrée du serveur
  ├── README.md               # Ce fichier
  ├── package.json            # Dépendances et scripts
```

## Technologies utilisées
Ce projet est construit avec les technologies suivantes :

Node.js : Environnement d'exécution JavaScript.
Express.js : Framework web pour Node.js.
MongoDB : Base de données NoSQL.
Mongoose : ORM pour MongoDB.
JWT (JSON Web Token) : Pour l'authentification sécurisée.
dotenv : Pour gérer les variables d'environnement.
Bcrypt.js : Pour le hachage des mots de passe.
Cors : Pour gérer les autorisations Cross-Origin.

## API Endpoints
Voici la liste des principales routes de l'API :

1. Authentification
POST /api/auth/login : Authentifie un utilisateur et retourne un token JWT.
Body : { "email": "user@example.com", "password": "yourpassword" }
POST /api/auth/register : Enregistre un nouvel utilisateur.
Body : { "name": "User", "email": "user@example.com", "password": "yourpassword" }
2. Contacts
GET /api/contacts : Récupère tous les contacts.

Réponse : [ { "name": "Dr. Marie", "adress": "Address", "phone": "123456789", "mail": "email@domain.com" }, ... ]
POST /api/contacts/add : Ajoute un nouveau contact.

Body : { "name": "Dr. Marie", "adress": "Address", "phone": "123456789", "mail": "email@domain.com", "userId": "userId" }
DELETE /api/contacts/remove/:id : Supprime un contact par son ID.

Paramètres : id (ID du contact à supprimer)
3. Pets
GET /api/pets : Récupère tous les animaux.

POST /api/pets/add : Ajoute un nouvel animal.

Body : { "name": "Fido", "type": "Dog", "color": "Brown", "birthDate": "2020-01-01", "userId": "userId" }
PUT /api/pets/update/:id : Met à jour les informations d'un animal.

Paramètres : id (ID de l'animal à mettre à jour)
Body : { "name": "Fido", "type": "Dog", "color": "Brown", "birthDate": "2020-01-01" }

## Contributeurs
Merci à tous les contributeurs qui participent à ce projet !

## License
Ce projet est sous License XYZ (modifiez selon la licence que vous utilisez).