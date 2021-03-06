import '../../config/env'
import searchUtils from '../../utils/search'

describe('Search', () => {
  describe("getRottenTomatoesUrl", () => {
    beforeEach(() => {
      jest.setTimeout(10000);
    });

    it("when an empty title and type are supplied, then return is ''", async () => {
      const film = {
        title: '',
        type: ''
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')

    })

    it("when a serie name (url friendly) and 'TV' type is supplied, then return url have /tv/", async () => {
      // Arrange
      const film = {
        title: 'modern_family',
        type: 'TV'
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toMatch(/tv/)
    });
    it("when a serie name (url friendly) and 'Movie' type is supplied, then return url is ''", async () => {
      // Arrange
      const film = {
        title: 'modern_family',
        type: 'Movie'
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')
    });

    it("when a serie name (url friendly) and no type is supplied, then return url is ''", async () => {
      // Arrange
      const film = {
        title: 'modern_family',
        type: ''
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')
    });

    it("when a movie name (not url friendly) and 'Movie' type is supplied, then return url have /m/", async () => {
      // Arrange
      const film = {
        title: 'la la land',
        type: 'Movie'
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toMatch(/m/)
    });

    it("when a movie name (not url friendly) and 'TV' type is supplied, then return url is ''", async () => {
      // Arrange
      const film = {
        title: 'Aviator',
        type: 'TV'
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')
    });

    it("when a movie name (not url friendly) and no type is supplied, then return url is ''", async () => {
      // Arrange
      const film = {
        title: 'la la land',
        type: ''
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')
    });

    it("when a know invalid film name (url friendly) and 'TV' type is supplied, then return is ''", async () => {
      // Arrange
      const film = {
        title: 'la_la_landadsad',
        type: 'TV'
      }

      // Act
      const url = await searchUtils.getRottenTomatoesUrl(film)

      // Assert
      expect(url).toBe('')
    });

  })
  describe("getTMDbCover", () => {
    it("With a known movie info, return should be a string finishing in jpg.", async () => {
      // Arrange
      const Film = {title:'La la land', type:'Movie'}
      // Act
      const coverPath = await searchUtils.getTMDbCover(Film)
      // Assert
      expect(coverPath).toMatch(/.jpg/)
    })

    it("With incorrect input: known movie title but with TV type, return should be the empty string", async () => {
      // Arrange
      const Film = {title:'La la land', type:'TV'}
      // Act
      const coverPath = await searchUtils.getTMDbCover(Film)
      // Assert
      expect(coverPath).toBe('')
    })

    it("With a known serie info, return should be a string finishing in jpg.", async () => {
      // Arrange
      const Film = {title:'Modern Family', type:'TV'}
      // Act
      const coverPath = await searchUtils.getTMDbCover(Film)
      // Assert
      expect(coverPath).toMatch(/.jpg/)
    })
  })
})