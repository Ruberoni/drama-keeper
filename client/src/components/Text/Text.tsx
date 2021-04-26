import React from 'react'
import Typography from "@material-ui/core/Typography";

interface IUnderlinedHeading {
  text: string;
}

export function UnderlinedHeading({ text }: IUnderlinedHeading) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: 'center'
      }}
    >
      <Typography variant="h3">{text}</Typography>
      <div style={{ height: 3, backgroundColor: "red", width: "95%" }}></div>
    </div>
  );
}

// MyTitle.propTypes = {
//   text: PropTypes.string,
// };'