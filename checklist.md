

SELECT articles.article_id ,
                   articles.author ,
                   articles.title ,
                   articles.body ,
                   articles.topic ,
                   articles.created_at ,
                   articles.votes ,
                   CAST(COUNT(comments.article_id) AS INT) AS comment_count
            FROM comments LEFT JOIN articles
            ON comments.article_id = articles.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;
            
            
