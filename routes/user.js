require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
      console.log('Token não fornecido.');
      return res.status(403).json({ error: 'Token não fornecido. Faça login.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
          console.error('Erro ao verificar o token:', err.message);
          return res.status(401).json({ error: 'Token inválido ou expirado.' });
      }

      req.userId = decoded.id;
      next();
  });
  
}
router.post('/atualizarSaldo', verifyToken, (req, res) => {
    const { saldo } = req.body;
    const usuarioId = req.userId;

    if (saldo < 0) {
        return res.status(400).json({ error: 'Saldo não pode ser negativo.' });
    }

    const atualizarSaldo = `UPDATE usuarios SET saldo = ? WHERE id = ?`;

    db.query(atualizarSaldo, [saldo, usuarioId], (err) => {
        if (err) {
            console.error('Erro ao atualizar saldo no backend:', err.message);
            return res.status(500).json({ error: 'Erro ao atualizar saldo no banco de dados.' });
        }

        res.status(200).json({ message: 'Saldo atualizado com sucesso.' });
    });
});


router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no servidor.' });
        }

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

router.get('/info', verifyToken, (req, res) => {
  const userId = req.userId;

  db.query('SELECT nome, saldo FROM usuarios WHERE id = ?', [userId], (err, results) => {
      if (err) {
          console.error('Erro ao buscar informações do usuário:', err.message);
          return res.status(500).json({ error: 'Erro ao buscar informações do usuário.' });
      }

      if (results.length > 0) {
       
          const { nome, saldo = 0 } = results[0];
          res.status(200).json({ nome, saldo });
      } else {
          res.status(404).json({ error: 'Usuário não encontrado.' });
      }
  });
});


router.get('/historico', verifyToken, (req, res) => {
  const usuarioId = req.userId;

  const query = `
      SELECT data, tipo, valor 
      FROM historico_transacoes 
      WHERE usuario_id = ? 
      ORDER BY data DESC
  `;

  db.query(query, [usuarioId], (err, results) => {
      if (err) {
          console.error('Erro ao obter histórico de transações:', err.message);
          return res.status(500).json({ error: 'Erro ao buscar histórico de transações.' });
      }

      res.status(200).json(results);
  });
});


router.post('/deposito', verifyToken, (req, res) => {
  const { valor } = req.body;
  const usuarioId = req.userId;

  if (!valor || valor <= 0) {
      return res.status(400).json({ error: 'Valor de depósito inválido.' });
  }

  const atualizarSaldo = `UPDATE usuarios SET saldo = saldo + ? WHERE id = ?`;
  const registrarTransacao = `
      INSERT INTO historico_transacoes (usuario_id, tipo, valor) 
      VALUES (?, 'deposito', ?)
  `;

  db.query(atualizarSaldo, [valor, usuarioId], (err) => {
      if (err) {
          console.error('Erro ao processar depósito:', err.message);
          return res.status(500).json({ error: 'Erro ao atualizar saldo.' });
      }

      db.query(registrarTransacao, [usuarioId, valor], (err) => {
          if (err) {
              console.error('Erro ao registrar transação de depósito:', err.message);
              return res.status(500).json({ error: 'Erro ao registrar transação.' });
          }

          const buscarSaldo = `SELECT saldo FROM usuarios WHERE id = ?`;
          db.query(buscarSaldo, [usuarioId], (err, results) => {
              if (err) {
                  console.error('Erro ao buscar saldo atualizado:', err.message);
                  return res.status(500).json({ error: 'Erro ao buscar saldo atualizado.' });
              }

              res.status(200).json({ 
                  message: 'Depósito realizado com sucesso.', 
                  saldo: results[0]?.saldo || 0 
              });
          });
      });
  });
});

router.post('/saque', verifyToken, (req, res) => {
  const { valor } = req.body;
  const usuarioId = req.userId;

  if (!valor || valor <= 0) {
      return res.status(400).json({ error: 'Valor de saque inválido.' });
  }

  const verificarSaldo = `SELECT saldo FROM usuarios WHERE id = ?`;

  db.query(verificarSaldo, [usuarioId], (err, results) => {
      if (err || results.length === 0) {
          console.error('Erro ao verificar saldo:', err?.message || 'Usuário não encontrado.');
          return res.status(500).json({ error: 'Erro ao verificar saldo.' });
      }

      const saldoAtual = results[0]?.saldo || 0;
      if (saldoAtual < valor) {
          return res.status(400).json({ error: 'Saldo insuficiente.' });
      }

      const atualizarSaldo = `UPDATE usuarios SET saldo = saldo - ? WHERE id = ?`;
      const registrarTransacao = `
          INSERT INTO historico_transacoes (usuario_id, tipo, valor) 
          VALUES (?, 'saque', ?)
      `;

      db.query(atualizarSaldo, [valor, usuarioId], (err) => {
          if (err) {
              console.error('Erro ao atualizar saldo:', err.message);
              return res.status(500).json({ error: 'Erro ao atualizar saldo.' });
          }

          db.query(registrarTransacao, [usuarioId, valor], (err) => {
              if (err) {
                  console.error('Erro ao registrar transação de saque:', err.message);
                  return res.status(500).json({ error: 'Erro ao registrar transação.' });
              }

              const buscarSaldo = `SELECT saldo FROM usuarios WHERE id = ?`;
              db.query(buscarSaldo, [usuarioId], (err, results) => {
                  if (err) {
                      console.error('Erro ao buscar saldo atualizado:', err.message);
                      return res.status(500).json({ error: 'Erro ao buscar saldo atualizado.' });
                  }

                  res.status(200).json({ 
                      message: 'Saque realizado com sucesso.', 
                      saldo: results[0]?.saldo || 0 
                  });
              });
          });
      });
  });
});





module.exports = router;
