'use strict'
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

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
module.exports=hikeshandler;
