var PokemonGO = require('pokemon-go-node-api');
const util = require('util');


// using var so you can login with multiple users
var a = new PokemonGO.Pokeio();

//Set environment variables or replace placeholder text
var location = {
    type: 'name',
    name: process.env.PGO_LOCATION || 'marina square Singapore'
};


var username = process.env.PGO_USERNAME || 'trainerph1';
var password = process.env.PGO_PASSWORD || 'qwerty';
var provider = process.env.PGO_PROVIDER || 'ptc';

a.init(username, password, location, provider, function(err) {
    if (err) throw err;

    //console.log('1[i] Current location: ' + a.playerInfo.locationName);


    a.GetInventory(function (err, inventory, callback) {
        callback = callback || function(){};
        if (!err) {
            var cleanedInventory = { player_stats: null, eggs : [], pokemon: [], items: [] };
            for (var i = 0; i < inventory.inventory_delta.inventory_items.length; i++) {
                var inventory_item_data = inventory.inventory_delta.inventory_items[i].inventory_item_data;

                // Check for pokemon.
                if (inventory_item_data.pokemon) {
                    var pokemon = inventory_item_data.pokemon;
                    if (pokemon.is_egg) {
                        //console.log('  [E] ' + pokemon.egg_km_walked_target + ' Egg');
                        cleanedInventory.eggs.push(pokemon);
                    } else {
                        var pokedexInfo = a.pokemonlist[parseInt(pokemon.pokemon_id) - 1];
                        var pokemon_iv = ((pokemon.individual_attack/15) + (pokemon.individual_defense/15) + (pokemon.individual_stamina/15)) / 3 * 100;
                        //console.log('  [P] ' + pokedexInfo.name + ' - ' + pokemon.cp + ' CP  - ' + Number((pokemon_iv).toFixed(2))   + ' IV ');
                        cleanedInventory.pokemon.push(pokemon);
                    }
                }

                // Check for player stats.
                if (inventory_item_data.player_stats) {
                    var player = inventory_item_data.player_stats;
                    //console.log('  [PL] Level ' + player.level + ' - ' + player.unique_pokedex_entries + ' Unique Pokemon');

                    cleanedInventory.player_stats = player;
                }

                // Check for item.
                if (inventory_item_data.item) {
                    var item = inventory_item_data.item;
                    //console.log('  [I] ' + item.item_id + ' - ' + item.count);

                    cleanedInventory.items.push(item);
                }
            }

            callback(cleanedInventory);

            console.log(cleanedInventory);
        }
    });

});

