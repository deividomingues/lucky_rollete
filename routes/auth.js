const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

require('dotenv').config();
router.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Por favor, preencha todos os campos.');
  }

  const hashedPassword = bcrypt.hashSync(senha, 8);

  db.query('INSERT INTO usuarios SET ?', { nome, email, senha: hashedPassword }, (err) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err);
      return res.status(500).send('Erro ao registrar usuário.');
    }
    res.status(201).send('Usuário registrado com sucesso!');
  });
});

router.post('/login', (req, res) => {
    console.log('Rota /auth/login foi chamada');
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    console.log('Dados recebidos:', { email, senha });

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro na consulta SQL:', err);
            return res.status(500).json({ error: 'Erro no servidor.' });
        }

        console.log('Resultados da consulta:', results);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const usuario = results[0];
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ auth: true, token, nome: usuario.nome });
    });
});

module.exports = router;
