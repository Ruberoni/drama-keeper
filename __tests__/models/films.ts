import mongoose from "mongoose";
import connectDb from '../../config/db'
import FilmsModel from "../../models/Film";

beforeAll(async () => {
  await connectDb()
});

afterAll(async () => {
  await mongoose.disconnect()
});

beforeEach(async () => {
  // add a film
  const data = {
    title: 'Modern family',
    type: 'TV'
  }
  await FilmsModel.create(data)
});

afterEach(async () => {
  // remove all the films
  await FilmsModel.deleteMany({});
});

describe("Films model", () => {
  // These hit live third-party sites (Rotten Tomatoes, TMDb); run with RUN_NETWORK_TESTS=1
  const describeNetwork = process.env.RUN_NETWORK_TESTS ? describe : describe.skip
  describeNetwork("Methods", () => {
    describe("getAndSetLink", () => {
      it("Calling with param page: 'Rotten Tomatoes', the document should have a rotten tomatoes link", () => {

        return FilmsModel.find({}).then(films => {
          const film = films[0]
          // Act
          return film.getAndSetLink("Rotten Tomatoes").then(() => {
            // Assert
            expect(film.links.rottenTomatoes).toMatch(/tv/)
          })
        })
      });

      it("Calling with param page: 'hola', the document should have an empty rotten tomatoes link", () => {
        
        return FilmsModel.find({}).then(films => {
          const film = films[0]
          // Act
          return film.getAndSetLink("hola").then(() => {
            // Assert
            expect(film.links.rottenTomatoes).toBe('#')
          })
        })
        
      });
    })
    describe("getAndSetCover", () => {
      it("Calling with a known serie, the document should have a string with '.jpg' in images.cover", () => {
        return FilmsModel.find({}).then(films => {
          const film = films[0]
          // Act
          return film.getAndSetCover().then(() => {
            // Assert
            expect(film.images.cover).toMatch(/.jpg/)
          })
        })
      })

      it("Calling with a known movie, the document should have a string with '.jpg' in images.cover", () => {
        // Arrange
        const filmData = {title: 'La la land', type: 'Movie'}

        // Not create(): its post-save hook would fetch and save this same doc in parallel
        const film = new FilmsModel(filmData)

        // Act
        return film.getAndSetCover().then(() => {
          // Assert
          expect(film.images.cover).toMatch(/.jpg/)
        })
      })
    })
  })
  describe("Links", () => {

    it("Creating a film with an empty link, should resolve OK", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
        type: "Movie",
        links: {
          rottenTomatoes: ''
        }
      };
      // Act & Assert
      return expect(FilmsModel.create(movieData)).resolves.toBeTruthy()
    });
    it("Creating a film with a valid link, should resolve OK", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
        type: "Movie",
        links: {
          rottenTomatoes: 'https://www.rottentomatoes.com/m/la_la_land'
        }
      };
      // Act & Assert
      return expect(FilmsModel.create(movieData)).resolves.toBeTruthy()
    });

    it("Creating a film with an invalid link, should throw an error", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
        type: "Movie",
        links: {
          rottenTomatoes: 'E'
        }
      };
      // Act & Assert
      return expect(FilmsModel.create(movieData)).rejects.toThrow("E is not an URL")
    });
  });

  
  describe('Type', () => {
    it("Creating a film with empty type, should be OK", async () => {
      // Arrange
      const filmData = {
        title: "Title",
        type: ""
      }

      // Act & Assert
      return expect(FilmsModel.create(filmData)).resolves.toBeTruthy();
    })

    it("Creating a film with a 'TV' type, should be OK", async () => {
      // Arrange
      const filmData = {
        title: "Title",
        type: "TV"
      }

      // Act & Assert
      return expect(FilmsModel.create(filmData)).resolves.toBeTruthy();
    })

    it("Creating a film with a 'Movie' type, should be OK", async () => {
      // Arrange
      const filmData = {
        title: "Title",
        type: "Movie"
      }

      // Act & Assert
      return expect(FilmsModel.create(filmData)).resolves.toBeTruthy();

    })

    it("Creating a film with an invalid type, should throw an error", async () => {
      // Arrange
      const filmData = {
        title: "Title",
        type: "A"
      }

      // Act & Assert
      return expect(FilmsModel.create(filmData)).rejects.toThrow();

    })
  })
});
