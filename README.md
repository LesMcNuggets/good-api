# API Projet de Développement Web

## Sommaire

* Qui sommes-nous ?
* Features
* Pré-requis
* Mettre en place l'API
* Structure du projet
* Packages
* Contribuer
* License

## Qui sommes-nous ?

Nous sommes une équipe de trois développeurs mettant cette API en open-source pour le besoin d'un examen.
L'objectif de cette API est de mettre en place une solution semblables à Trello mais intégrant un chat instantané en
plus.

## Features

* Afficher et créer des projets
* Créer et modifier les tâches inhérentes à ce projet
* Ajouter des utilisateurs à un projet
* Envoyer des messages instantanés
* Créer un compte/S'y connecter

## Pré-requis

* Node : v16.13.0 ou plus
* yarn

## Mise en place de l'API

1. Cloner le projet
2. `cd ./nuggets-api-node`
3. `cp ./example.env ./.env`
4. `yarn`
5. Remplir les variables d'environnement dans `/.env`

## Structure du projet

* config: Contient les fichiers de configuration
* controllers: Contient les controllers
* middlewares: Contient le middleware JWT
* models: Contient les models de la base de données
* routes: Contient les routes API

## Packages

* bcrypt
* body-parser
* cors
* dotenv
* express
* jsonwebtoken
* moment
* mongoose
* socket.io
* validator

## Contribuer

1. Faire un fork du dépôt
2. Faire les modifs que l'on souhaite
3. Ajouter son git dans CONTRIBUTORS.md
4. Faire une pull request

## License

License MIT
