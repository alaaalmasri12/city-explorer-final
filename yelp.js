'use strict'
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

function yelphandler(request,response)
{
  const city=request.query.search_query;
  getlocation(city)
  .then((data)=>{
    return getyelp(data)
    .then(yelpData =>response.status(200).send(yelpData));
})
}

function getyelp(resturant)
{
  let key=process.env.YELP_API_KEY;
let resturantarr=[];

  let url = `https://api.yelp.com/v3/businesses/search?term=delis&latitude=${resturant.latitude}&longitude=${resturant.longitude}&limit=20`;
  return superagent.get(url)
  .set('Authorization', `Bearer ${key}`)
  .then( res => {
    return res.body.businesses.map( (val) => {
      // console.log(resturantarr);
      return new Restaurant(val);


    });
  })
}

module.exports=yelphandler