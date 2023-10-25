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
        <Route path="/" exact element={<Home />} />
        <Route
          path="/search/:search"
          exact
          element={<Search type="Search" />}
        />
        <Route path="/:filter" exact element={<Search type="Filter" />} />
        <Route path="/info/:id" exact element={<MangaInfo />} />
        <Route
          path="/:mangaId/read/:chapterId"
          exact
          element={<ReadChapter />}
        />
      </Routes>
    </Box>
  </BrowserRouter>
);

export default App;
