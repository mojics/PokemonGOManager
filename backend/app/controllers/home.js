var express = require('express'),
  router = express.Router(),
  PokemonGo = require('../models/pokemongo');

module.exports = function (app) {
  app.use('/', router);

};

router.get('/', function (req, res, next) {

  res.json([]);

});



router.get('/articles', function (req, res, next) {

  res.json([{'title':"Sample"}]);

});




router.get('/login', function (req, res, next) {

  res.render('login',{
    'error': req.query.error
  });
});




router.post('/pokemons', function (req, res, next) {

  var pokemongo = new PokemonGo(req.body);


  //pokemongo.getInventoryDetails(function(details){
  //  if(details.error === true){
  //    res.status(500).json(details);
  //
  //  }else{
  //    res.json(details);
  //  }
  //});

  pokemongo.getInventoryDetails(function(details){
    if(details.error === true){
      req.session = req.session || {};

      req.session = details;
      //console.log(req.session);
      res.redirect('/login?error='+details.message);
    }else{
      //res.json(details);
      //console.log(details.pokemonlist);
      res.render('pokemons',{
        pokemons: details.pokemon,
        pokemonlist: details.pokemonlist
      });
    }
  });


});
