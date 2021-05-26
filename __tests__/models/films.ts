process.env.NODE_ENV = "test";
import connectDb from '../../config/db' 
import FilmsModel from "../../models/Film";

beforeAll(() => {
  connectDb()
});

beforeEach(async () => {
  // add a film
  const data = {
    title: 'Modern family',
    type: 'TV'
  }
  await FilmsModel.create(data)
  jest.setTimeout(15000);
});

afterEach(async () => {
  // remove all the films
  await FilmsModel.deleteMany({});
});

describe("asd", () => {

  it("e", () => {
    return FilmsModel.find({}).then(films => {
      console.log(films)
      expect(films).toHaveLength(1)
      expect(films[0]).toHaveProperty('title')
    });
  })

  it("a", () => {
    return FilmsModel.find({}).then(films => {
      console.log(films)
      expect(films).toHaveLength(1)
      expect(films[0]).toHaveProperty('title')
    });
  })
})

describe("Films model", () => {
  describe("Methods", () => {
    describe("getAndSetLink", () => {
      it("Calling with param page: 'Rotten Tomatoes', the document should have a rotten tomatoes link", () => {
        // Arrange
        /*
        let film = (await FilmsModel.find({}))[0]
        // film = film[0]
        const page = "Rotten Tomatoes"
        
        // Act
        // Call the method
        await film.getAndSetLink(page)

        // Assert
        expect(film.links.rottenTomatoes).toMatch(/tv/)
        */

        return FilmsModel.find({}).then(films => {
          const film = films[0]
          film.getAndSetLink("Rotten Tomatoes").then(() => {
            expect(film.links.rottenTomatoes).toMatch(/tv/)
          })
        })
      });

      it("Calling with param page: 'hola', the document should have an empty rotten tomatoes link", () => {
        // Arrange
        /*
        const films = await FilmsModel.find({})
        const film = films[0]
        const page = "hola"

        // Act
        // Call the method
        film.getAndSetLink(page)
        // Assert
        expect(film.links.rottenTomatoes).toBe('#')
        */
        
        return FilmsModel.find({}).then(films => {
          const film = films[0]
          film.getAndSetLink("hola").then(() => {
            expect(film.links.rottenTomatoes).toBe('#')
          })
        })
        
      });
    })
    describe("getAndSetCover", () => {
      it("Calling with a known serie, the document should have a string with '.jpg' in images.cover", () => {
        // Arrange
        /*
        let film = (await FilmsModel.find({}))[0]
        // Act
        await film.getAndSetCover()
        // const filmUpdated = (await FilmsModel.find({}))[0]
        
        // Assert
        expect(film.images.cover).toMatch(/.jpg/)
        */
        return FilmsModel.find({}).then(films => {
          const film = films[0]
          film.getAndSetCover().then(() => {
            expect(film.images.cover).toMatch(/.jpg/)
          })
        })
      })

      it("Calling with a known movie, the document should have a string with '.jpg' in images.cover", () => {
        // Arrange
        
        const filmData = {title: 'La la land', type: 'Movie'}
        /*
        await FilmsModel.create(filmData)
        // Act
        const film = await FilmsModel.findOne(filmData)
        await film.getAndSetCover()
        // Assert
        expect(film.images.cover).toMatch(/.jpg/)
        */
        return FilmsModel.create(filmData).then(film => {
          film.getAndSetCover().then(() => {
            expect(film.images.cover).toMatch(/.jpg/)
          })
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
