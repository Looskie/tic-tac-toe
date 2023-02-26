import { styled } from "../stitches.config";

export const Input = styled("input", {
  outline: "none",

  color: "$text-primary",
  padding: "8px",
  borderRadius: "10px",
  // these are reversed because it looks better :3
  background: "$selected",
  cursor: "pointer",
  fontWeight: 500,

  border: "2px solid rgb(0 0 0 / 5%)",
  transition: "all 0.15s ease-in-out",

  "&::placeholder": {
    color: "$text-secondary",
  },

  "&:hover, &:focus": {
    border: "2px solid rgb(0 0 0 / 12%)",
    background: "$bg-tertiary",
  },
});
