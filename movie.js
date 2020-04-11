'use strict'
require('dotenv').config();
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg=require("pg");
const client=new  pg.Client(process.env.DATABASE_URL2);

const PORT = process.env.PORT || 3000;
const app = express();

function moviesHandler(request, response) {
    let movie = request.query.search_query;
    getMovies(movie)
      .then(moviesData => {
        response.status(200).json(moviesData);
      });
  }
  
  function getMovies(movie) {
    let moviearray=[];
    let key = process.env.MOVIE_API_KEY;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${movie}`;
    return superagent.get(url)
      .then((moviesData) => {
        moviesData.body.results.map((movies) => {
         let movieobject= new Movie(movies);
         moviearray.push(movieobject);
        });
        return moviearray;
      })
    // .catch(err => errorHandler(err, request, response));
  };

  module.exports=moviesHandler;
  