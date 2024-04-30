const express = require("express");
const app = express();
const tarefaRouter = require("./routes/tarefaRouter");


// Configuração do diretório de arquivos estáticos
app.use(express.static("public"));

// Configuração das rotas e do parsing do corpo da requisição
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use("/", tarefaRouter);
// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
