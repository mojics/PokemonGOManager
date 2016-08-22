var express = require('express'),
  router = express.Router(),
  PokemonGo = require('../models/pokemongo'),
  Pokemon = require('../models/pokemon'),
  _ = require('underscore');

module.exports = function (app) {
  app.use('/', router);

};

router.get('/', function (req, res, next) {

  res.json([]);

});


// var request = require('request');
// request('http://localhost:6000', function (error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body) // Print the body of response.
//   }
// })


router.get('/sniper_background', function (req, res, next) {
  var rarity_list = {
    "Ultra Rare": 1,
    "Very Rare": 2,
    "Rare": 3,
    "Uncommon": 4,
    "Common": 5
  }

  var blacklist = [
    "Bellsprout",
    "Caterpie",
    "Diglett",
    "Doduo",
    "//Drowzee",
    "Ekans",
    "Eevee",
    "Exeggcute",
    "//Gastly",
    "//Geodude",
    "Goldeen",
    "Growlithe",
    "Horsea",
    "Kakuna",
    "Krabby",
    "//Machop",
    "Magikarp",
    "Magnemite",
    "Mankey",
    "Metapod",
    "Meowth",
    "Nidoran♀",
    "Nidoran♂",
    "Oddish",
    "Paras",
    "Pidgey",
    "Pidgeotto",
    "Pidgeot",
    "Poliwag",
    "Psyduck",
    "Rattata",
    "Raticate",
    "Sandshrew",
    "Seel",
    "Shellder",
    "Slowpoke",
    "Spearow",
    "Staryu",
    "Slowpoke",
    "Fearow",
    "Tangela",
    "Tentacool",
    "Venonat",
    "Voltorb",
    "Weedle",
    "Zubat",


    "Golduck",
    "Golbat",
    "Nidorina",
    "Nidorino",
    "Pinsir",
    "Pikachu",
    "Squirtle",
    "Bulbasaur",
    "Charmander",
    "Drowzee",
    "Jigglypuff",
    "Ponyta",
    "Clefairy",
    "Ponyta",
    "Cubone"
    ]
  var request = require('request'),
      fs = require('fs');

  var pokemap_api = "http://163.172.164.252:8000/raw_data?gyms=false&scanned=false&seen=false";
  request(pokemap_api, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body),
          pokemons = [];
          

      
      for(var sniped_id in result.pokemons ){
        var _date = new Date(result.pokemons[sniped_id].disappear_time).toString()
                    
                    .replace('(SGT)', '')  
                    .replace('GMT+0800', '');

        var sniped = {
          pokemon_id: result.pokemons[sniped_id].pokemon_id,
          pokemon_name: result.pokemons[sniped_id].pokemon_name,
          pokemon_rarity: result.pokemons[sniped_id].pokemon_rarity,
          pokemon_rarity_value: rarity_list[result.pokemons[sniped_id].pokemon_rarity],
          disappear_time: _date,
          location: result.pokemons[sniped_id].latitude+","+result.pokemons[sniped_id].longitude
        };
        
        if(blacklist.indexOf(sniped.pokemon_name) == -1){
          pokemons.push(new Pokemon(sniped));  
        }

        //console.log('blacklist '+sniped.pokemon_name, blacklist.indexOf(sniped.pokemon_name));
        



        //console.log('pokemon name', result.pokemons[sniped_id].pokemon_rarity);


      }


      var pokemons_sorted = _.chain(pokemons)
                            .sortBy("pokemon_id")
                            .sortBy("pokemon_rarity_value")
                            .sortBy("disappear_time")
                            .value();




      var outputFilename = 'sniped.json';

      fs.writeFile(outputFilename, JSON.stringify(pokemons_sorted, null, 4), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("JSON saved to " + outputFilename);
            res.json({success: true});
          }
      }); 


      
    }else{
      console.log(error);
    }
  })
  //res.json([]);

});


// Handle 404
router.use(function(req, res) {
   res.send('Error: Page not Found', 404);
});

// Handle 500
router.use(function(error, req, res, next) {
   res.send('Error: Internal Server Error', 500);
});

// router.get('/articles', function (req, res, next) {

//   res.json([{'title':"Sample"}]);

// });




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
