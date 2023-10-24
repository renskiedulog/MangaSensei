import React, { useState } from "react";
import { Rating, Typography } from "@mui/material";
import Box from "@mui/material/Box";

function StarRating({ initValue }) {
  const [value, setValue] = useState(0);
  const [rated, setRated] = useState(false);

  useState(() => {
    setValue(initValue ? Math.round(initValue * 2) / 2 : 0);
  });

  const handleChange = (event, newValue) => {
    if (!rated) {
      setValue(newValue);
      setRated(true);
    }
  };

  return (
    <div>
      <Box
        component="fieldset"
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          border: "none",
        }}
      >
        <Typography>Rate: </Typography>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={handleChange}
          precision={0.5}
          readOnly={rated ? true : false}
        />
      </Box>
    </div>
  );
}

export default StarRating;
