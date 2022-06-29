/** Empty objet to be used as endpoint */
projectData = {};

/** Express to run server routes */
const express = require('express');

/** Start up an instance of app */
const app = express();

/** Dependencies */
const bodyParser = require('body-parser');

/** Middleware */
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

/** initialize the main folder */
app.use(express.static('website'));

/** Run server */
const port = 8000;
const server = app.listen(port, listening);

function listening(){
    console.log(`Server running: ${port}`);
}

/** Routes */
/** variable to hold the data received through the post request */
const weatherData = [];

/** Post route to store the data typed as historic */
app.post('/weatherData', addWeatherData);

function addWeatherData(req, res){
    //console.log(req.body);
    newEntry = {
        date: req.body.date,
        temp: req.body.temp,
        content: req.body.content,
    }

    weatherData.push(newEntry);
    res.send(weatherData);
    console.log(weatherData);
}

/** Get route to recover the data saved as historic */
app.get('/allData', getData);

function getData(req, res){
    res.send(weatherData);
    console.log('weatherData');
    console.log(weatherData);
}

/** GET route to recover the current data on the endpoint projectData */
app.get('/all', sendData);

function sendData (request, response) {
    console.log('get projectData');
    console.log(projectData);
    response.send(projectData);
};

/** POST route to store the current data on the endpoint projectData */
app.post('/add', function(request, response) {
    let data = request.body;
    projectData["content"] = data.content;
    projectData["temp"] = data.temp;
    projectData["date"] = data.date;
    
    console.log('projectData');
    console.log(data);
})
