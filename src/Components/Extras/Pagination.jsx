import React from "react";
import { Button, Box, Select, MenuItem } from "@mui/material";

function Pagination({ totalPage, currentPage, onPageChange, classname }) {
  const totalPages = totalPage || 0; // Total number of pages in your data
  const pagesToShow = 5; // Number of pages to display

  const pageRange = (currentPage, totalPages, pagesToShow) => {
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const handlePageChange = (page) => {
    onPageChange(page); // Notify the parent component of the selected page
  };

  const pageNumbers = pageRange(currentPage, totalPages, pagesToShow);

  return (
    <Box
      sx={{ display: "flex", gap: "3px", height: "35px" }}
      className={classname}
    >
      {pageNumbers.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "contained" : "outlined"}
          onClick={() => handlePageChange(page)}
          sx={{ padding: "0 !important" }}
        >
          {page}
        </Button>
      ))}
      <Select
        onChange={(event) => handlePageChange(event.target.value)}
        sx={{ width: "60px" }}
        placeholder="Page"
        value={currentPage}
      >
        {Array(totalPage)
          .fill(null)
          .map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
      </Select>
    </Box>
  );
}

export default Pagination;
