import React from "react";
import { NavigationBar, Mangas, BackToTop, FeaturedManga, Footer } from "../";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => (
  <>
    <BackToTop />
    <NavigationBar />
    <Box className="manga-container">
      <Box>
        <Mangas
          classname="manga-horizontal"
          title={
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                color: "var(--text-color)",
                paddingLeft: "5px",
              }}
            >
              Latest Mangas
            </Typography>
          }
          cta={
            <Link to={`/top`} className="cta-btn link-scale">
              <Box>
                <Typography>More</Typography>
                <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
              </Box>
            </Link>
          }
        />
        <Mangas
          classname="manga-horizontal"
          type="Popular"
          title={
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                color: "var(--text-color)",
                paddingLeft: "5px",
              }}
            >
              Popular Mangas
            </Typography>
          }
          cta={
            <Link to={`/top`} className="cta-btn link-scale">
              <Box>
                <Typography>More</Typography>
                <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
              </Box>
            </Link>
          }
        />
      </Box>
      <FeaturedManga />
    </Box>
    <Footer visible={true} />
  </>
);

export default Home;
