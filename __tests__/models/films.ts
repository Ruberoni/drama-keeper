process.env.NODE_ENV = "test";
import connectDb from '../../config/db' 
import FilmsModel from "../../models/Film.ts";

describe("Films model", () => {
  beforeAll(() => {
    connectDb()
  });

  beforeEach(async () => {
    // add a film
    // const data = {
    //   title: 'Modern family',
    // }
    // await FilmsModel.create(data)
    jest.setTimeout(10000);
  });

  afterEach(async () => {
    // remove all the films
    await FilmsModel.deleteMany({});
  });
  describe("General", () => {
    it("Creating a film with only title, the collection should have length 1", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
      };

      // Act
      // Create the film
      await FilmsModel.create(movieData);
      // Retrieve all the films
      const films = await FilmsModel.find({});

      // Assert
      expect(films).toHaveLength(1)
      // expect(film[0]).toHaveProperty('title')
    });
    it("Creating a film with only title, the collection should have a doc with a property named 'title' with value 'La la land'", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
      };

      // Act
      // Create the film
      await FilmsModel.create(movieData);
      // Retrieve all the films
      const films = await FilmsModel.find({});

      // Assert
      expect(films[0]).toHaveProperty('title', movieData.title)
    })
  });
  describe("Links", () => {
    it("Creating a film with a known movie title, the document rotten tomatoes link should have the url to the movie", async () => {
      // Arrange
      const movieData = {
        title: "La la land",
      };

      // Act
      // Create the film
      await FilmsModel.create(movieData);
      // Retrieve the film just created
      const film = await FilmsModel.findOne(movieData);

      // Assert
      expect(film.links.rottenTomatoes).toMatch(/m/);
    });

    it('Creating a film with a known serie title, the document rotten tomatoes link should have the url to the serie', async () => {
      // Arrange
      const serieData = {
        title: 'Modern Family'
      }

      // Act
      // Create the film
      await FilmsModel.create(serieData)
      // Retrieve the film just created
      const film = await FilmsModel.findOne(serieData)

      // Assert
      expect(film.links.rottenTomatoes).toMatch(/tv/)
    });

    it('Creating a film with an invalid film title, the document should not have a rotten tomatoes link', async () => {
      // Arrange
      const serieData = {
        title: 'Modern Familysss'
      }

      // Act
      // Create the film
      await FilmsModel.create(serieData)
      // Retrieve the film just created
      const film = await FilmsModel.findOne(serieData)

      // Assert
      expect(film.links.rottenTomatoes).toBe('')
    });
  });

  describe("Images", () => {
    it("Creating a film with known film title, should have a cover image", () => {
      // Arrange
      const filmData = {
        title: 'Modern Familysss'
      }

      // Act
      // Create the film
      await FilmsModel.create(filmData)
      // Retrieve the film just created
      const film = await FilmsModel.findOne(filmData)

      // Assert
      expect(film.images.cover)
    })
  })
});
