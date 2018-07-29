'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path')

//create express web-app
const app = express();
const router = express.Router();

//get the libraries to call
var network = require('./network/network.js');
var pug = require('pug');

app.set('view engine', 'pug');

app.use(express.static('./frontend'));
app.use(bodyParser.json());

//get home page
app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/new_index.html'));
});

//get home cidadao
app.get('/new_index_cidadao', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/new_index_cidadao.html'));
});

//get base
app.get('/base', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/base.html'));
});
//get filtro
app.get('/new_consulta_filtro', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/new_consulta_filtro.html'));
});
//get dashboard
app.get('/new_dashboard', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/new_dashboard.html'));
});
//get transactions
app.get('/transactions', function(req, res) {
  request('http://104.196.41.9:3000/api/Vacinacao', function(error, response, body){
    if (!error && response.statusCode == 200) {
      var jsonObject = JSON.parse(body);
      console.log(body); // Aqui podes ver o HTML da página pedida.
      var tabela = `<div class="container">
      <h3></h3>
      <div class="table-responsive">
        <table class="table">
          <caption>Lista de transações</caption>
            <thead>
              <tr>
                <th scope="col">Vacina</th>
                <th scope="col">Nome UBS</th>
                <th scope="col">Nome Profissional</th>
                <th scope="col">Coren</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>`;
      jsonObject.forEach(function(entry){
        tabela += `<tr>
        <td>`+entry.asset.split("#").pop()+`</th>
        <td>`+entry.nomeUBS+`</th>
        <td>`+entry.nomeProfissional+`</th>
        <td>`+entry.coren+`</th>
        <td>`+entry.estado+`</th>
        </tr>`;
      });
      tabela+= `           </tbody>
        </table>
      </div>

    </div>`;
    res.render('new_read_1', {containerhost: tabela});
    }
  });
});

//get read
app.get('/usuario', function(req, res) {
  request('http://104.196.41.9:3000/api/Vacina?filter=%7B%22where%22%3A%20%7B%22owner%22%3A%20%22resource%3Aorg.example.basic.Cidadao%23'+req.query.id+'%22%7D%7D', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonObject = JSON.parse(body);
      console.log(body); // Aqui podes ver o HTML da página pedida.
      var tabela = `<div class="container">
      <h3></h3>
      <div class="table-responsive">
        <table class="table">
          <caption>List de usuários</caption>
            <thead>
              <tr>
                <th scope="col">Vacina</th>
                <th scope="col">Data de validade</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hepatite B</th>
                <td>`+jsonObject[0].validade+`</td>
                <td>`+jsonObject[0].estado+`</td>
              </tr>
              <tr>
                <td>Febre Amarela</th>
                <td>`+jsonObject[3].validade+`</td>
                <td>`+jsonObject[3].estado+`</td>
              </tr>
              <tr>
                <td>Gripe</th>
                <td>`+jsonObject[1].validade+`</td>
                <td>`+jsonObject[1].estado+`</td>
              </tr>
            </tbody>
        </table>
      </div>

    </div>`;

    res.render('new_read_1', {containerhost: tabela});
    }
  });
});
//get readwrite
app.get('/new_readwrite', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/new_readwrite.html'));
});

//declare port
var port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
  port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
  console.log('app running on port: %d', port);
});
