
check that result is sorted by date order?



Responds with:

an articles array of article objects, each of which should have the following properties:

author which is the username from the users table
title
article_id
topic
created_at
votes
comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
the articles should be sorted by date in descending order.

Queries
The end point should also accept the following query:
- topic, which filters the articles by the topic value specified in the query. If the query is omitted the endpoint should respond with all articles.

