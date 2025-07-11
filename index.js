const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 3000;


const multer = require('multer');
const path = require('path');

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // nome único para o arquivo
  }
});

const upload = multer({ storage });


function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = usuario;
    next();
  });
}



app.use(express.json());

app.get('/usuarios', autenticarToken, async (req, res) => {
  const result = await pool.query('SELECT id, nome FROM usuarios');
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

const bcrypt = require('bcryptjs');

app.post('/registro', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nome, senha) VALUES ($1, $2) RETURNING id, nome',
      [nome, senhaHash]
    );

    res.status(201).json({ mensagem: 'Usuário registrado', usuario: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar', detalhe: err.message });
  }
});


const jwt = require('jsonwebtoken');
const SECRET = 'chave-secreta-supersegura'; // use variável de ambiente no futuro

app.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE nome = $1', [nome]);
    const usuario = result.rows[0];

    if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET, { expiresIn: '1h' });

    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhe: err.message });
  }
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


app.post('/upload', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
  }

  res.json({
    mensagem: 'Arquivo enviado com sucesso',
    nomeOriginal: req.file.originalname,
    nomeSalvo: req.file.filename,
    caminho: req.file.path
  });
});







app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
