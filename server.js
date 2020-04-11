'use strict';
require('dotenv').config();
const superagent = require('superagent');
const location=require('./location.js');
const weather=require('./weather.js');
const hikes=require('./hikes.js');
const movies=require('./movie.js');
const yelp=require('./yelp.js');
const express = require('express');
const cors = require('cors');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.get('/location',location) ;
app.get('/weather', weather)
app.get('/trails',hikes) 
app.get('/movies',movies) 
app.get('/yelp',yelp)


function Location(city,LocData) {
    this.search_query = city;
    this.formatted_query = LocData[0].display_name;
    this.latitude = LocData[0].lat;
    this.longitude = LocData[0].lon;
}
function Weather(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
}

function Hikes(hike) {
    // console.log(hike);
    this.name = hike.name;
    this.location= hike.location;
    this.length=hike.length;
    this.stars=hike.stars;
    this.star_votes=hike.starVotes;
    this.summery=hike.summary;
    this.trail_url=hike.url;
    this.conditions=hike.conidation;
    this.condition_date=hike.condition_date;
    this.condition_time=hike.condition_time;

}

  

function Movie(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.average_votes;
    this.total_votes = movie.total_votes;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.released_on;
  }
function Restaurant(restaurant) {
  this.name = restaurant.name;
  this.image_url = restaurant.image_url;
  this.price = restaurant.price;
  this.rating = restaurant.rating;
  this.url = restaurant.url;
}
app.use('*', (req, res) => {
    res.status(404).send('NOT FOUND');
});

app.get('*', notFoundHandler);

app.use(errorHandler);

function notFoundHandler(request,response) { 
    response.status(404).send('huh????');
}

function errorHandler(error, request, response) {
    console.log(error);
}
client.connect()
.then(()=>{
    app.listen(PORT, () => {
        console.log(`Listening on PORT${PORT}`);
    })
});
//