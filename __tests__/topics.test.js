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
          });        
      });
  });

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

