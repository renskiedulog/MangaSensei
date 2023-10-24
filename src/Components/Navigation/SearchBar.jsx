import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setSearch(value);
  };

  return (
    <Paper
      className="search-form"
      component="form"
      onSubmit={() => {
        navigate(`/search/${search}`);
      }}
      sx={{
        borderRadius: 20,
        border: "1px solid #e3e3e3",
        pl: 2,
        boxShadow: "none",
        width: { xs: "calc(100% / 2)", md: "calc(100% / 5)" },
        height: "40px",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <input
        className="search-bar"
        placeholder="Search..."
        value={search ? search : ""}
        onChange={handleOnChange}
      />
      <IconButton
        type="submit"
        sx={{
          p: "10px",
          color: "var(--highlight-color)",
          position: "absolute",
          right: "0",
        }}
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
