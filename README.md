# News API

## Background

This is an news API using Postgres as the database backend

## Hosted version

You can see the hosted version at [link](https://mr-kipling-nc-news-backend.herokuapp.com/api){:target="_blank"}


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

