const Router = require('koa-router');
const fs = require("fs").promises;

// carga de propiedades
const dotenv = require('dotenv').config();

const DB = process.env.DB;

var router = Router({
   prefix: '/proveedores'
}); 

var proveedores = [
   {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
   {id: 102, name: "Inception", year: 2010, rating: 8.7},
   {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
   {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
];

let dataLocal = require('../'+DB);

//Routes will go here
router.get('/', getProveedores);
router.get('/:id([0-9]{3,})', sendMovieWithId);
router.post('/', addProveedor);
router.put('/:id', updateMovieWithId);
router.delete('/:id', deleteMovieWithId);

// get proveedores
async function getProveedores(ctx) {

    //const data = await fs.readFile(DB, { encoding: 'utf8' });
    console.log('GET proveedores ' + dataLocal);
    
    ctx.body = dataLocal;
}


// get proveedores
async function addProveedor(ctx) {

    console.log('POST proveedores ' + ctx.request.body);

    dataLocal.push(ctx.request.body);
    save();
    
}

const save = () => {
    fs.writeFile(DB, JSON.stringify(dataLocal, null, 2),
      (error) => {
        if (error) {
          throw error;
        }
      }
    );
  };


function *deleteMovieWithId(next){
   var removeIndex = movies.map(function(movie){
      return movie.id;
   }).indexOf(this.params.id); //Gets us the index of movie with given id.
   
   if(removeIndex === -1){
      this.body = {message: "Not found"};
   } else {
      movies.splice(removeIndex, 1);
      this.body = {message: "Movie id " + this.params.id + " removed."};
   }
}

function *updateMovieWithId(next) {
   //Check if all fields are provided and are valid:
   if(!this.request.body.name ||
      !this.request.body.year.toString().match(/^[0-9]{4}$/g) ||
      !this.request.body.rating.toString().match(/^[0-9]\.[0-9]$/g) ||
      !this.params.id.toString().match(/^[0-9]{3,}$/g)){
      
      this.response.status = 400;
      this.body = {message: "Bad Request"};
   } else {
      //Gets us the index of movie with given id.
      var updateIndex = movies.map(function(movie){
         return movie.id;
      }).indexOf(parseInt(this.params.id));
      
      if(updateIndex === -1){
         //Movie not found, create new
         movies.push({
            id: this.params.id,
            name: this.request.body.name,
            year: this.request.body.year,
            rating: this.request.body.rating
         });
         this.body = {message: "New movie created.", location: "/movies/" + this.params.id};
      } else {
         //Update existing movie
            movies[updateIndex] = {
            id: this.params.id,
            name: this.request.body.name,
            year: this.request.body.year,
            rating: this.request.body.rating
         };
         this.body = {message: "Movie id " + this.params.id + " updated.", 
            location: "/movies/" + this.params.id};
      }
   }
}

function *addNewMovie(next){
   //Check if all fields are provided and are valid:
   if(!this.request.body.name ||
      !this.request.body.year.toString().match(/^[0-9]{4}$/g) ||
      !this.request.body.rating.toString().match(/^[0-9]\.[0-9]$/g)){
      
      this.response.status = 400;
      this.body = {message: "Bad Request"};
   } else {
      var newId = movies[movies.length-1].id+1;
      
      movies.push({
         id: newId,
         name: this.request.body.name,
         year: this.request.body.year,
         rating: this.request.body.rating
      });
      this.body = {message: "New movie created.", location: "/movies/" + newId};
   }
   yield next;
}



function *sendMovies(next){
   this.body = movies;
   yield next;
}

function *sendMovieWithId(next){
   var ctx = this
   
   var currMovie = movies.filter(function(movie){
      if(movie.id == ctx.params.id){
         return true;
      }
   });
   if(currMovie.length == 1){
      this.body = currMovie[0];
   } else {
      this.response.status = 404;
      this.body = {message: "Not Found"};
   }
   yield next;
}
module.exports = router;