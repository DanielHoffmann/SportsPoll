
// component for the login UI
let AccountsUIWrapper = React.createClass({
    componentDidMount() {
        // Use Meteor Blaze instead of React to render login buttons
        this.view = Blaze.render(Template.loginButtons,
            ReactDOM.findDOMNode(this.refs.container));
    },
    componentWillUnmount() {
        // Clean up Blaze view
        Blaze.remove(this.view);
    },
    render() {
        // Just render a placeholder container that will be filled in
        return <span className="accounts-ui-wrapper" ref="container" />;
    }
});



Polls = React.createClass({
    mixins: [ReactMeteorData],


    getInitialState() {
        let sportsEnabled = {};
        for (let key of Object.keys(sportsMapper.icons)) {
            sportsEnabled[key] = true;
        }
        return sportsEnabled;
    },

    getMeteorData() {
        Meteor.subscribe("Matches");
        return {
            matches: Matches.find({}).fetch(),
        }
    },

    renderMatches() {
        return this.data.matches.map((match, index) => {
            if (this.state[match.sport]) //renders only the sports that are enabled
                return <Match key={match._id} match={match} index={index} />;
            else
                return null;
        });
    },

    disableSport(sport) {
        this.setState({
            [sport]: !this.state[sport],
        });
    },

    drawFilters() {
        let btns = [];
        for (let key of Object.keys(sportsMapper.icons)) {
            let cssClasses = sportsMapper.colors[key] + " btn-floating hoverable ";
            if (this.state[key] === false)
                cssClasses += " disabled";

            btns.push(
                <li key={key}>
                    <a className={cssClasses}
                        onClick={this.disableSport.bind(this, key)}>

                        <i className={sportsMapper.icons[key]}></i>
                    </a>
                </li>
            )
        }
        return btns;
    },

    render() {
        return (
            <div>
                <nav className="top-nav #558b2f light-green darken-3" style={{ height: 65 }}>
                    <div className="container">
                        <div className="nav-wrapper">
                            <a className="card-title">Sports Poll</a>
                        </div>
                    </div>
                </nav>

                <AccountsUIWrapper />
                <div className="fixed-action-btn click-to-toggle" style={{
                    position: "absolute",
                    top: 3,
                    right: 20,
                    paddingTop: 0,
                }}>
                    <a className="btn-floating btn-large red">
                        <i className="large mdi-navigation-menu"></i>
                    </a>
                    <ul style={{
                        position: "relative",
                        top: 10,
                    }}>
                        {this.drawFilters()}
                    </ul>
                </div>

                <div className="matches" style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    {this.renderMatches()}
                </div>

                <footer className="page-footer teal">
                    <div className="footer-copyright">
                        <div className="container" style={{ fontSize: 25, fontWeight: "bold"}}>
                            Made by Daniel Hoffmann Bernardes
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
});
