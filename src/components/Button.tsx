import { styled } from "../stitches.config";

export const Button = styled("button", {
  outline: "none",

  color: "$text-secondary",
  padding: "8px",
  borderRadius: "10px",
  background: "$bg-secondary",
  opacity: "0.75",
  cursor: "pointer",

  border: "2px solid rgb(0 0 0 / 5%)",
  transition: "all 0.15s ease-in-out",

  "&:hover": {
    opacity: "1",
    border: "2px solid rgb(0 0 0 / 12%)",
  },

  variants: {
    secondary: {
      true: {
        color: "$text-primary",
        background: "$bg-tertiary",
      },
    },
  },
});
