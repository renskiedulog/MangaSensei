import { Box, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useEffect } from "react";
import { makeRequest, fetchCoverImages } from "../../Utils/requests";

const FeaturedManga = () => {
  const [featuredManga, setFeaturedManga] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const storedManga = localStorage.getItem("featuredManga");
    const lastFeaturedDate = localStorage.getItem("lastFeaturedDate");

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const lastFeaturedDateObj = new Date(lastFeaturedDate);

    if (
      storedManga &&
      storedManga !== "null" &&
      currentDate.getDate() === lastFeaturedDateObj.getDate()
    ) {
      setFeaturedManga(JSON.parse(storedManga));
      setLoading(false);
    } else {
      makeRequest({ endpoint: "/manga" }).then((res) => {
        const randomIndex = Math.floor(Math.random() * res?.data?.data?.length);
        fetchCoverImages([res?.data?.data[randomIndex]]).then((res) => {
          setFeaturedManga(res);
          localStorage.setItem("featuredManga", JSON.stringify(res));
          localStorage.setItem("lastFeaturedDate", currentDate);
          setLoading(false);
        });
      });
    }
  }, []);

  if (loading || !featuredManga || featuredManga.length === 0) {
    return null;
  }

  return (
    <Box
      className="featured-manga"
      title={featuredManga[0].manga.attributes.title.en}
    >
      <Typography
        variant="h5"
        sx={{ marginTop: "25px", textAlign: "center", fontWeight: "600" }}
      >
        Featured
      </Typography>
      <CardMedia
        component="img"
        image={featuredManga[0].cover}
        height="auto"
        sx={{
          width: "calc(100% - 30%)",
          margin: "0 auto",
          borderRadius: "5px",
        }}
      />
      <Typography variant="h6" textAlign="center" sx={{ margin: "0 20px" }}>
        {featuredManga[0].manga.attributes.title.en}
        <Link to={`/info/${featuredManga[0].manga.id}`}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#0005",
              justifyContent: "center",
            }}
            className="link"
          >
            <Typography>More Info</Typography>
            <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
          </Box>
        </Link>
      </Typography>
    </Box>
  );
};

export default FeaturedManga;
