var http = require('http');
var express = require('express');
var colors = require('colors');
var bodyParser = require('body-parser');
var path = require('path'); // Incluindo o módulo 'path'

// --- Início da Configuração do MongoDB ---
var mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// [CORREÇÃO MONGO 1] Removi os espaços em branco da URI
const uri = "mongodb+srv://giovana:morangoeuva1@giovana.nfr0ppu.mongodb.net/";

// [CORREÇÃO MONGO 2] Removi 'useNewUrlParser', que está obsoleto
const client = new MongoClient(uri);

// [CORREÇÃO MONGO 3] Definimos as variáveis do DB aqui, mas elas
// só serão preenchidas DEPOIS que a conexão for estabelecida.
let dbo;
let usuarios; // Esta variável será a sua collection 'usuarios' do Mongo
let posts;
// --- Fim da Configuração do MongoDB ---

var app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');

// Suas rotas com o array local (isto não foi alterado)
const USUARIOS = [{ email: 'admin@site.com', senha: '123' }]; 

var server = http.createServer(app);

// [CORREÇÃO MONGO 4] Criamos uma função assíncrona para iniciar tudo
async function startServer() {
  try {
    // 1. Tenta conectar ao MongoDB
    await client.connect();
    console.log("Conectado ao MongoDB com sucesso!".cyan);

    // 2. SÓ DEPOIS de conectar, preenchemos as variáveis do banco
    dbo = client.db("exemplo_bd");
    usuarios = dbo.collection("usuarios"); // Agora a variável 'usuarios' está pronta
    posts = dbo.collection("posts");

    // 3. SÓ DEPOIS de conectar, iniciamos o servidor Express
    server.listen(80);
    console.log('Servidor rodando na porta 80...'.rainbow);

  } catch (err) {
    console.error("Falha ao conectar ao MongoDB".red, err);
    process.exit(1); // Encerra a aplicação se o banco falhar
  }
}

// --- Suas Rotas Antigas (intactas) ---

//Inicia na página de projects
app.get('/', function (requisicao, resposta){
    resposta.redirect('../LAB02/project.html');
});

app.get('/cadastra',function (requisicao, resposta){
    resposta.sendFile(path.join(__dirname, 'public', 'Aula08', 'cadastro.html'));
});

app.post('/cadastra', function (requisicao, resposta) {
    const { nomecompleto, email, senha } = requisicao.body;
    USUARIOS.push({ email, senha });
    console.log(`Novo Usuário Cadastrado: ${email}`);
    resposta.render('resposta_cadastro', { 
        status: 'Sucesso no Cadastro!', 
        mensagem: `O usuário ${nomecompleto} foi cadastrado com sucesso. Total de usuários: ${USUARIOS.length}.`
    });
});

app.get('/login',function (requisicao, resposta){
    resposta.sendFile(path.join(__dirname, 'public', 'Aula08', 'login.html'));
});

app.post('/login', function (requisicao, resposta) {
    const { email, senha } = requisicao.body;
    const usuarioEncontrado = USUARIOS.find(user => user.email === email && user.senha === senha);
    
    let status, mensagem;
    if (usuarioEncontrado) {
        status = 'Sucesso no Login!';
        mensagem = `Bem-vindo(a), ${email}!`;
    } else {
        status = 'Falha no Login!';
        mensagem = 'Email ou senha inválidos. Tente novamente.';
    }
    resposta.render('resposta_cadastro', { status, mensagem });
});

app.get("/cadastrar_post", function(req, resp) {
    // [IMPORTANTE] Verifique se este caminho está correto!
    // Se seu cadastrar_post.html não estiver na pasta 'Aula08', ajuste o caminho.
    resp.sendFile(path.join(__dirname, 'public', 'cadastrar_post.html'));});
// --- ROTA PARA EXIBIR O BLOG DINÂMICO ---
app.get("/blog", async function(req, resp) {
    try {
        // Verifica se a collection 'posts' foi inicializada
        if (!posts) {
            console.error("A collection 'posts' não foi inicializada.");
            return resp.status(500).send("Erro interno do servidor.");
        }

        // Busca TODOS os documentos na collection 'posts'
        // .sort({_id: -1}) // Opcional: ordena pelos mais recentes primeiro
        const todosOsPosts = await posts.find({}).sort({_id: -1}).toArray();

        // Renderiza o arquivo 'views/blog.ejs' e passa os dados para ele
        resp.render('blog', { posts: todosOsPosts });

    } catch (err) {
        console.error("Erro ao buscar posts:", err);
        resp.status(500).send("Erro ao carregar os posts do blog.");
    }
});
// --- Suas Novas Rotas do MongoDB (Agora funcionais) ---

app.post("/cadastrar_usuario", function(req, resp) {
    // [ALERTA DE SEGURANÇA]
    // Você está salvando a senha em texto puro.
    // Isso é muito perigoso. O ideal é usar 'bcrypt' para criar um hash da senha.
    var data = { db_nome: req.body.nome, db_login: req.body.login, db_senha: req.body.senha };
    
    // A variável 'usuarios' agora funciona, pois foi definida no 'startServer'
    usuarios.insertOne(data, function (err) {
      if (err) {
        resp.render('resposta_usuario', {resposta: "Erro ao cadastrar usuário!"})
      }else {
        resp.render('resposta_usuario', {resposta: "Post Cadastrado!"})         
      };
    });
  });

// Rota de login do MongoDB (você chamou de /blog)
// Rota de login do MongoDB (nome da rota e render corrigidos)
app.post("/logar_usuario", function(req, resp) {
    // [ALERTA DE SEGURANÇA]
    // Você está comparando a senha em texto puro.
    var data = {db_login: req.body.login, db_senha: req.body.senha };

    usuarios.find(data).toArray(function(err, items) {
    console.log(items);

      // A verificação de erro deve vir PRIMEIRO
      if (err) {
        // Renderiza a página de resposta, não o blog
        resp.render('resposta_usuario', {resposta: "Erro ao logar usuário!"})
      } else if (items.length == 0) {
        resp.render('resposta_usuario', {resposta: "Usuário/senha não encontrado!"})
      } else {
        resp.render('resposta_usuario', {resposta: "Usuário logado com sucesso!"}) 
      };
    });
  });
// --- Inicialização ---
app.post("/cadastrar_post", async function(req, resp) {
    // 1. Verifica se a collection 'posts' foi inicializada
    if (!posts) {
        console.error("A collection 'posts' não foi inicializada.");
        return resp.status(500).send("Erro interno do servidor.");
    }

    try {
        // 2. Coleta TODOS os dados do formulário
        const novoPost = { 
            titulo: req.body.titulo, 
            resumo: req.body.resumo,     // <-- Campo adicionado
            conteudo: req.body.conteudo,
            dataCriacao: new Date()    // <-- Nome do campo corrigido
        };

        // 3. Insere o novo post na collection 'posts'
        await posts.insertOne(novoPost);
        
        // 4. Redireciona o usuário de volta para o blog
        resp.redirect('/blog');

    } catch (err) {
        console.error("Erro ao cadastrar post:", err);
        resp.render('resposta_usuario', {resposta: "Erro ao cadastrar o post!"});
    }
});
// [CORREÇÃO MONGO 6]
// Em vez de chamar 'server.listen(80)' diretamente,
// chamamos nossa nova função que cuida da conexão e inicialização.
startServer();