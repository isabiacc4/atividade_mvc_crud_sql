// Importa o objeto TYPES do módulo 'tedious' para facilitar a definição dos tipos de parâmet
const { TYPES } = require("tedious");
// Importa a função connectDatabase e o objeto Request do arquivo de configuração do banco de
const { connectDatabase, Request } = require("../db/databaseConfig");


// Função assíncrona para executar uma consulta SQL no banco de dados
async function executeQuery(query, params = {}) {
  // Conecta ao banco de dados usando a função connectDatabase
  const connection = await connectDatabase();
  // Retorna uma promessa para tratar a execução da consulta
  return new Promise((resolve, reject) => {
    // Cria uma nova solicitação (Request) com a consulta SQL
    const request = new Request(query, (err) => {
      if (err) {
        // Se houver erro na execução da consulta
        reject(err); // Rejeita a promessa com o erro
      }
      // Fecha a conexão com o banco de dados após a execução da consulta
      connection.close();
    });
    // Adiciona os parâmetros à solicitação
    for (let paramName in params) {
      if (params.hasOwnProperty(paramName)) {
        request.addParameter(paramName, TYPES.VarChar, params[paramName]);
      }
    }
    // Array para armazenar os resultados da consulta
    let results = [];
    // Evento 'row' é disparado para cada linha retornada pela consulta
    request.on("row", (columns) => {
      let row = {};
      // Para cada coluna na linha, armazena o valor no objeto 'row'
      columns.forEach((column) => {
        row[column.metadata.colName] = column.value;
      });
      // Adiciona o objeto 'row' ao array de resultados
      results.push(row);
    });
    // Evento 'requestCompleted' é disparado quando a consulta é concluída
    request.on("requestCompleted", () => {
      // Resolve a promessa com os resultados da consulta
      resolve(results);
    });
    // Executa a solicitação no banco de dados
    connection.execSql(request);
  });
}



// Função assíncrona para listar todas as tarefas do banco de dados
async function listarTarefas() {
  // Consulta SQL para selecionar todas as tarefas
  const query = "SELECT * FROM clientes";
  try {
    // Executa a consulta usando a função executeQuery
    const results = await executeQuery(query);
    // Retorna os resultados da consulta
    return results;
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e lança uma exceção
    console.error("Erro ao executar consulta SQL:", error);
    throw error;
  }
}


async function criarTarefa(tarefa) {

  try {
    const connection = await connectDatabase();
    const request = new Request(
      "INSERT INTO clientes (nome, idade, sexo, cidade) VALUES (@nome, @idade, @sexo, @cidade);",  //convenção do tedious, pede para ser assim para funcionar "@"
      (err, rowCount) => {
        if (err) {
          console.error("Erro ao criar cliente:", err);
          connection.close(); 
          throw err;
        } else {
          console.log("Cliente criado com sucesso!");
          connection.close(); 
        }
      }
    );
    request.addParameter("nome", TYPES.VarChar, tarefa.nome); //parametro tarefa
    request.addParameter("idade", TYPES.Int, tarefa.idade);
    request.addParameter("sexo", TYPES.VarChar, tarefa.sexo);
    request.addParameter("cidade", TYPES.VarChar, tarefa.cidade);

    connection.execSql(request);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    throw error;
  }
}





// Função assíncrona para atualizar uma tarefa existente no banco de dados
async function atualizarTarefa(id, nome, idade, sexo, cidade) {
  try {
    // Conecta ao banco de dados
    const connection = await connectDatabase();
    // Retorna uma nova promessa para tratar a atualização da tarefa
    return new Promise((resolve, reject) => {  //funções - promessa -> sai na frente e espera
      // Cria uma nova solicitação para atualizar a tarefa com o ID especificado
      const request = new Request(
        `UPDATE clientes 
        SET nome = @nome, idade = @idade, sexo = @sexo, cidade = @cidade 
        WHERE cliente_id = @id;`,  //@ - campo - id pq é o parametro da função
        (err, rowCount) => {
          if (err) {
            // Se houver erro na execução da solicitação
            reject(err); // Rejeita a promessa com o erro
          } else {
            // Se a atualização for bem-sucedida
            if (rowCount === 1) {
              // Se uma linha foi afetada pela atualização
              resolve({ id, nome, idade, sexo, cidade }); // Resolve a promessa com os dados da tarefa atualizadas
            } else {
              // Se nenhum registro foi atualizado (tarefa não encontrada)
              reject(new Error("Dados do cliente não encontrado.")); // Rejeita a promessa com uma nova - aparece no console se tiber rejeição
            }
          }
        }
      );
      // Adiciona os parâmetros à solicitação
      request.addParameter("id", TYPES.Int, id);
      request.addParameter("nome", TYPES.NVarChar, nome);
      request.addParameter("idade", TYPES.Int, idade);
      request.addParameter("sexo", TYPES.Char, sexo); // char limita o tamanho - menos caracteres
      request.addParameter("cidade", TYPES.NVarChar, cidade); 
      // Executa a solicitação no banco de dados
      connection.execSql(request);
    });
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e lança uma exceção
    console.error("Erro ao atualizar dados do cliente:", error);
    throw error;
  }
}



// Função assíncrona para excluir uma tarefa do banco de dados
async function excluirTarefa(id) { //parametro id do navegador
  try {
    // Conecta ao banco de dados
    const connection = await connectDatabase();
    // Retorna uma nova promessa para tratar a exclusão da tarefa
    return new Promise((resolve, reject) => {
      // Cria uma nova solicitação para excluir a tarefa com o ID especificado
      const request = new Request(
        `DELETE FROM clientes WHERE cliente_id = @id;`, //@id, que a gente ta passando no parametro da função excluir
        (err, rowCount) => {
          if (err) {
            // Se houver erro na execução da solicitação
            reject(err); // Rejeita a promessa com o erro
          } else {
            // Se a exclusão for bem-sucedida
            if (rowCount === 1) {
              // Se uma linha foi afetada pela exclusão
              resolve(); // Resolve a promessa (tarefa excluída com sucesso)
            } else {
              // Se nenhum registro foi excluído (tarefa não encontrada)
              reject(new Error("Cliente não encontrado.")); // Rejeita a promessa com uma nova
            }
          }
        }
      );
      // Adiciona o parâmetro 'id' à solicitação
      request.addParameter("id", TYPES.Int, id);


      // Executa a solicitação no banco de dados
      connection.execSql(request);
    });
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e lança uma exceção
    console.error("Erro ao excluir cliente:", error);
    throw error;
  }
}


//Função assíncrona para obter os detalhes de uma tarefa pelo ID
async function obterTarefaPorId(id) { //queremos ver o cliente pelo id do banco de dados
  // Tenta executar o código
  try {
    // Consulta SQL para selecionar uma tarefa pelo ID
    const query = ` SELECT * FROM clientes WHERE cliente_id = @id`;
    // Executa a consulta usando a função executeQuery, passando o ID como parâmetro
    const results = await executeQuery(query, { id : id });
    // Retorna os resultados da consulta (a primeira tarefa encontrada com o ID especificado)
    return results[0];
  } catch (error) {
    // Se ocorrer um erro, registra o erro no console e lança uma exceção
    console.error("Erro ao obter cliente por ID:", error);
    throw error;
  }
}


// Exporta todas as funções para uso em outras partes do código
module.exports = {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
  obterTarefaPorId,
};
