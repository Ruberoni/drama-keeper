import '../../config/env'
import searchUtils from '../../utils/search'

describe("function: getRottenTomatoesUrl", () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  it("when a empty string is supplied, then return is ''", async () => {

    // Act
    const url = await searchUtils.getRottenTomatoesUrl('')

    // Assert
    expect(url).toBe('')

  })

  it("when a serie name (url friendly) is supplied, then return url have /tv/", async () => {
    // Arrange
    const serieName = 'modern_family'    

    // Act
    const url = await searchUtils.getRottenTomatoesUrl(serieName)

    // Assert
    expect(url).toMatch(/tv/)
  });

  it("when a movie name (url friendly) is supplied, then return url have /m/", async () => {
    // Arrange
    const movieName = 'la_la_land'

    // Act
    const url = await searchUtils.getRottenTomatoesUrl(movieName)

    // Assert
    expect(url).toMatch(/m/)
  });

  it("when a know invalid film name (url friendly) is supplied, then return is ''", async () => {
    // Arrange
    const invalidFilmName = 'la_la_landadsad'

    // Act
    const url = await searchUtils.getRottenTomatoesUrl(invalidFilmName)

    // Assert
    expect(url).toBe('')
  });

  it("when a movie name (not url friendly) is supplied, then return url have /m/", async () => {
    // Arrange
    const invalidFilmName = 'la la land'

    // Act
    const url = await searchUtils.getRottenTomatoesUrl(invalidFilmName)

    // Assert
    expect(url).toMatch(/m/)
  });
})