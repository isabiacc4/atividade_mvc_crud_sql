// Importa o modelo de Tarefa para utilizar as funções definidas nele
const Tarefa = require("../models/tarefaModel");


// Controlador para listar todas as tarefas
async function listarTarefas(req, res) {
  try {
    // Chama a função listarTarefas do modelo Tarefa para obter todas as tarefas do banco de
    const tarefas = await Tarefa.listarTarefas();
    // Retorna as tarefas em formato JSON como resposta da requisição
    res.json(tarefas);
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e envia uma resposta de erro com status
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
}


// Controlador para criar uma nova tarefa
async function criarTarefa(req, res) {
  try {
    // Chama a função criarTarefa do modelo Tarefa, passando os dados da nova tarefa do corpo
    await Tarefa.criarTarefa(req.body);
    // Envia uma resposta de sucesso indicando que a tarefa foi criada
    res.send("Tarefa criada com sucesso!");
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e envia uma resposta de erro com status
    console.error("Erro ao criar tarefa:", error);
    res.status(500).send("Erro ao criar tarefa");
  }
}


// Controlador para atualizar uma tarefa existente
async function atualizarTarefa(req, res) {
  try{
    const { id } = req.params;
    const { nome, idade, sexo, cidade } = req.body;

    // Chama a função atualizarTarefa do modelo Tarefa, passando os dados da tarefa atualizada
    const tarefaAtualizada = await Tarefa.atualizarTarefa(id, nome, idade, sexo, cidade)
    res.json(tarefaAtualizada)

  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "erro ao atualizar tarefa" });
  }
}
// Controlador para excluir uma tarefa
async function excluirTarefa(req, res) {
  try{
    const { id } = req.params;
    await Tarefa.excluirTarefa(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
 
}


// Controlador para obter os detalhes de uma tarefa pelo ID
async function obterTarefaPorId(req, res) {
  try{
    const { id } = req.params;
    const tarefa = await Tarefa.obterTarefaPorId(id);
    res.json(tarefa || { error: "tarefa não encontrada"});
  } catch (error) {
    console.error("Erro ao obter tarefa por ID:", error);
    res.status(500).json({ error: "Erro ao obter tarefa por ID" });
  }
}
// Exporta todos os controladores para uso em outras partes do código
module.exports = {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  obterTarefaPorId,
};
