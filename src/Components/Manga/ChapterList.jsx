import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";

function ChapterList({ chapters, manga }) {
  let [visibleChapters, setVisibleChapters] = useState(0);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const loadMoreChapters = () => {
    if (visibleChapters + 20 > chapters.length) {
      setVisibleChapters(chapters.length);
      setLoading(false);
      return;
    } else {
      setLoading(true);
    }
    setVisibleChapters((visibleChapters += 20));
  };

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight
    ) {
      loadMoreChapters();
    } else {
    }
  };

  useEffect(() => {
    loadMoreChapters();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  if (chapters.length === 0) {
    return <div>No Chapters Found.</div>;
  }

  return (
    <Stack
      ref={containerRef}
      sx={{
        maxHeight: "300px",
        width: "100%",
        overflowY: "scroll",
        border: "1px solid #0003",
        borderRadius: "5px",
      }}
    >
      {chapters.map((chapter, index) => {
        if (index < visibleChapters) {
          return (
            <Link key={chapter.id} to={`/${manga.id}/read/${chapter.id}`}>
              <Box
                className="chapter-link"
                sx={{
                  width: "100%",
                  borderBottom: "1px solid #0005",
                  padding: "15px",
                }}
              >
                {chapter.attributes.chapter}
                {chapter.attributes.title
                  ? ` - ${chapter.attributes.title}`
                  : ""}
              </Box>
            </Link>
          );
        } else {
          return "";
        }
      })}
      {loading && (
        <Typography
          variant="subtitle1"
          sx={{ color: "#0008", textAlign: "center" }}
        >
          Loading...
        </Typography>
      )}
    </Stack>
  );
}

export default ChapterList;
