# News API

## Background

This is an news API using Postgres as the database backend

## Hosted version

The hosted version located at  [https://mr-kipling-nc-news-backend.herokuapp.com/api](https://mr-kipling-nc-news-backend.herokuapp.com/api)


## Endpoints

```js
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```


## Tests

Tests are found in the __tests__ folder. 

These tests are designed to ensure endpoints are running as they should

To run the test suite :

npm test

