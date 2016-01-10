
//variables not declared with var or let are considered global to the application
Matches = new Mongo.Collection("matches");

if (Meteor.isClient) {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.startup(function () {
        //starts the React views
        let polls = <Polls />
        ReactDOM.render(polls, document.getElementById('root'));
    });
} else if (Meteor.isServer) {
    let fetchData = () => {
        HTTP.get("https://api.parse.com/1/classes/events/",
            {
                headers: {
                    'X-Parse-Application-Id': 'Yf78y7JmKLvftwIMuTPfDVYj9TbH3SQtEUVDXepj',
                    'X-Parse-REST-API-Key': 'x2lBZtK1wudKicoAr3LAJTqdsqMCNdlZrYlvHrlL',
                },
            },
            function(error, result) {
                if (error === null && result.statusCode < 300) {
                    for (let result of result.data.results) {
                        let emptyVotes = {
                            homeVotes: [],
                            awayVotes: [],
                            drawVotes: [],
                        }
                        //inserting matches into the MongoDB Collection
                        //if the match is already in the Collection, only update it (without changing the votes)
                        Matches.upsert(
                            {
                                id: result.id //this is the match id, not mongodb _id
                            }, {
                                $set: result,
                                $setOnInsert: emptyVotes,
                            }
                        );
                    }
                } else {
                    console.log(result);
                }
                Meteor.setTimeout(fetchData, 30000); //periodically updates the data
            }
        );
    }

    fetchData();


    Meteor.publish("Matches", function () {
        return Matches.find({});
    });
}


// utility function called by Meteor.methods
let vote = function(_id, propertyName) {
    let userId = Meteor.userId()
    if (userId == null)
        throw new Error('User not logged');

    let addToSet = {
        [propertyName]: userId,
    };

    let pull = {
        homeVotes: userId,
        awayVotes: userId,
        drawVotes: userId,
    };
    delete pull[propertyName]; //can't pull and add to the same array in a single operation

    Matches.update({ _id: _id}, {
        //removes the userID from vote arrays
        $pull: pull,

        //adds the userID into the propertyName array if it is not already there
        //$addToSet only adds if the element is not already in the array
        $addToSet: addToSet,
    });
};

Meteor.methods({
    voteHome(_id) {
        vote(_id, "homeVotes");
    },

    voteAway(_id) {
        vote(_id, "awayVotes");
    },

    voteDraw(_id) {
        vote(_id, "drawVotes");
    },

    //used for testing
    insertMatch(match) {
        //TODO check if in dev mode
        return Matches.insert(match);
    },

    //used for testing
    removeByMatchId(id) {
        //TODO check if in dev mode
        Matches.remove({id});
    },
});
