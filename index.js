//Importar a biblioteca do Express
const { response } = require('express')
const express = require('express')
// Instanciar a biblioteca do Express
const app = express()

//importar a biblioteca express-handlebars
const { engine } = require('express-handlebars')
const path = require('path')
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({extended:false}))
//aplicar a engine no express
app.set('view engine','handlebars')
app.engine('handlebars',engine(''))
//Código necessário para o nodejs servir os arquivos estáticos do bootstrap
app.use('/css', express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname,'node_modules/jquery/dist')))
app.use('/public', express.static(path.join(__dirname,'public')))

const fakedata = [
    {
        id: 1,
        nome: "Clarinha",
        endereco: "Rua da alegria 28",
        sexo: "Feminino",
        telefone: "88 1111-1111"
    },
    {
        id: 2,
        nome: "Jeca",
        endereco: "Rua da lele 09",
        sexo: "Feminino",
        telefone: "88 1211-1211"
    }
]
app.get('/', function(req,res){
    res.render('home/home')
})

//Criar a rota principal da aplicação http://localhost/
app.get('/clientes', function(req,res){
    res.render('cliente/cliente',
    {listaclientes: fakedata})
})

app.get('/clientes/novo', function(req,res){
    res.render('cliente/formcliente')
})

app.post('/clientes/save', function(req,res){
    let clienteantigo = fakedata.find(o => o.id == req.body.id)

    if (clienteantigo != undefined){
        clienteantigo.nome = req.body.nome
        clienteantigo.endereco = req.body.endereco
        clienteantigo.sexo = req.body.sexo
        clienteantigo.telefone = req.body.telefone 
    }else{
    
    let maiorid = Math.max(...fakedata.map(o => o.id))
    let novocliente = {
        id: maiorid+1,
        nome: req.body.nome,
        endereco: req.body.endereco,
        sexo: req.body.sexo,
        telefone: req.body.telefone
    }
    fakedata.push(novocliente)
    }   
    res.redirect('/clientes')
})

app.get('/clientes/alterar/:id'), function(req,res){
    let id = req.params['id']
    let umcliente = fakedata.find(o => o.id == id)
    res.render('clientes/formcliente',
        {cliente: umcliente})
}

app.get('/clientes/delete/:id', function(req,res){
    //procura o cliente no fakedata pelo id do cliente
    let cliente = fakedata.find(o => o.id == req.params['id'])
    //procura a posição do cliente na lista
    let poscliente = fakedata.indexOf(cliente)
    if(poscliente > -1){
        fakedata.splice(poscliente,1) //remove o cliente
    }
    res.end()
})

//Iniciar a aplicação para ouvir a porta 80
app.listen(80, ()=>{
    console.log('Servidor rodando...')
    console.log('http://localhost/')
})
