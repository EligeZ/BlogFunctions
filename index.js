import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Array para armazenar as postagens (simulação de banco de dados)
let posts = [];
let nextPostId = 1; // Para gerar IDs únicos para as postagens

app.get("/", (req, res) => {
  // Renderiza a página inicial, passando as últimas 5 postagens em ordem decrescente de data
  const latestPosts = [...posts].sort((a, b) => b.date - a.date).slice(0, 5); // Pega apenas os 5 primeiros elementos (os mais recentes)
  res.render("index.ejs", { posts: latestPosts });
});

app.get("/novo", (req, res) => {
  // Renderiza a página de novo post, permitindo opcionalmente passar dados para edição
  const postId = req.query.id;
  let postToEdit = null;
  if (postId) {
    postToEdit = posts.find((post) => post.id === parseInt(postId));
  }
  res.render("novo.ejs", { post: postToEdit });
});

app.post("/salvar", (req, res) => {
  const titulo = req.body.titulo; // Novo campo de título
  const nome = req.body.nome;
  const texto = req.body.texto;
  const postId = req.body.id; // Se houver um ID, é uma edição

  // Verifica se título, nome e texto foram preenchidos
  if (titulo && nome && texto) {
    if (postId) {
      // Edita uma postagem existente
      const index = posts.findIndex((post) => post.id === parseInt(postId));
      if (index !== -1) {
        posts[index] = {
          id: parseInt(postId),
          titulo,
          nome,
          texto,
          date: new Date(),
        };
      }
    } else {
      // Cria uma nova postagem
      posts.push({ id: nextPostId++, titulo, nome, texto, date: new Date() });
    }
    res.redirect("/"); // Redireciona para a página inicial após salvar
  } else {
    // Se título, nome ou texto não foram preenchidos, renderiza a página 'novo' novamente com uma mensagem de erro
    res.render("novo.ejs", {
      error: "Por favor, preencha título, nome e texto.",
    });
  }
});

app.get("/materia/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts.find((post) => post.id === parseInt(postId));
  if (post) {
    res.render("materia.ejs", { post });
  } else {
    res.status(404).send("Matéria não encontrada.");
  }
});

app.post("/excluir/:id", (req, res) => {
  const postId = req.params.id;
  posts = posts.filter((post) => post.id !== parseInt(postId));
  res.redirect("/"); // Redireciona para a página inicial após excluir
});

app.get("/lista", (req, res) => {
  // Renderiza a página de lista, passando todas as postagens em ordem decrescente de data
  const latestPosts = [...posts].sort((a, b) => b.date - a.date);
  res.render("lista.ejs", { posts: latestPosts });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/*
Comentários das funções:

- import express from "express";: Importa a biblioteca do Express.js para criar o servidor web.
- import bodyParser from "body-parser";: Importa a biblioteca body-parser para analisar os dados enviados via formulário.
- const app = express();: Cria uma instância do aplicativo Express.
- const port = 3000;: Define a porta em que o servidor irá rodar.
- app.use(express.static("public"));: Middleware para servir arquivos estáticos (CSS, imagens, etc.) da pasta 'public'.
- app.use(bodyParser.urlencoded({ extended: true }));: Middleware para analisar dados codificados na URL enviados via formulário.
- let posts = [];: Array na memória para armazenar os objetos de postagem (simulando um banco de dados).
- let nextPostId = 1;: Variável para gerar IDs únicos para cada nova postagem.
- app.get("/", (req, res) => { ... });: Rota GET para a página inicial ('/'). Renderiza 'index.ejs' passando as postagens ordenadas por data.
- app.get("/novo", (req, res) => { ... });: Rota GET para a página de novo post ('/novo'). Permite passar um 'id' via query para edição.
- app.post("/salvar", (req, res) => { ... });: Rota POST para salvar uma nova postagem ou editar uma existente. Valida se nome e texto foram preenchidos.
- app.get("/materia/:id", (req, res) => { ... });: Rota GET para exibir o conteúdo completo de uma matéria específica pelo seu 'id'.
- app.post("/excluir/:id", (req, res) => { ... });: Rota POST para excluir uma matéria específica pelo seu 'id'.
- app.get("/lista", (req, res) => { ... });: Rota GET para a página de lista ('/lista'). Renderiza 'lista.ejs' passando as postagens ordenadas por data.
- app.listen(port, () => { ... });: Inicia o servidor e o faz escutar na porta definida.
*/
