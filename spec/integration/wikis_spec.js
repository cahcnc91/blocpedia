const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;


describe("routes : wikis", () => {

    beforeEach((done) => {
        this.wiki;
        this.user
    
        sequelize.sync({force: true}).then((res) => {

          User.create({
            email: "starman@tesla.com",
            password: "Trekkie4lyfe",
            role: 0
          })
          .then((user) => {
            this.user = user;
    
            Wiki.create({
                title: "First Wiki Test",
                body: "A compilation of reports from recent visits to the star system.",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                done();
            });
          })
  
        });
    });

    describe("member user performing CRUD actions for Topic", () => {

      // #4: Send mock request and authenticate as a member user
          beforeEach((done) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                role: "0"
              }
            },
              (err, res, body) => {
                done();
              }
            );
          });

          describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
       
              request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("First Wiki Test");
                done();
              });
            });
        });
      
        describe("GET /wikis/:wikiId/new", () => {
      
            it("should render a new wiki form", (done) => {
              request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
              });
            });
        
        });
      
        describe("POST /wikis/create", () => {
            const options = {
              url: `${base}create`,
              form: {
                title: "blink-182 songs",
                body: "What's your favorite blink-182 song?",
      
              }
            };
      
            it("should create a new wiki and redirect", (done) => {
      
              request.post(options,
      
                (err, res, body) => {
                  Wiki.findOne({where: {title: "blink-182 songs"}})
                  .then((wiki) => {
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("blink-182 songs");
                    expect(wiki.body).toBe("What's your favorite blink-182 song?");
                    done();
                  })
                  .catch((err) => {
                    console.log(err);
                    done();
                  });
                }
              );
            });
          });
      
          describe("GET /wikis/:id", () => {
      
            it("should render a view with the selected wiki", (done) => {
              request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("First Wiki Test");
                done();
              });
            });
       
          });
      
          describe("POST /wikis/:id/destroy", () => {
      
            it("should delete the wiki with the associated ID", (done) => {
      
              Wiki.all()
              .then((wikis) => {
       
                const wikisCountBeforeDelete = wikis.length;
       
                expect(wikisCountBeforeDelete).toBe(1);
       
                request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                  Wiki.all()
                  .then((wikis) => {
                    expect(err).toBeNull();
                    expect(wikis.length).toBe(wikisCountBeforeDelete - 1);
                    done();
                  })
       
                });
              });
       
            });
       
          });
      
          describe("GET /wikis/:id/edit", () => {
      
            it("should render a view with an edit wiki form", (done) => {
              request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Wiki");
                expect(body).toContain("First Wiki Test");
                done();
              });
            });
       
          });
      
          describe("POST /wikis/:id/update", () => {
      
            it("should update the wiki with the given values", (done) => {
               const options = {
                  url: `${base}${this.wiki.id}/update`,
                  form: {
                    title: "JavaScript Frameworks",
                    body: "There are a lot of them"
                  }
                };
      
                request.post(options,
                  (err, res, body) => {
       
                  expect(err).toBeNull();
      
                  Wiki.findOne({
                    where: { id: this.wiki.id }
                  })
                  .then((wiki) => {
                    expect(wiki.title).toBe("JavaScript Frameworks");
                    done();
                  });
                });
            });
       
          });
      

        });
 //

    
    


      //GUEST CONTEXT
      describe("POST /wikis/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "blink-182 songs",
            body: "What's your favorite blink-182 song?",
          }
        };
  
        it("should not create a new wiki and redirect", (done) => {
  
          request.post(options,
  
            (err, res, body) => {
              Wiki.findOne({where: {title: "blink-182 songs"}})
              .then((wiki) => {
                expect(wiki).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
      });

      //ENDS GUEST
      



 

});

    


        
        
        



    
   

    
  
    
  
/*
    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
   
          request.get(base, (err, res, body) => {
            expect(res.statusCode).toBe(200);
            expect(err).toBeNull();
            expect(body).toContain("Wikis");
            expect(body).toContain("First Wiki Test");
            done();
          });
        });
    });

    describe("GET /wikis/:wikiId/new", () => {

        it("should render a new wiki form", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Wiki");
            done();
          });
        });
    
    });

    describe("POST /wikis/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "blink-182 songs",
            body: "What's your favorite blink-182 song?",

          }
        };
  
        it("should create a new wiki and redirect", (done) => {
  
          request.post(options,
  
            (err, res, body) => {
              Wiki.findOne({where: {title: "blink-182 songs"}})
              .then((wiki) => {
                expect(res.statusCode).toBe(303);
                expect(wiki.title).toBe("blink-182 songs");
                expect(wiki.body).toBe("What's your favorite blink-182 song?");
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
      });

      describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
          request.get(`${base}${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("First Wiki Test");
            done();
          });
        });
   
      });

      describe("POST /wikis/:id/destroy", () => {

        it("should delete the wiki with the associated ID", (done) => {

          Wiki.all()
          .then((wikis) => {
   
            const wikisCountBeforeDelete = wikis.length;
   
            expect(wikisCountBeforeDelete).toBe(1);
   
            request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
              Wiki.all()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).toBe(wikisCountBeforeDelete - 1);
                done();
              })
   
            });
          });
   
        });
   
      });

      describe("GET /wikis/:id/edit", () => {

        it("should render a view with an edit wiki form", (done) => {
          request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Wiki");
            expect(body).toContain("First Wiki Test");
            done();
          });
        });
   
      });

      describe("POST /wikis/:id/update", () => {

        it("should update the wiki with the given values", (done) => {
           const options = {
              url: `${base}${this.wiki.id}/update`,
              form: {
                title: "JavaScript Frameworks",
                body: "There are a lot of them"
              }
            };

            request.post(options,
              (err, res, body) => {
   
              expect(err).toBeNull();

              Wiki.findOne({
                where: { id: this.wiki.id }
              })
              .then((wiki) => {
                expect(wiki.title).toBe("JavaScript Frameworks");
                done();
              });
            });
        });
   
      });

      */