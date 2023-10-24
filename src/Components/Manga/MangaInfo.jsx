import { Box, CardMedia, Typography, Button } from "@mui/material";
import {
  NavigationBar,
  Footer,
  ChapterList,
  StarRating,
  SuggestedManga,
} from "../";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeRequest, fetchCoverImages } from "../../Utils/requests";

const MangaInfo = () => {
  const [manga, setManga] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    makeRequest({ endpoint: `/manga/${id}` }).then((res) =>
      res?.data?.data
        ? fetchCoverImages([res?.data?.data]).then((res) => setManga(res))
        : setManga([])
    );
  }, [id]);

  useEffect(() => {
    if (manga.length === 1) {
      setLoading(true);
      setChapters([]);

      const fetchAllChapters = async () => {
        let page = 1;
        const allChapters = [];

        while (true) {
          const response = await makeRequest({
            endpoint: `/manga/${manga[0]?.manga?.id}/feed`,
            method: "GET",
            params: {
              translatedLanguage: ["en"],
              limit: 500,
              offset: (page - 1) * 500,
            },
            filter: {
              chapter: "desc",
            },
          });

          const mangaChapters = response?.data?.data;
          const newChapters = [];
          const seenChapterNumbers = new Set();

          mangaChapters.forEach((chapter) => {
            const chapterNumber = parseInt(chapter.attributes.chapter);
            const pages = chapter.attributes.pages;

            if (pages > 0 && !seenChapterNumbers.has(chapterNumber)) {
              newChapters.push(chapter);
              seenChapterNumbers.add(chapterNumber);
            }
          });

          if (mangaChapters && mangaChapters.length > 0) {
            allChapters.push(...newChapters);
            page++;
          } else {
            const statisticsResponse = await makeRequest({
              endpoint: `/statistics/manga/${manga[0]?.manga?.id}`,
            });

            const statisticsData =
              statisticsResponse?.data?.statistics[manga[0]?.manga?.id] || [];

            setStatistics(statisticsData);
            break; // No more chapters to fetch
          }
        }

        // Now allChapters contains all the chapters
        setChapters(allChapters);
        setLoading(false);
      };

      fetchAllChapters();
    }
  }, [manga]);

  return (
    <>
      <NavigationBar />
      <Box sx={{ minHeight: "100vh" }}>
        {loading || manga.length == 0 || statistics.length == 0 ? null : (
          <Box
            sx={{
              width: { xs: "95%", md: "80%" },
              margin: "auto",
              display: { xs: "block", md: "grid" },
              gridTemplateColumns: "70% 30%",
              overflow: "hidden",
              border: "none",
            }}
          >
            <Box className="left-info">
              <Box className="manga-info">
                {/* Manga Title */}
                <Typography variant="h5" textAlign="center" my={2}>
                  {manga[0].manga.attributes.title.en}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: {
                      xs: "wrap",
                      md: "nowrap",
                    },
                    height: { xs: "auto", md: "calc(100vh / 2 - 30px)" },
                  }}
                >
                  <CardMedia
                    key={manga[0].manga.id}
                    component="img"
                    image={manga[0].cover}
                    alt={manga[0].manga.title}
                    sx={{
                      height: "auto",
                      width: "300px",
                      borderRadius: "5px",
                      margin: { xs: "0 auto" },
                    }}
                  />
                  <Box
                    sx={{
                      height: "100%",
                      overflow: "auto",
                      marginLeft: "10px",
                      marginTop: { xs: "10px", md: "0" },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        display: { xs: "flex", md: "block" },
                        gap: "30px",
                      }}
                    >
                      <p>
                        Average:
                        <b> {(statistics.rating.average / 2).toFixed(2)}</b>
                      </p>
                      <p>
                        Follows: <b>{statistics.follows}</b>
                      </p>
                    </Typography>
                    <StarRating
                      initValue={(statistics.rating.average / 2).toFixed(2)}
                    />
                    <Typography variant="h6" fontWeight="bold" my={2}>
                      Information
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textTransform: "capitalize",
                        maxHeight: { xs: "400px" },
                      }}
                    >
                      <b>Chapters:</b> {chapters.length} <br />
                      <Box sx={{ display: "flex", gap: "3px" }}>
                        <b>Status:</b>
                        <Typography
                          backgroundColor={
                            manga[0].manga.attributes.status === "ongoing"
                              ? "green"
                              : manga[0].manga.attributes.status === "completed"
                              ? "orange"
                              : manga[0].manga.attributes.status === "hiatus"
                              ? "blue"
                              : manga[0].manga.attributes.status === "cancelled"
                              ? "red"
                              : "gray" // Default color for unknown status
                          }
                          color="white"
                          sx={{
                            padding: "3px 5px",
                            borderRadius: "5px",
                            minWidth: "70px",
                            textAlign: "center",
                          }}
                        >
                          {manga[0].manga.attributes.status}
                        </Typography>
                        <Typography
                          backgroundColor={
                            manga[0].manga.attributes.contentRating === "safe"
                              ? "green"
                              : manga[0].manga.attributes.contentRating ===
                                "suggestive"
                              ? "orange"
                              : manga[0].manga.attributes.contentRating ===
                                "erotica"
                              ? "pink"
                              : manga[0].manga.attributes.contentRating ===
                                "pornographic"
                              ? "red"
                              : "gray"
                          }
                          color="white"
                          sx={{
                            padding: "3px 5px",
                            borderRadius: "5px",
                            minWidth: "70px",
                            textAlign: "center",
                          }}
                        >
                          {manga[0].manga.attributes.contentRating}
                        </Typography>
                        <Typography
                          backgroundColor={
                            manga[0].manga.type === "manga"
                              ? "grey"
                              : manga[0].manga.type === "manhwa"
                              ? "orange"
                              : manga[0].manga.type === "manhua"
                              ? "green"
                              : "black"
                          }
                          color="white"
                          sx={{
                            padding: "3px 5px",
                            borderRadius: "5px",
                            minWidth: "70px",
                            textAlign: "center",
                          }}
                        >
                          {manga[0].manga.type}
                        </Typography>
                      </Box>
                      <b>Genre: </b>{" "}
                      {manga[0].manga.attributes.tags.map((tag, idx) => {
                        if (idx < 5) {
                          return (
                            <Link
                              key={tag.attributes.name.en}
                              className="genre-tag"
                              to={`/manga/${tag.attributes.name.en}`}
                            >
                              {idx != 0 && "-"} {tag.attributes.name.en}{" "}
                            </Link>
                          );
                        }
                      })}{" "}
                      <br />
                      <b>Description: </b> <br />{" "}
                      {manga[0].manga.attributes.description.en}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ margin: "20px 0" }}>
                <Box>
                  <Typography variant="h5">Chapters</Typography>
                  {chapters.length != 0 && (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "50% 50%",
                        padding: "0 20px",
                        gap: "5px",
                        margin: "5px 0",
                      }}
                    >
                      <Link
                        to={`/${id}/read/${chapters[chapters.length - 1].id}`}
                        key={chapters[0].id}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            width: "100%",
                            padding: "10px 20px",
                            color: "#fff",
                          }}
                        >
                          Read First Chapter
                        </Button>
                      </Link>
                      <Link
                        key={chapters[chapters.length - 1].id}
                        to={`/${id}/read/${chapters[0].id}`}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            width: "100%",
                            padding: "10px 20px",
                            color: "#fff",
                          }}
                        >
                          Read Last Chapter
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Box>
                <ChapterList chapters={chapters} manga={manga[0].manga} />
              </Box>
            </Box>
            <Box sx={{ margin: "10px" }}>
              <Typography variant="h6">Similar Mangas:</Typography>
              <SuggestedManga tags={manga[0].manga.attributes.tags} />
            </Box>
          </Box>
        )}
      </Box>
      <Footer visible={false} />
    </>
  );
};

export default MangaInfo;
