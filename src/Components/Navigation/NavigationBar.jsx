import { Stack, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import { genres } from "../../Utils/constants";
import { SearchBar } from "../";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NavigationBar = () => {
  const handleGenre = () => {
    const genreContainer = document.querySelector(".genre-container");
    if (genreContainer.classList.contains("shown")) {
      genreContainer.classList.remove("shown");
    } else genreContainer.classList.add("shown");
  };

  return (
    <>
      <Box className="navigation-bar">
        <Link to="/">
          {" "}
          <Typography variant="h6">MangaSensei</Typography>
        </Link>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Link to="/latest" className="link">
            <Typography>Latest Mangas</Typography>
          </Link>
          <Box
            className="genre-btn link"
            onClick={handleGenre}
            sx={{ display: "flex" }}
          >
            <Typography>Genre</Typography>
            <ArrowDropDownIcon />
          </Box>
          <Link to="/top" className="link">
            <Typography>Top Mangas</Typography>
          </Link>
          <Link to="/popular" className="link">
            <Typography>Popular Mangas</Typography>
          </Link>
        </Box>
        <SearchBar />
      </Box>
      <Stack
        direction="row"
        flexWrap="wrap"
        className="genre-container"
        padding={2}
        display="none"
      >
        {genres.map((genre) => (
          <Link key={genre} to={`/${genre}`}>
            <Typography
              className="link"
              variant="subtitle1"
              sx={{ width: { xs: "150px", md: "130px" } }}
            >
              {genre}
            </Typography>
          </Link>
        ))}
      </Stack>
    </>
  );
};

export default NavigationBar;
