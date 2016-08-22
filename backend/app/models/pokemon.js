// Example model


function Pokemon (opts) {
  if(!opts) opts = {};
  this.pokemon_id = opts.pokemon_id || '';
  this.pokemon_name = opts.pokemon_name || '';
  this.pokemon_rarity = opts.pokemon_rarity || '';
  this.pokemon_rarity_value = opts.pokemon_rarity_value || '';
  this.disappear_time = opts.disappear_time || '';
  this.location = opts.location || '';
}


module.exports = Pokemon;

