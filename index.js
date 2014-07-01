var async = require('async');
var mongoose = require('mongoose');
var dota = require('./lib/dota-2-api');
var all = require('./lib/dota-2-api_all');
var config = require('./config');

var mongoUrl = 'mongodb://' + config.user + ':' + config.pass + '@' + config.host + '/' + config.dbname;

console.log('connecting');
mongoose.connect(mongoUrl);
console.log('connected');

var playerSchema = new mongoose.Schema({
	account_id: Number,
	player_slot: Number,
	hero_id: Number
});

var matchSchema = new mongoose.Schema({
	match_id: Number,
	match_seq_num: Number,
	start_time: Number,
	lobby_type: Number,
	players: [playerSchema]
});

var Match = mongoose.model('Match', matchSchema);


var steamClient = new dota.steam.WebClient(require('./steam.config'));
steamClient.use(new dota.steam.connectionFactories.Throttled(1000));

var client = new dota.client({
    steam: steamClient
});

all.matchHistory(client.matchHistory().accountId(140802608)).then(function(error, games) {
    async.each(
        games,
        function(rawMatch, callback) {
            var match = new Match(rawMatch);
            console.log('saving: ' + match.match_id);
            match.save(function() {
                console.log('saved: ' + match.match_id);
                callback();
            });
        },
        function() {
            console.log('done');
            mongoose.disconnect();
            console.log('disconnected');
        }
    );
});
