
if (typeof MochaWeb !== 'undefined') {
    MochaWeb.testOnly(function() {
        "use strict";
        var testUser= "testuser";
        var testPassword= "testuser";
        var assert= chai.assert;

        var _idDummy = null;

        describe("Methods tests with user logged-in", function() {
            before(function(done) {
                //creating test user if it is not already there
                //and inserting a dummy record

                //unfortunately Meteor does not use promises, so we needed
                //to chain callbacks here
                Accounts.createUser({
                    username: testUser,
                    password: testPassword,
                }, function(err) {
                    Meteor.loginWithPassword(testUser, testPassword, function() {
                        done();
                    });
                });
            });

            beforeEach(function(done) {
                Meteor.call("removeById", 1); //if no callback is used this call is blocking
                Meteor.call("insertMatch", {
                    awayName: "Away",
                    createdAt: "2015-12-18T12:30:39.228Z",
                    group: "Group",
                    homeName: "Home",
                    id: 1,
                    name: "Name",
                    objectId: "1",
                    sport: "FOOTBALL",
                    start: "2015-12-17T13:00Z",
                    state: "STARTED",
                    updatedAt: "2015-12-18T12:30:39.228Z",
                    homeVotes: [],
                    awayVotes: [],
                    drawVotes: [],
                }, function(err, _id) {
                    _idDummy = _id;
                    done();
                });
            });

            after(function(done) {
                //removing dummy record
                Meteor.call("removeById", 1);
                done();
            });

            it("Testing voteHome method", function(done) {
                Meteor.call("voteHome", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 1);
                assert.equal(match.drawVotes.length, 0);
                assert.equal(match.awayVotes.length, 0);
                done();
            });

            it("Testing voteDraw method", function(done) {
                Meteor.call("voteDraw", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 0);
                assert.equal(match.drawVotes.length, 1);
                assert.equal(match.awayVotes.length, 0);
                done();
            });

            it("Testing voteAway method", function(done) {
                Meteor.call("voteAway", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 0);
                assert.equal(match.drawVotes.length, 0);
                assert.equal(match.awayVotes.length, 1);
                done();
            });

            it("Testing multiple successive votes", function(done) {
                Meteor.call("voteAway", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 0);
                assert.equal(match.drawVotes.length, 0);
                assert.equal(match.awayVotes.length, 1);

                Meteor.call("voteDraw", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 0);
                assert.equal(match.drawVotes.length, 1);
                assert.equal(match.awayVotes.length, 0);

                Meteor.call("voteHome", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 1);
                assert.equal(match.drawVotes.length, 0);
                assert.equal(match.awayVotes.length, 0);

                Meteor.call("voteDraw", _idDummy);
                var match = Matches.findOne({_id : _idDummy});
                assert.equal(match.homeVotes.length, 0);
                assert.equal(match.drawVotes.length, 1);
                assert.equal(match.awayVotes.length, 0);
                done();
            });
        });
    });
}
