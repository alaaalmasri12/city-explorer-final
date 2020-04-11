'use strict'
const superagent = require('superagent');
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

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
  
module.exports=weatherhandler;