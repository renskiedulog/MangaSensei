const axios = require("axios");

export class MangaApi {
  constructor() {
    this.baseUrl = "https://api.mangadex.org";
  }

  async makeRequest(endpoint, method = "GET", params = {}) {
    const order = {
      updatedAt: "desc",
      relevance: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    try {
      const res = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        params,
      });
      return res;
    } catch (error) {
      return [];
    }
  }

  // ! Manga Search
  async getMangaByTitle(search, limit) {
    const order = {
      updatedAt: "desc",
      relevance: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    return this.makeRequest("/manga", "GET", { title: search, limit: limit });
  }

  async getLatestManga() {
    const order = {
      updatedAt: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    // order[updatedAt]=desc
    return this.makeRequest("/manga", "GET", {
      limit: 100,
      ...finalOrderQuery,
    });
  }

  async getTopRatedManga() {
    const order = {
      rating: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    return this.makeRequest("/manga", "GET", {
      ...finalOrderQuery,
      limit: 100,
    });
  }

  async getPopularManga() {
    const order = {
      followedCount: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    return this.makeRequest("/manga", "GET", {
      ...finalOrderQuery,
      limit: 100,
    });
  }

  async getTopManga(limit) {
    const order = {
      rating: "desc",
      followedCount: "desc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    return this.makeRequest("/manga", "GET", {
      ...finalOrderQuery,
      limit: limit,
    });
  }

  async getMangaByFilter(filter, limit) {
    const includedTagNames = [filter];
    const tags = await this.makeRequest("/manga/tag", "GET");
    const includedTagIDs = tags.data.data
      .filter((tag) => includedTagNames.includes(tag.attributes.name.en))
      .map((tag) => tag.id);

    return this.makeRequest("/manga", "GET", {
      includedTags: includedTagIDs,
      limit: limit,
    });
  }

  // ! Manga Info
  async getCoverId(coverId) {
    return this.makeRequest(`/cover/${coverId}`);
  }

  async getMangaInfo(mangaId) {
    return this.makeRequest(`/manga/${mangaId}`);
  }

  async getMangaChapters(mangaId) {
    const order = {
      chapter: "asc",
    };
    const finalOrderQuery = {};
    for (const [key, value] of Object.entries(order)) {
      finalOrderQuery[`order[${key}]`] = value;
    }
    return this.makeRequest(`/manga/${mangaId}/feed`, "GET", {
      ...finalOrderQuery,
      translatedLanguage: ["en"],
      limit: 500,
    });
  }

  async getRatings(mangaId) {
    return this.makeRequest(`/statistics/manga/${mangaId}`, "GET");
  }

  // ! Chapter Images
  async getChapterImages(chapterId) {
    return this.makeRequest(`/at-home/server/${chapterId}`, "GET");
  }
}

export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const timeDifferenceInSeconds = Math.floor((now - date) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} second${
      timeDifferenceInSeconds > 1 ? "s" : ""
    } ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 2592000) {
    const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else {
    const monthsAgo = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
  }
}
