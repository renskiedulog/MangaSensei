import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Select,
  MenuItem,
  Switch,
  Typography,
  Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { makeRequest } from "../../Utils/requests";
import { NavigationBar, Footer } from "../";

const ReadChapter = () => {
  const { mangaId, chapterId } = useParams();
  const [loading, setLoading] = useState(true); // Initialize as true
  const [chapters, setChapters] = useState([]);
  const [chapterImages, setChapterImages] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [qualityChoice, setQualityChoice] = useState("dataSaver");
  const [chapterHash, setChapterHash] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const navigate = useNavigate();

  const handleChangeChapter = (value) => {
    navigate(`/${mangaId}/read/${chapters[value].id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      let navBar = document.querySelector(".navigation-bar");
      if (isScrollingUp) {
        navBar?.classList?.remove("shown");
      } else navBar?.classList?.add("shown");
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  useEffect(() => {
    if (mangaId) {
      setLoading(true);
      setChapters([]);

      const fetchAllChapters = async () => {
        let page = 1;
        const allChapters = [];

        while (true) {
          const response = await makeRequest({
            endpoint: `/manga/${mangaId}/feed`,
            method: "GET",
            params: {
              translatedLanguage: ["en"],
              limit: 500,
              offset: (page - 1) * 500,
            },
            filter: {
              chapter: "asc",
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
            break;
          }
        }

        setChapters(allChapters);
      };

      fetchAllChapters();
    }
  }, [mangaId]);

  useEffect(() => {
    setChapterImages([]);
    makeRequest({ endpoint: `/at-home/server/${chapterId}` }).then((res) => {
      setChapterImages(res?.data?.chapter[qualityChoice]);
      setChapterHash(res?.data?.chapter?.hash);
    });
    setLoading(false);
  }, [chapterId, qualityChoice]);

  useEffect(() => {
    if (chapters) {
      const foundIndex = chapters.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (foundIndex !== -1) {
        setCurrentChapterIndex(foundIndex);
      }
    }
    setLoading(false);
  }, [chapterId, chapters]);

  const toggleQuality = () => {
    const newChoice = qualityChoice === "data" ? "dataSaver" : "data";
    setQualityChoice(newChoice);
    localStorage.setItem("quality", newChoice);
  };

  useEffect(() => {
    const storedQuality = localStorage.getItem("quality")
      ? localStorage.getItem("quality")
      : "dataSaver";
    if (storedQuality) {
      setQualityChoice(storedQuality);
    }
  }, []);

  const previousChapter =
    currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex < chapters.length - 1
      ? chapters[currentChapterIndex + 1]
      : null;

  return (
    <>
      <NavigationBar />
      <Box
        sx={{
          margin: "auto",
          minHeight: "100vh",
        }}
      >
        {!loading && currentChapterIndex != -1 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: { xs: "0 2%", md: "0 10%" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Typography variant="subtitle1">Chapter:</Typography>
              {
                <Select
                  value={currentChapterIndex}
                  onChange={(event) => handleChangeChapter(event.target.value)}
                  sx={{ minWidth: "100px", height: "30px" }}
                >
                  {chapters.map((chapter) => (
                    <MenuItem
                      key={chapter?.attributes?.chapter}
                      value={chapter?.attributes?.chapter}
                    >
                      {chapter?.attributes?.chapter}
                    </MenuItem>
                  ))}
                </Select>
              }
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "3px",
                alignItems: "center",
              }}
            >
              <Typography>Data Saver</Typography>
              <Switch
                onChange={toggleQuality}
                checked={qualityChoice === "data"}
              />
              <Typography>HD</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "3px" }}>
              {previousChapter && (
                <Button
                  startIcon={<ArrowBackIcon />}
                  variant="contained"
                  onClick={() => {
                    navigate(`/${mangaId}/read/${previousChapter.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  sx={{
                    padding: { xs: "5px 6px", md: "10px 12px" },
                    minWidth: { xs: "20px", md: "50px" },
                  }}
                >
                  Prev
                </Button>
              )}
              {nextChapter && (
                <Button
                  endIcon={<ArrowForwardIcon />}
                  variant="contained"
                  onClick={() => {
                    navigate(`/${mangaId}/read/${nextChapter.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  sx={{
                    padding: { xs: "5px 6px", md: "10px 12px" },
                    minWidth: { xs: "20px", md: "50px" },
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        )}
        {chapterImages.length > 0 && !loading && currentChapterIndex != 1 && (
          <>
            <Box
              className="images"
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: { xs: "100%", md: "820px" },
                margin: "auto",
              }}
            >
              {chapterImages.map(
                (image, index) =>
                  image && (
                    <img
                      src={`https://uploads.mangadex.org/${
                        qualityChoice == "data" ? "data" : "data-saver"
                      }/${chapterHash}/${image}`}
                      key={index}
                      style={{ width: "100%" }}
                    />
                  )
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: { xs: "0 2%", md: "0 10%" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <Typography variant="subtitle1">Chapter:</Typography>
                {
                  <Select
                    value={currentChapterIndex}
                    onChange={(event) =>
                      handleChangeChapter(event.target.value)
                    }
                    sx={{ minWidth: "100px", height: "30px" }}
                  >
                    {chapters.map((chapter) => (
                      <MenuItem
                        key={chapter?.attributes?.chapter}
                        value={chapter?.attributes?.chapter}
                      >
                        {chapter?.attributes?.chapter}
                      </MenuItem>
                    ))}
                  </Select>
                }
              </Box>
              <Box sx={{ display: "flex", gap: "3px" }}>
                {previousChapter && (
                  <Button
                    startIcon={<ArrowBackIcon />}
                    variant="contained"
                    onClick={() => {
                      navigate(`/${mangaId}/read/${previousChapter.id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    sx={{
                      padding: { xs: "5px 6px", md: "10px 12px" },
                      minWidth: { xs: "20px", md: "50px" },
                    }}
                  >
                    Prev
                  </Button>
                )}
                {nextChapter && (
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    onClick={() => {
                      navigate(`/${mangaId}/read/${nextChapter.id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    sx={{
                      padding: { xs: "5px 6px", md: "10px 12px" },
                      minWidth: { xs: "20px", md: "50px" },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default ReadChapter;
