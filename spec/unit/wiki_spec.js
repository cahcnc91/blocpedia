const sequelize = require("../../src/db/models/index").sequelize; 
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; 

        Wiki.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system.",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki; 
          done();
        })
      })
    });
  });



        describe("#create()", () => {

          it("should create a wiki with a title, body, private properties and user", (done) => {
  
            Wiki.create({
              title: "A Test Wiki",
              body: "Not having to answer the 'are we there yet?' question.",
              private: false,
              userId: this.user.id
            })
            .then((wiki) => {
     
              expect(wiki.title).toBe("A Test Wiki");
              expect(wiki.body).toBe("Not having to answer the 'are we there yet?' question.");
              expect(wiki.userId).toBe(this.user.id);
              done();
     
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          });

          it("should not create a wiki with missing title, body", (done) => {
            Wiki.create({
              body: "Are the inertial dampers still engaged?"
            })
            .then((wiki) => {
      
              // the code in this block will not be evaluated since the validation error
              // will skip it. Instead, we'll catch the error in the catch block below
              // and set the expectations there
      
              done();
      
            })
            .catch((err) => {
      
              expect(err.message).toContain("Wiki.title cannot be null");
              done();
      
            })
          });
     
        });

        describe("#setUser()", () => {

          it("should associate a wiki and a user together", (done) => {
     
            User.create({
              email: "ada@example.com",
              password: "password"
            })
            .then((newUser) => {
     
              expect(this.wiki.userId).toBe(this.user.id);
     
              this.wiki.setUser(newUser)
              .then((wiki) => {
     
                expect(this.wiki.userId).toBe(newUser.id);
                done();
     
              });
            })
          });
     
        });
     
        describe("#getUser()", () => {
     
          it("should return the associated wiki", (done) => {
     
            this.wiki.getUser()
            .then((associatedUser) => {
              expect(associatedUser.email).toBe("starman@tesla.com");
              done();
            });
     
          });
     
        });

        
});

    



      
