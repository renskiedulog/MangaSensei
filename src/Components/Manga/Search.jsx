import { Box } from "@mui/material";
import { useState } from "react";
import { Mangas, NavigationBar, BackToTop, Footer } from "../";

const Search = ({ type }) => {
  const [page, setPage] = useState(1);

  return (
    <>
      <NavigationBar />
      <Box>
        <Mangas
          classname="search-result"
          type={type}
          page={page}
          pagination={true}
        />
      </Box>
      <Footer visible={true} />
      <BackToTop />
    </>
  );
};

export default Search;
