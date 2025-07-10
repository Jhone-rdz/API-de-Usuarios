const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 3000;


app.use(express.json());

app.get('/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

app.post('/usuarios', async (req, res) => {
  const { nome } = req.body;
  const result = await pool.query(
    'INSERT INTO usuarios (nome) VALUES ($1) RETURNING *',
    [nome]
  );
  res.status(201).json(result.rows[0]);
});

app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: err.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({ mensagem: 'Usuário removido', usuario: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover usuário', detalhe: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
