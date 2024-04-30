const express = require("express");
const path = require("path");
// Cria um roteador do Express
const router = express.Router();
// Importa o controlador de tarefas para lidar com as requisições relacionadas às tarefas
const tarefaController = require("../controllers/tarefaController");


// Rota para listar todas as tarefas
router.get("/tarefas", tarefaController.listarTarefas);

// Rota para renderizar a página de listagem de tarefas
router.get("/listar-tarefa", (req, res) => {
  // Envia o arquivo HTML da página de listagem de tarefas como resposta
  res.sendFile(path.join(__dirname, "../views/listarTarefa.html"));
});

// Rota para exibir o formulário de adicionar tarefa
router.get("/tarefas/adicionar", (req, res) => {
  // Envia o arquivo HTML do formulário de adicionar tarefa como resposta
  res.sendFile(path.join(__dirname, "../views/adicionarTarefa.html"));
});

// Rota para exibir o formulário de editar tarefa
router.get("/tarefas/editar/:id", (req, res) => {
  // Envia o arquivo HTML do formulário de editar tarefa como resposta
  res.sendFile(path.join(__dirname, "..", "views", "editarTarefa.html"));
});

// Rota para exibir o formulário de excluir tarefa
router.get("/tarefas/excluir/:id", (req, res) => {
  // Envia o arquivo HTML do formulário de excluir tarefa como resposta
  res.sendFile(path.join(__dirname, "..", "views", "excluirTarefa.html"));
});

// Rota para exibir o formulário de atualizar tarefa
router.get("/tarefas/atualizar/:id", (req, res) => {
  // Envia o arquivo HTML do formulário de atualizar tarefa como resposta
  res.sendFile(path.join(__dirname, "..", "views", "atualizarTarefa.html"));
});

// Rota para criar uma nova tarefa
router.post("/tarefas", tarefaController.criarTarefa);

// Rota para atualizar uma tarefa existente
router.put("/tarefas/:id", tarefaController.atualizarTarefa);

// Rota para excluir uma tarefa
router.delete("/tarefas/:id", tarefaController.excluirTarefa);

// Rota para obter detalhes de uma tarefa pelo ID
router.get("/tarefas/:id", tarefaController.obterTarefaPorId);

// Rota padrão para a página inicial
router.get("/", (req, res) => {
  // Envia o arquivo HTML da página inicial como resposta
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// Exporta o roteador para uso em outras partes do código
module.exports = router;
