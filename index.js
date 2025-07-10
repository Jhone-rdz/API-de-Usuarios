const express = require('express');
const app = express();
const PORT = 3000;

let usuarios = [
  { id: 1, nome: "Maria" },
  { id: 2, nome: "João" }
];


app.use(express.json());

app.get('/usuarios', (req, res) => {
   res.json(usuarios);
});
app.post('/usuarios', (req, res) => {
   const { nome } = req.body;
  const novoUsuario = {
    id: usuarios.length + 1,
    nome
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});
app.put('/usuarios/:id', (req, res) => {
   const { id } = req.params;
  const { nome } = req.body;

  const usuario = usuarios.find(u => u.id === parseInt(id));
  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  usuario.nome = nome;
  res.json(usuario);
});
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const index = usuarios.findIndex(u => u.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  const usuarioRemovido = usuarios.splice(index, 1);
  res.json({ mensagem: "Usuário removido", usuario: usuarioRemovido[0] });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
