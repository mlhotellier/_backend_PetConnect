# PetConnect - Backend

Bienvenue dans le backend de l'application **PetConnect**. Ce backend fournit les API nécessaires à la gestion des données des animaux de compagnie, des contacts vétérinaires, et plus encore. Il est construit avec **Node.js**, **Express**, et **MongoDB**.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure des fichiers](#structure-des-fichiers)
- [Technologies utilisées](#technologies-utilisées)
- [Contributions](#contributions)
- [License](#license)
- [Contact](#contact)

---

## Installation

1. Clonez le projet depuis le dépôt Git :
   ```bash
   git clone https://github.com/mlhotellier/_backend_PetConnect.git
   ```
2. Accédez au dossier du projet :
    ```bash
    cd _backend_PetConnect
    ```
3. Installez les dépendances du projet :
    ```bash
    npm install
    ```

Configurez vos variables d'environnement dans un fichier .env (voir la section Configuration ci-dessous).

## Configuration
Avant de démarrer l'application, vous devez configurer certaines variables d'environnement. Créez un fichier .env à la racine de votre projet et ajoutez les variables nécessaires. Vous devez au préalable créer votre base de données sur MongoDB (version gratuite disponible).

Exemple de fichier .env :

```bash
# L'URL de la base de données MongoDB
MONGO_URI=mongodb+srv://<your-username>:<your-password>@<your-cluster-url>/<your-database-name>?retryWrites=true&w=majority&appName=<your-app-name>

# Clé secrète pour la génération de tokens JWT
JWT_SECRET=your_jwt_secret_key

# PORT de votre serveur
PORT=<your-port-number>
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

## Contributions
Les contributions à ce projet sont les bienvenues ! Si vous souhaitez contribuer, veuillez soumettre une pull request avec vos modifications proposées. Assurez-vous de suivre les bonnes pratiques de développement et de tester vos modifications avant de les soumettre.

## Licence
Ce projet est sous licence MIT.

## Contact
Pour toute question ou demande de renseignements, n'hésitez pas à me contacter par e-mail à l'adresse mathislhotellier@gmail.com.
