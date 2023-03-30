# House of Games API

Hosted version : https://nc-backend-games.onrender.com/api

## Summary

An api which responds with data from a games database, including reviews, comments, votes and users.

## Set-up

### Cloning from GitHub

To clone this repository to your local computer, go to your terminal (make sure your in the folder you want this repository), then enter this command:

```
git clone https://github.com/lowriwyllt/backend-NC-games.git
```

### Install Dependencies

Install all packages needed by using `npm install` in the terminal.

### Environment Variables

There should be two .env files in this repository for testing and development should be set up as `.env.test` and `.env.devlopment`. These should set the PGDATABASE to the correct name of the database which can be found in `setup.sql` :

```
PGDATABASE=<database_name_here>
```

### Seeding Local Database

Firstly set up the local database by running `npm run setup-dbs` in the terminal. Then, running `npm run seed` this will seed the developement database.

### Testing

To run the tests and check everything is working as it should, run `npm test` in the terminal this will run all of the test files.

## Install versions

The minimum versions to run this project:
| Package | Version |
| -------- | ------- |
| Node.js | 9.4.0 |
| Postgres | 1.0.4 |
