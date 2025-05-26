[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Web Services

- Student: Cornelis Thor
- Studentennummer: 202290771
- E-mailadres: <mailto:thor.cornelis@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- ...

## Opstarten

- Maak een `.env` bestand aan met volgende inhoud:  
  ```
  NODE_ENV=development
  DATABASE_PASSWORD=jouw wachtwoord
  ```
- Installeer `yarn`
- Start de server met `yarn start`
## Testen

- Maak een `.env.test` bestand aan met volgende inhoud:  
  ```
  NODE_ENV=test
  DATABASE_PASSWORD=jouw wachtwoord
  ```
- Installeer `yarn`
- Start de server met `yarn test`