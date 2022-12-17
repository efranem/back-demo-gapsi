const Koa = require('koa');
const router = require('koa-router');
var bodyParser = require('koa-body-parser');


// carga de propiedades
const dotenv = require('dotenv').config();

const PORT = process.env.PORT;

const app = module.exports = new Koa();

//Configuraciones


const proveedores = require('./proveedores.js');

app.use(bodyParser());

app.use(proveedores.routes());


//app.listen(3000);

//incio el servidor
app.listen(PORT,()=>{
    console.log(`Escuchando en el puerto ${PORT}`);
});