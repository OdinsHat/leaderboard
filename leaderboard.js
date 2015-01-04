playersList = new Meteor.Collection('players');


// To get rid of these ugly conditionals we can place client code into a 
// "client" folder.
if(Meteor.isClient){
    Template.leaderboard.helpers({
        player: function() {
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
            playersList.update({_id: currentPlayer}, {$inc: {score: 5}});
        }
    })
}


// As with the conditional above w can be rid of this by putting all 
// server code into its own folder called "server".
if(Meteor.isServer){
    console.log('Hello server');
}