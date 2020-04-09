'use strict';
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.get('/location',locationhandler) 

function locationhandler(req, res) {
       // const geoorphicalData = require('./data/geo.json');
    // const city = req.query.city;
    // const locationData = new Location(city, geoorphicalData);
    // res.send(locationData);
    const city = req.query.city;
     getlocation(city)
        .then(locationData => res.status(200).json(locationData));
}
 
app.get('/weather', weatherhandler)
function weatherhandler(req, res) {
    const city = req.query.search_query;
    //     var weatherarr=[];
    //    const WeatherData=require('./data/weather.json');
    //         WeatherData.data.map((val)=>{
    //             let weather = new Weather(city,val);
    //              weatherarr.push(weather);
    //     })
    // res.send(weatherarr);
    console.log(city);
     getwather(city)
        .then(weatherData => res.status(200).json(weatherData));
}


app.get('/trails',hikeshandler) 
function hikeshandler(req,res)
{
    const city=req.query.search_query;
  getlocation(city)
.then((data)=>{
    return gethikes(data)
    .then(hikesData => res.status(200).send(hikesData));
})

}


function gethikes(citycoirdantes)
{
    let key=process.env.TRAIL_API_KEY;
    const Url = `https://www.hikingproject.com/data/get-trails?lat=${citycoirdantes.latitude}&lon=${citycoirdantes.longitude}&maxDistance=10&key=${key}`;
 
    return superagent.get(Url)
    .then(hikeData => {
       return hikeData.body.trails.map(val => {
          var hikeData = new Hikes(val);
          return hikeData;
        });
        
        });
}
function getwather(city) {

    let key = process.env.weatherAPI;
    const watherinfo=[];    
    const Url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
    console.log('asdasdasdsa',Url);
    return superagent.get(Url)
    .then(weatherData => {
        weatherData.body.data.map(val => {
          var weatherData = new Weather(val);
          watherinfo.push(weatherData);
          console.log(weatherData,city);
        });
        return watherinfo;

        });
}
var lat;
var lon;
function getlocation(city) {
    let SQL='SELECT * FROM location WHERE  search_query=$1;';
    let safevalues=[city];
    return client.query(SQL,safevalues)
    .then(results=>{
        if(results.rows.length)
        {
            return results.rows[0];
        }
        else
        {
            console.log(city);
    let key = process.env.GEOCODE_API_KEY;
    const Url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    return superagent.get(Url)
    .then(geodata => {
        let SQL='INSERT INTO location(search_query,formatted_query,latitude,longitude)VALUES($1,$2,$3,$4);';
          var locationData = new Location(city,geodata.body);
          lat=locationData.latitude;
          lon=locationData.longitude;
          let safevalues=[city,locationData.formatted_query,lat,lon];
         return client.query(SQL,safevalues)
          .then(results=>{
             return results.rows[0];

          })
        //   return locationData;

        })
 
        }
        // res.status(200).json(result.rows);
    })

    .catch(error=>errorHandler(error));   
}
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