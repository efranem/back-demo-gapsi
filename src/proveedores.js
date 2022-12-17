const Router = require('koa-router');
const fs = require("fs").promises;

// carga de propiedades
const dotenv = require('dotenv').config();

const DB = process.env.DB;

var router = Router({
   prefix: '/proveedores'
}); 

let dataLocal = require('../'+DB);

//Routes will go here
router.get('/', getProveedores);
router.get('/:nombre', getProveedor);
router.post('/', addProveedor);
router.delete('/:nombre', deleteProveedor);
router.put('/:id', updateMovieWithId);

// get proveedores
async function getProveedores(ctx) {

    //const data = await fs.readFile(DB, { encoding: 'utf8' });
    console.log('GET proveedores ');
    
    ctx.body = dataLocal;
}

// get proveedor
async function getProveedor(ctx) {

    //const data = await fs.readFile(DB, { encoding: 'utf8' });
    console.log('GET proveedor ' + ctx.request.params.nombre);

    prov = buscaDatoLocal(ctx.request.params.nombre)

    ctx.body = prov;
}

// add proveedor
async function addProveedor(ctx) {

    console.log('POST proveedores ');

    var prov = buscaDatoLocal(ctx.request.body.nombre)
    if(prov.length > 0) {
        ctx.status = 400;
        ctx.body = {mensaje: "El registro ya existe"};
    } else {
        dataLocal.push(ctx.request.body);
        saveDataLocal();
        ctx.status = 201;
        ctx.body = {mensaje: "El registro exitoso"};
    }   
    
}

// delete proveedor
async function deleteProveedor(ctx) {

    console.log('DELETE proveedor ');

    var index = dataLocal.map(function(proveedor){
        return proveedor.nombre;
     }).indexOf(ctx.request.params.nombre);

    if(index === -1) {
        ctx.status = 404;
        ctx.body = {mensaje: "El registro no existe"};
    } else {
        dataLocal.splice(index, 1);
        saveDataLocal();
        ctx.status = 200;
        ctx.body = {mensaje: "El registro fue eliminado"};
    }   
}

function buscaDatoLocal(nombre) {
    var prov = dataLocal.filter(function(proveedor){
        if(proveedor.nombre === nombre){
           return true;
        }
     });
     return prov;
}

const saveDataLocal = () => {
    fs.writeFile(DB, JSON.stringify(dataLocal, null, 2),
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
  };

module.exports = router;