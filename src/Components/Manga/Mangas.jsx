import { Stack, Box, Typography, CardMedia } from "@mui/material";
import { useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "../";
import {
  makeRequest,
  timeAgo,
  fetchCoverImages,
  getFilter,
} from "../../Utils/requests";

const Mangas = ({ classname, title, cta, type, pagination }) => {
  const { search, filter } = useParams();
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastType, setLastType] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const onPageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    setLoading(true);

    if (lastType !== filter) {
      setLastType(filter);
      setPage(1);
    }

    var requestOptions = {};

    if (filter === "latest") {
      type = "";
    } else if (filter === "top") {
      type = "Top";
    } else if (filter === "popular") {
      type = "Popular";
    }

    if (type === "Filter") {
      getFilter(filter)
        .then((res) => {
          const includeIds = res[0];
          requestOptions = {
            endpoint: "/manga",
            method: "GET",
            params: {
              includedTags: [includeIds],
              limit: 100,
              offset: page * 50 - 50,
            },
          };
          return makeRequest(requestOptions);
        })
        .then((res) => {
          setMaxPage(
            Math.ceil(res?.data?.total / 50 > 100 ? 100 : res?.data?.total / 50)
          );

          if (res?.data?.data) {
            return fetchCoverImages(res?.data?.data);
          } else {
            return [];
          }
        })
        .then((res) => {
          setMangas(res);
          setLoading(false);
        })
        .catch((error) => {
          setMangas([]);
        });
    } else {
      requestOptions = {
        endpoint: "/manga",
        method: "GET",
        params: { limit: 50, offset: page * 50 - 50 },
      };

      if (type === "Top") {
        requestOptions.filter = {
          rating: "desc",
          followedCount: "desc",
        };
      } else if (type === "Popular") {
        requestOptions.filter = {
          followedCount: "desc",
        };
      } else if (type === "Search") {
        requestOptions.params = { title: search, limit: 50 };
        requestOptions.filter = {
          updatedAt: "desc",
          relevance: "desc",
        };
      } else {
        requestOptions.filter = {
          updatedAt: "desc",
        };
      }

      makeRequest(requestOptions)
        .then((res) => {
          setMaxPage(
            Math.ceil(res?.data?.total / 50 > 100 ? 100 : res?.data?.total / 50)
          );

          if (res?.data?.data) {
            return fetchCoverImages(res?.data?.data);
          } else {
            return [];
          }
        })
        .then((res) => {
          setMangas(res);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [search, type, filter, page]);

  return (
    <Box
      sx={{ position: "relative", margin: "15px 0" }}
      className={pagination ? "c-height" : ""}
    >
      {pagination && !loading && mangas.length > 0 && (
        <Box>
          <Pagination
            currentPage={page}
            totalPage={maxPage}
            onPageChange={onPageChange}
            classname="pagination-top"
          />
          <Pagination
            currentPage={page}
            totalPage={maxPage}
            onPageChange={onPageChange}
            classname="pagination-bottom"
          />
        </Box>
      )}
      {title}
      {search && <Typography variant="h5">Results for: "{search}"</Typography>}
      {filter && (
        <Typography variant="h5">Mangas Tagged: "{filter}"</Typography>
      )}
      {!loading && mangas.length > 0 && (
        <Stack className={classname}>
          {mangas.map(({ manga, cover }, index) => (
            <Link
              to={`/info/${manga.id}`}
              key={manga.id}
              title={
                manga.attributes.title.en || manga.attributes.title["ja-ro"]
              }
            >
              <Box
                className="manga"
                sx={{
                  width: { xs: "50px", md: "150px" },
                  textAlign: "center",
                  borderRadius: "5px",
                  alignSelf: "start",
                  margin: "5px",
                  scrollSnapAlign: index % 6 === 0 ? "start" : "",
                  scrollBehavior: "smooth",
                }}
              >
                <CardMedia
                  key={manga.id}
                  component="img"
                  image={cover}
                  alt={manga.title}
                  sx={{
                    height: {
                      xs: "70px",
                      md: "200px",
                      borderRadius: "5px",
                      width: "inherit",
                    },
                  }}
                />
                <Typography
                  sx={{
                    height: { xs: "13px", md: "25px" },
                    overflow: "hidden",
                    marginTop: "3%",
                    fontSize: { xs: "10px", md: "15px" },
                  }}
                >
                  {manga.attributes.title.en || manga.attributes.title["ja-ro"]}
                </Typography>
                <Typography
                  sx={{
                    height: { xs: "13px", md: "15px" },
                    overflow: "hidden",
                    fontSize: { xs: "7px", md: "10px" },
                    opacity: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    justifyContent: "center",
                  }}
                >
                  <AccessTimeIcon
                    sx={{ fontSize: "inherit", transform: "scale(1.3)" }}
                  />
                  Upated {timeAgo(manga.attributes.updatedAt)}
                </Typography>
              </Box>
            </Link>
          ))}
        </Stack>
      )}
      {cta}
    </Box>
  );
};

export default Mangas;
