playersList = new Meteor.Collection('players');


// To get rid of these ugly conditionals we can place client code into a 
// "client" folder.
if(Meteor.isClient){

    Meteor.subscribe('thePlayers');

    Template.leaderboard.helpers({
        player: function() {
            var currentUserId = Meteor.userId();
            return playersList.find({}, {sort: {score: -1, name: 1}});
        },
        selectedClass: function() {
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if(selectedPlayer == playerId){
                return 'selected';    
            }
            return;
        },
        showSelectedPlayer: function() {
            var selectedPlayer = Session.get('selectedPlayer');
            return playersList.findOne(selectedPlayer);
        }
    });

    Template.leaderboard.events({
        'click li.player': function(){
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
            var selectedPlayer = Session.get('selectedPlayer');
            console.log(selectedPlayer);
        },
        'click #increment': function() {
            var currentPlayer = Session.get('selectedPlayer');
            // $inc = increments
            // $set = sets the value
            Meteor.call('updateScore', currentPlayer, 5);
            
        },
        'click #decrement': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, -5);
        },
        'click #remove': function() {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayer', selectedPlayer);
        }
    });

    Template.addPlayerForm.events({
        'submit form': function(event) {
            event.preventDefault();

            // If your field has a name attribute then you can get rid of 
            // the template call above and use the line below to access 
            // its value
            var playerName = event.target.playerName.value;

            // Not the best way
            //var playerName = template.find('#playerName').value;

            Meteor.call('insertPlayerData', playerName);
        }
    });
}


// As with the conditional above w can be rid of this by putting all 
// server code into its own folder called "server".
if(Meteor.isServer){
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return playersList.find({createdBy: currentUserId});
    });

    Meteor.methods({
        'insertPlayerData': function(playerName) {
            var currentUserId = Meteor.userId();
            playersList.insert({
                name: playerName,
                score: 0,
                createdBy: currentUserId
            });
        },
        'removePlayer': function(playerId) {
            playersList.remove(playerId);
        },
        'updateScore': function(currentPlayer, scoreChange) {
            playersList.update({_id: currentPlayer}, {$inc: {score: scoreChange}});
        }
    });
}