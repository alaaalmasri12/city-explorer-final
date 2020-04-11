'use strict'
require('dotenv').config();
const superagent = require('superagent');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const app = express();

function locationhandler(req, res) {
  // const geoorphicalData = require('./data/geo.json');
// const city = req.query.city;
// const locationData = new Location(city, geoorphicalData);
// res.send(locationData);
const city = req.query.city;
getlocation(city)
   .then(locationData => res.status(200).json(locationData));
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

}


  module.exports=locationhandler
