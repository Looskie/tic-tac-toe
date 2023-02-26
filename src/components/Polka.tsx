import { styled } from "../stitches.config";

export const Polka = styled("div", {
  background:
    "linear-gradient(transparent, $bg-primary), url('/polka-dots.svg')",
  position: "absolute",
  inset: 0,
  height: 500,
  zIndex: 0,
});
