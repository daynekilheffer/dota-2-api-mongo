var mongoose = require('mongoose');
var dota = require('./lib/dota-2-api');
var config = require('./config');

var mongoUrl = 'mongodb://' + config.user + ':' + config.pass + '@' + config.host + '/' + config.dbname;

mongoose.connect(mongoUrl);

var playerSchema = new mongoose.Schema({
	account_id: Number,
	player_slot: Number,
	hero_id: Number
});

var matchSchema = new mongoose.Schema({
	match_id: Number,
	match_seq_num: Number,
	start_time: Number,
	lobby_time: Number,
	players: [playerSchema]
});

var Match = mongoose.model('Match', matchSchema);


var steamClient = new dota.steam.WebClient(require('./steam.config'));
steamClient.use(new dota.steam.connectionFactories.Throttled(1000));

var client = new dota.client({
    steam: steamClient
});

client.matchHistory().accountId(140802608).maximumMatches(1).then(function(error, body) {
	console.log(arguments);
    var result = JSON.parse(body).result;
    var match = new Match(result.matches[0]);
    console.log(match.match_id);
    match.save(function() {
    	console.log('saved');
    	console.log(arguments);
    	mongoose.disconnect();
    });
});
