
\c nc_news_test;

-- select * from users;

-- select * from comments;

-- select * from articles;

-- select * from
-- comments OUTER LEFT JOIN ;

-- select article_id from articles;


-- SELECT articles.article_id ,
--        articles.author ,
--        articles.title ,
--        articles.body ,
--        articles.topic ,
--        articles.created_at ,
--        articles.votes ,
--        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
-- FROM comments JOIN articles
-- ON comments.article_id = articles.article_id
-- WHERE articles.article_id = 1
-- GROUP BY articles.article_id;


-- SELECT articles.article_id ,
--        articles.author ,
--        articles.title ,
--        articles.body ,
--        articles.topic ,
--        articles.created_at ,
--        articles.votes ,
--        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
-- FROM comments LEFT OUTER JOIN articles
-- ON comments.article_id = articles.article_id
-- --WHERE articles.article_id = 1
-- GROUP BY articles.article_id;

-- select author from articles;

-- select article_id from comments;


-- select article_id , votes from articles where article_id = 1;

-- UPDATE articles
-- SET votes = votes + 1
-- WHERE article_id = 1;

-- SELECT articles.article_id  ,
--        articles.author ,
--        articles.title ,
--        articles.body ,
--        articles.topic ,
--        articles.created_at ,
--        articles.votes --,
-- FROM comments RIGHT JOIN articles
-- ON comments.article_id = articles.article_id ;


-- SELECT articles.article_id  ,
--        articles.author ,
--        articles.title ,
--        articles.topic ,
--        articles.created_at ,
--        articles.votes --,
-- FROM comments RIGHT JOIN articles
-- ON comments.article_id = articles.article_id ;


-- SELECT articles.article_id  ,
--        articles.author ,
--        articles.title ,
--        articles.topic ,
--        articles.created_at ,
--        articles.votes ,
--        CAST(COUNT(comments.article_id) AS INT) AS comment_count 
-- FROM comments RIGHT JOIN articles
-- ON comments.article_id = articles.article_id
-- GROUP BY articles.article_id;


-- author which is the username from the users table
-- title
-- article_id
-- topic
-- created_at
-- votes
-- comment_count which is the total count of all the comments with this article_id - you should

select article_id , author , title , topic , created_at , votes from articles;
---select * from users;
select * from comments;
--- 18 comments
select article_id from comments;

 SELECT articles.article_id  ,
       articles.author ,
       articles.title ,
       articles.topic ,
       articles.created_at ,
       articles.votes ,
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
FROM comments RIGHT JOIN articles
ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.article_id ASC;


SELECT articles.article_id  ,
       articles.author ,
       articles.title ,
       articles.topic ,
       articles.created_at ,
       articles.votes ,
       CAST(COUNT(comments.article_id) AS INT) AS comment_count 
FROM comments RIGHT JOIN articles
ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;



-- select * from comments;

-- \echo 'id = 1'
-- select * from comments where article_id = 1 ;

-- \echo 'id = 2'
-- select * from comments where article_id = 2 ;

-- \echo 'id = 3'
-- select * from comments where article_id = 3 ;

-- \echo 'id = 4'
-- select * from comments where article_id = 4 ;

-- \echo 'id = 5'
-- select * from comments where article_id = 5 ;

-- \echo 'id = 6'
-- select * from comments where article_id = 6 ;

-- \echo 'id = 7'
-- select * from comments where article_id = 7 ;

-- \echo 'id = 8'
-- select * from comments where article_id = 8 ;

-- \echo 'id = 9'
-- select * from comments where article_id = 9 ;

-- \echo 'id = 10'
-- select * from comments where article_id = 10 ;

-- \echo 'id = 11'
-- select * from comments where article_id = 11 ;

-- \echo 'id = 12'
-- select * from comments where article_id = 12 ;

-- id , count
-- 1 , 11
-- 3 , 2
-- 5 , 2
-- 6 , 1
-- 9 , 2
--- hand verified





