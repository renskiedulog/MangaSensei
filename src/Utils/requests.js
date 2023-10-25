const axios = require("axios");

const baseUrl = "https://api.mangadex.org";

export const makeRequest = async ({
  endpoint,
  method = "GET",
  params = {},
  filter = {},
}) => {
  // ! Filter
  const order = {
    ...filter,
  };
  const finalOrderQuery = {};
  for (const [key, value] of Object.entries(order)) {
    finalOrderQuery[`order[${key}]`] = value;
  }

  // ! Combine
  params = {
    ...params, // Include any existing params
    ...finalOrderQuery, // Include the contents of finalOrderQuery
  };

  // ! Request
  try {
    const res = await axios({
      method,
      url: `${baseUrl}${endpoint}`,
      params,
    });
    return res;
  } catch (error) {
    return [];
  }
};

export const getFilter = async (filter, limit) => {
  let request = {
    endpoint: `/manga/tag`,
    method: "GET",
    params: {},
    filter: {},
    mode: "no-cors",
    cache: "default",
  };
  const includedTagNames = [filter];
  const tags = await makeRequest(request);
  const includedTagIDs = tags?.data?.data
    .filter((tag) => includedTagNames.includes(tag.attributes.name.en))
    .map((tag) => tag.id);

  return includedTagIDs;
};

export const fetchCoverImages = async (array) => {
  const coverImages = await Promise.all(
    array.flatMap(async (manga) => {
      const coverRelationships = manga?.relationships?.filter(
        (rel) => rel.type === "cover_art"
      );
      const coverPromises = coverRelationships
        ? coverRelationships.map(async (rel) => {
            let request = {
              endpoint: `/cover/${rel.id}`,
              method: "GET",
              params: {},
              filter: {},
            };
            const response = await makeRequest(request);
            const coverUrl = `https://uploads.mangadex.org/covers/${manga.id}/${response?.data?.data?.attributes?.fileName}.256.jpg`;
            return {
              manga,
              cover: coverUrl,
            };
          })
        : [];
      return Promise.all(coverPromises);
    })
  );

  return coverImages.flat();
};

export function timeAgo(dateString) {
  const providedDate = new Date(dateString);
  const now = new Date();

  now.setHours(now.getHours() + 1);
  now.setMinutes(now.getMinutes() + 5);
  providedDate.setHours(providedDate.getHours() % 12);
  now.setHours(now.getHours() % 12);

  const timeDifferenceInSeconds = Math.floor((now - providedDate) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return `${timeDifferenceInSeconds} second${
      timeDifferenceInSeconds > 1 ? "s" : ""
    } ago`;
  } else if (timeDifferenceInSeconds < 3600) {
    const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutesAgo != 1 ? minutesAgo : "a"} minute${
      minutesAgo > 1 ? "s" : ""
    } ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 2592000) {
    // Less than 30 days (approx. a month)
    const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 31536000) {
    // Less than 365 days (approx. a year)
    const monthsAgo = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
  } else {
    const yearsAgo = Math.floor(timeDifferenceInSeconds / 31536000);
    return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
  }
}
