import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import "./index.css";
import { Home, Search, MangaInfo, ReadChapter } from "./Components";

const App = () => (
  <BrowserRouter basename="/MangaSensei">
    <Box
      className="app-body"
      sx={{
        paddingTop: "60px",
        height: "auto",
        margin: "0 auto",
      }}
    >
      <Routes>
        <Route path="/MangaSensei" exact element={<Home />} />
        <Route
          path="/MangaSensei/search/:search"
          exact
          element={<Search type="Search" />}
        />
        <Route
          path="/MangaSensei/:filter"
          exact
          element={<Search type="Filter" />}
        />
        <Route path="/MangaSensei/info/:id" exact element={<MangaInfo />} />
        <Route
          path="/MangaSensei/:mangaId/read/:chapterId"
          exact
          element={<ReadChapter />}
        />
      </Routes>
    </Box>
  </BrowserRouter>
);

export default App;
