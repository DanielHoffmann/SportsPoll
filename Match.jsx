// Task component - represents a single todo item

//shows a single scoreboard with the team name on top of it
let Score = React.createClass({
    render() {
        let props = this.props;
        let cssClasses = "btn-floating secondary-content";
        if (props.userLogged)
            cssClasses += " hoverable waves-effect waves-circle waves-light";

        if (props.active)
            cssClasses += " yellow darken-2";
        else
            cssClasses += " orange darken-5";

        return (
            <div style={{
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
                onClick={props.userLogged ? props.onClick : null}>

                <div style={{
                    height: 50,
                    alignItems: "center"
                }}>
                    <span>{props.name}</span>
                </div>
                <a
                    href="#!"
                    className={cssClasses}
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        cursor: props.userLogged ? "pointer" : "default",
                    }}
                    >
                        {props.votes}
                </a>
            </div>
        )
    }
})


Match = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            userId: Meteor.userId(),
        }
    },

    voteHome() {
        Meteor.call("voteHome", this.props.match._id);
    },

    voteDraw() {
        Meteor.call("voteDraw", this.props.match._id);
    },

    voteAway() {
        Meteor.call("voteAway", this.props.match._id);
    },

    render() {
        let match = this.props.match;
        let homeActive = false;
        let awayActive = false;
        let drawActive = false;
        let userId = Meteor.userId();
        let userLogged = userId != null;

        if (match.awayVotes.indexOf(userId) !== -1)
            awayActive = true;
        else if (match.homeVotes.indexOf(userId) !== -1)
            homeActive = true;
        else if (match.drawVotes.indexOf(userId) !== -1)
            drawActive = true;

        return (
            <div className={sportsMapper.colors[match.sport] + " card"} style={{height: 300}}>
                <div className="card-content white-text">
                    <div style={{alignItems: "center"}}>
                        <i className={sportsMapper.icons[match.sport]} style={{fontSize: 40}}></i>
                        <span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>&nbsp;&nbsp;&nbsp;{match.name}</span>
                    </div>
                    <div className="white-text" style={{height: 40,alignItems: "center", flex: 1}} >
                        { match.state === "STARTED" ? <i style={{fontSize: 40, lineHeight: 40}} className="flaticon-worldgrid18"></i> : null}
                        &nbsp;
                        {match.group}
                    </div>
                    <div style={{width: "100%", alignItems: "flex-end", flex: 1}}>
                        <Score name={match.homeName} votes={match.homeVotes.length} onClick={this.voteHome} active={homeActive} userLogged={userLogged}/>
                        <Score name="Draw" votes={match.drawVotes.length} onClick={this.voteDraw} active={drawActive} userLogged={userLogged} />
                        <Score name={match.awayName} votes={match.awayVotes.length} onClick={this.voteAway} active={awayActive} userLogged={userLogged} />
                    </div>
                </div>
            </div>
        );
    }
});
