import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const TextInput = ({ icon, endIcon, InputProps, label, ...props }) => {
  return (
    <TextField
      autoComplete="off"
      sx={{
        "& fieldset": { border: "none" },
        borderRadius: 2,
        width: "90%",
        backgroundColor: "rgba(247, 247, 247, 1)",
        color: "white",
        "& .css-19obg2t-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
        "& .css-168ywxh-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
        "& .css-opmmng-MuiInputBase-root-MuiOutlinedInput-root": {
          color: "white",
        },
      }}
      placeholder={label}
      {...props}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="start">{endIcon}</InputAdornment>
        ) : null,
      }}
      variant="outlined"
    />
  );
};

export default TextInput;
