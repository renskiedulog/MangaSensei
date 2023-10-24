import { Stack, Box, Typography, CardMedia } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { makeRequest, fetchCoverImages, getFilter } from "../../Utils/requests";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const SuggestedManga = ({ tags }) => {
  const [suggestedMangas, setSuggestedMangas] = useState([]);
  const [loading, setLoading] = useState([]);
  const { id } = useParams();

  useState(() => {
    const includeIds = [];
    for (let i = 0; i < 5; i++) {
      includeIds.push(tags[Math.floor(Math.random() * tags.length)].id);
    }
    makeRequest({
      endpoint: `/manga`,
      method: "GET",
      params: { includedTags: includeIds, limit: 20 },
    }).then((res) => {
      let randomSuggestions = [];
      if (res?.data?.data) {
        const uniqueIndices = [];
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * res.data.data.length);
          if (!uniqueIndices.includes(randomIndex)) {
            uniqueIndices.push(randomIndex);
            const selectedObject = res.data.data[randomIndex];
            randomSuggestions.push(selectedObject);
          }
        }
        fetchCoverImages(randomSuggestions).then((res) => {
          setSuggestedMangas(res);
        });
      } else {
        setSuggestedMangas([]);
      }
      setLoading(false);
    });
  }, [tags]);

  return (
    <Stack
      sx={{
        display: { xs: "grid", md: "flex" },
        gridTemplateColumns: "33% 33% 33%",
        gap: { xs: 0, md: 2 },
      }}
    >
      {suggestedMangas.map((suggested) => {
        if (suggested.manga.id != id) {
          return (
            <Box
              key={suggested.manga.attributes.title.en}
              sx={{
                display: "flex",
                alignItems: { xs: "center", md: "start" },
                flexDirection: { xs: "column", md: "row" },
                justifyContent: { xs: "start", md: "start" },
              }}
              title={
                suggested.manga.attributes.title.en ||
                suggested.manga.attributes.title["ja-ro"]
              }
            >
              <CardMedia
                key={suggested.manga.attributes.title.en}
                component="img"
                image={suggested.cover}
                alt={suggested.manga.attributes.title.en}
                sx={{
                  height: { xs: "auto", md: "100px" },
                  maxWidth: { xs: "120px", md: "calc(100% / 4)" },
                  borderRadius: "5px",
                  margin: { xs: "0", md: "auto 0" },
                }}
              />
              <Box sx={{ marginLeft: { xs: "0", md: "10px" } }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    width: { xs: "120px", md: "auto" },
                    height: { xs: "30px", md: "auto" },
                    overflow: "hidden",
                  }}
                >
                  {suggested.manga.attributes.title.en ||
                    suggested.manga.attributes.title["ja-ro"]}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: {
                      xs: "none",
                      md: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                    },
                  }}
                >
                  <b>Genre: </b>
                  {suggested.manga.attributes.tags.map((tag, idx) => {
                    if (idx < 5) {
                      return (
                        <p className="genre-tag" key={tag.attributes.name.en}>
                          {idx != 0 && "-"} {tag.attributes.name.en}
                        </p>
                      );
                    }
                  })}
                </Typography>
                <Link to={`/info/${suggested.manga.id}`} className="link-scale">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Typography>More</Typography>
                    <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
                  </Box>
                </Link>
              </Box>
            </Box>
          );
        }
      })}
    </Stack>
  );
};

export default SuggestedManga;
