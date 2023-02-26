import { createStitches } from "@stitches/react";
import { Inter } from "next/font/google";

const font = Inter({
  preload: true,
  weight: "variable",
  style: "normal",
  subsets: ["latin"],
});

const stitches = createStitches({
  theme: {
    colors: {},
    fonts: {
      main: `${font.style.fontFamily}, sans-serif`,
    },
  },
});

export const styleResets = stitches.globalCss({
  body: {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    backgroundImage: "url('https://api.capy.lol/v1/capybara')!important",
    fontFamily: "$main",
  },
  button: {
    margin: 0,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
});

export const { css, getCssText, keyframes, styled, theme } = stitches;
