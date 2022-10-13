
const request = require("supertest");
const app = require("../app");
const pool = require("../db/connection");
const seed = require("../db/seeds/seed");

const testData = require("../db/data/test-data");

afterAll(() => {
  if (pool.end) pool.end();
});

beforeAll(() => {
  return seed(testData);
});

describe("Topics api testing", () => {
  test("Not a route /notARoute", () => {
    return request(app).get("/notARoute").expect(404);
  });

  test("GET the status of /api/topics", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("GET the response and status of /api/topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("get exact response from /api/topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);

        expect(topics[0].slug).toBe("mitch");
        expect(topics[1].slug).toBe("cats");
        expect(topics[2].slug).toBe("paper");

        expect(topics[0].description).toBe("The man, the Mitch, the legend");
        expect(topics[1].description).toBe("Not dogs");
        expect(topics[2].description).toBe("what books are made of");
      });
  });
});

describe("Articles api testing", () => {
  test("GET the status of /api/articles/1", () => {
    return request(app).get("/api/articles/1").expect(200);
  });

  test("GET the response and status of /api/articles/:article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
          expect(article).toMatchObject({
            article_id: 1, 
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: 11,
          });        
      });
  });

    // test all article_id's from 1 through 12 using loop
    for (let article_id = 1 ; article_id < 13 ; article_id ++ ) {
        test(`GET the response and status of /api/articles/:article_id with article_id = ${article_id}`, () => {
            return request(app)
                .get(`/api/articles/${article_id}`)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toMatchObject({
                        article_id: article_id,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    });
                });
        });
    }

  test("Get article_id is a number but not in database", () => {
    return request(app)
      .get("/api/articles/13")
          .expect(404)
          .then(({ body }) => {
              const { msg } = body;
              expect(msg).toBe('Article not found for article_id given');
          });
  });

  test("Get invalid article_id - should be a number", () => {
    return request(app)
      .get("/api/articles/dog")
          .expect(400)
          .then(({ body }) => {
              const { msg } = body;
              expect(msg.startsWith('error: invalid input syntax for type integer')).toBe(true);
          }); 
  });  
   
});



describe("Users api testing", () => {
  test("GET the status of /api/users", () => {
    return request(app).get("/api/users").expect(200);
  });

  test("GET the response and status of /api/users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
          
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });

  test("check first user information in test database", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;

          expect(users[0].username).toBe('butter_bridge');
          expect(users[0].name).toBe('jonny');
          expect(users[0].avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
      });
  });   
});



describe('Testing PATCH /api/articles/:article_id', () => {
    test('status:201, responds with the updated article', () => {
        const articleUpdate = {
            inc_votes: 100
        };
        let original_votes;

        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article.article_id).toBe(1);
                original_votes = article.votes;
            }).then(() => {
                
                return request(app)
                    .patch('/api/articles/1')
                    .send(articleUpdate)
                    .expect(201)
                    .then(({ body }) => {
                        const { article } = body;
                
                        const incremented_votes = original_votes + articleUpdate.inc_votes;
                        expect(article.article_id).toBe(1);
                        expect(article.votes).toBe(incremented_votes);
                        
                    });
            });
    });

    test('status:400, bad request on invalid article_id', () => {
        const articleUpdate = {
            inc_votes: 100
        };
        return request(app)
            .patch('/api/articles/dog')
            .send(articleUpdate)
            .expect(400);
    });

    test('status:400, bad article update object inc_votes not a number', () => {
        const articleUpdate = {
            inc_votes: "dog"
        };
        return request(app)
            .patch('/api/articles/1')
            .send(articleUpdate)
            .expect(400);
    });

    test('status:400, bad article update object inc_votes mis-spelled', () => {
        const articleUpdate = {
            inc_voters: 250
        };
        return request(app)
            .patch('/api/articles/1')
            .send(articleUpdate)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("patch request requires 'inc_votes' json to be defined");
            });;
    });
    
});



describe("Articles api testing /api/articles ", () => {
    
    test("GET the status of /api/articles", () => {
        return request(app).get("/api/articles").expect(200);
    });

    test("GET the response and status of /api/articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;

                expect(articles).toBeSortedBy('created_at', { descending: true });

                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });

    test("check first article returned", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;

                expect(articles[0].title).toBe('Eight pug gifs that remind me of mitch');
                expect(articles[0].author).toBe('icellusedkars');
                expect(articles[0].topic).toBe('mitch');
                expect(articles[0].votes).toBe(0);
                expect(articles[0].comment_count).toBe(2);

            });
    });

    test("topic of cooking - articles should only involve cooking", () => {
        return request(app)
            .get("/api/articles?topic=cooking")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: 'cooking',
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number),
                    });
                });
            });
    });
});



describe("Comments testing /api/articles/:article_id/comments ", () => {
    
    test("GET the status of article_id 1 /api/articles/1/comments", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
    });

    for (let article_id = 1 ; article_id < 13 ; article_id ++ ) {
        test(`GET the response and status of /api/articles/${article_id}/comments`, () => {
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;

                expect(comments).toBeSortedBy('created_at', { descending: true });

                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String)
                    });
                });
            });
    });
    }

    test("check first comment returned", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;

                expect(comments[0].comment_id).toBe(5);
                expect(comments[0].votes).toBe(0);
                expect(comments[0].author).toBe('icellusedkars');
                expect(comments[0].body).toBe('I hate streaming noses');
                
            });
    });

    test("get comments using invalid article_id - should be a number", () => {
        return request(app)
            .get("/api/articles/dog/comments")
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe("'article_id' in /api/articles/:article_id/comments is expected to be a number");
            });
    });  

    test("get comments using article_id not in database", () => {
        const article_id = 15;
        return request(app)
            .get(`/api/articles/${article_id}/comments`)
            .expect(400)
            .then(({ body }) => {
                const { msg } = body;
                expect(msg).toBe(`There is no article with 'article_id' of ${article_id} in /api/articles/:article_id/comments`);
            });
    });  
    
    

});

describe('POST /api/articles/:article_id/comments', () => {
    test('status:201, responds with new comment added to database', () => {

        const msg = `we are ${Date.now()} seconds since dawn of time`;
        const username = 'butter_bridge';

        const newComment = {
            username: username,
            body: msg,
        };
        const article_id = 2;

        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toMatchObject({
                    body: msg,
                    author: username,
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                });
            });
    });

    xtest('POST article_id does not exist', () => {

        const newComment = {
            username: "butter_bridge",
            body: "a comment long long ago",
        };
        const article_id = 15;

        return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then(({ msg }) => {
                console.log("msg = " , msg);
                
                // const { comment } = body;
                // expect(comment).toMatchObject({
                //     body: msg,
                //     author: username,
                //     comment_id: expect.any(Number),
                //     votes: expect.any(Number),
                //     created_at: expect.any(String),
                // });
            });
    });
    

    
});

