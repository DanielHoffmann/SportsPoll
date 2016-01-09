Matches = new Mongo.Collection("matches");

if (Meteor.isClient) {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
    Meteor.startup(function () {
        let poll = <Poll />
        ReactDOM.render(poll, document.getElementById('root'));
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
                            tieVotes: [],
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

                
            }
        );
    }

    fetchData();
    Meteor.publish("Matches", function () {
        return Matches.find({});
    });
}

let vote = function(_id, propertyName) {
    let userId = Meteor.userId()
    if (userId == null)
        throw new Error('User not logged');
    let pull = {
        homeVotes: userId,
        awayVotes: userId,
        tieVotes: userId,
    };
    delete pull[propertyName];
    let addToSet = {
        [propertyName]: userId,
    };
    Matches.update({ _id: _id}, {
        $pull: pull, //removes the userID from all vote arrays
        $addToSet: addToSet, //adds the userID into the propertyName array if it is not already there
    });
};

Meteor.methods({
    voteHome(_id) {
        vote(_id, "homeVotes");
    },

    voteAway(_id) {
        vote(_id, "awayVotes");
    },

    voteTie(_id) {
        vote(_id, "tieVotes");
    },
});
