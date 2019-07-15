const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res, next) => {
  res.json('success!');
});

function getAllAccounts() {
  return db('accounts');
}

function getAccountById(id) {
  return db('accounts').where({ id });
}

function createNewAccount({ name, budget }) {
  return db('accounts').insert({ name, budget });
}

server.get('/accounts', async (req, res) => {
  const accounts = await getAllAccounts();
  res.json(accounts);
});

server.post('/accounts', async (req, res, next) => {
  try {
    const arrayOfIds = await createNewAccount(req.body);
    const arrayOfAccounts = await getAccountById(arrayOfIds[0]);
    res.status(201).json(arrayOfAccounts[0]);
  } catch (error) {
    next(new Error("Couldn't create account"));
  }
});


server.use(function errorHandler(err, req, res, next) {
  console.error('ERROR:', err);
  res.status(500).json({
    message: err.message,
    stack: err.stack
  });
});

module.exports = server;
