# SportsPoll

A small exercise in building a website that collects users votes on sports matches. Available at:

``

Feel free to create users (no email verification required).

## Exercise Description

Project Sports Poll

Create a backend and web client for sports polls. The backend should be created using either Node.js or PHP, you may choose frameworks for either of these on your own.

The polls should be created based off of data from a development API, you can get the information using Postman and this collection:
https://www.getpostman.com/collections/108b34f90e2d1940b517

(Note the headers needed to access the API)

The polling options should be what team will win or if it will be a draw, eg.
 - Team A
 - Draw
 - Team B

For the web client you are free to use any modern javascript framework that you’d like, if any.

## Implementation

### Technologies used

 - Meteor

 Javascript framework that allows Javascript code to run both on the client and on the server. Runs on top of a NodeJS server.

 - ReactJS

 Front end View layer with built in custom language called JSX which creates . This language is transpiled to standard ES5 Javascript.

 - MongoDB

 A noSQL database, used to cache the matches into the server and store users votes.

 - Materialize

 CSS responsive stylesheets based on Material Design design principles.

 - Mocha / Chai

 Javascript Test Driven Development framework.


### Running

Simply clone the repository and install meteor using:

`curl https://install.meteor.com/ | sh`

Then inside the project folder run

`meteor`

Open the following URL in a browser:

`http://localhost:3000/`


### Details

#### Startup

At application startup on the server we fetch any new matches from the REST API and insert it to the MongoDB server if that match is not already there and if it is, then its fields are updated. Every 30 seconds the server calls the REST API again to update the matches.

#### Front End

On the client we start the ReactJS component called Polls. This component renders all the UI of the application. It is considered best practice to use styles inlined into the Javascript code as opposed to a external CSS stylesheet when writing ReactJS Components, I followed that principle with a few exceptions, mostly to use @media queries.

Besides that I used the Materialize stylesheets for some cool effects and styling. However I did not use Materialize grid layout, instead I used `flex-box` for all the positioning, `flex-box` is great but it is fairly new and not supported in older versions of IE.

I used icons from a web-font I generated using http://www.flaticon.com/ It is similar to font-awesome, but you can create your own font-packs.

#### Voting

To vote in one of the matches the user must be authenticated, users can create accounts freely and no email verification is required. When the user votes in one match its `userId` is stored in that match to keep track who voted. 3 arrays are used to store these votes, one for each team and one for tie votes.

One important implementation detail is that MongoDB is does not have Transactions, each MongoDB operation call is atomic in itself, but multiple operations are not, so when a user votes in a match its `userId` is removed from the two arrays that he did not vote for and added to the third array. This all is done in a single operation using the `$pull` and `$addToSet` operations, making sure that voting is an atomic action and thus preventing concurrency issues. The `$addToSet` operation is used because it treats the array like a set (preventing from adding the same value twice).

#### Testing

A few test cases were created, using the Mocha testing library. They are present in the `/tests/mocha/client/` folder. They are by no means complete, just to show off how to test this kind of project. When running in development mode the tests results are shown in the application itself.


### Final Considerations

This project took around 8 hours to complete, a lot of time was spent on getting the styling right with Materialize as I was not familiar with that framework as opposed to the others. Besides what was requested I also added a few extra features like periodically updating the matches data and filters by sports in the UI.

I considered using React Native to build a native app for mobile, as I am experienced with that framework as well. But I thought the main purpose of the exercise to be making a web mobile-friendly version as opposed to native.
