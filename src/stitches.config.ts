import { createStitches } from "@stitches/react";
import { Lexend } from "next/font/google";

const font = Lexend({
  preload: true,
  weight: "variable",
  style: "normal",
  subsets: ["latin"],
});

const stitches = createStitches({
  theme: {
    colors: {
      "bg-primary": "#eae2d7",
      "bg-secondary": "#d8cab6",
      "bg-tertiary": "#c3ad8f",
      "text-primary": "#252525",
      "text-secondary": "#4d4d4d",
      "text-muted": "#9e9e9e",
      selected: "rgb(208, 188, 164)",
    },
    fonts: {
      main: `${font.style.fontFamily}, sans-serif`,
    },
  },
});

export const styleResets = stitches.globalCss({
  "*,*::before,*::after": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    fontWeight: 500,
    fontSize: 17,
    fontFamily: "$main",
  },
  body: {
    background: "$bg-primary",
    scrollBehavior: "smooth",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  },
  button: {
    margin: 0,
    padding: 0,
    border: "none",
    background: "none",
    cursor: "pointer",
  },

  "::-webkit-scrollbar": {
    width: 8,
    height: 8,
  },
  "::-webkit-scrollbar-track": {
    background: "$bg-secondary",
  },
  "::-webkit-scrollbar-thumb": {
    background: "$bg-tertiary",
    borderRadius: 8,
  },

  "::-moz-selection": {
    color: "$selected",
    background: "$text-primary",
  },

  "::selection": {
    color: "$selected",
    background: "$text-primary",
  },

  a: {
    color: "#aa906c",
    textDecoration: "none",
    outline: 0,
    padding: 3,
    borderRadius: 4,
  },

  h1: {
    fontSize: 24,
    color: "$text-primary",
  },
  h2: {
    fontSize: 20,
    color: "$text-primary",
  },
  h3: {
    fontSize: 18,
    color: "$text-secondary",
  },
  h4: {
    fontSize: 16,
    color: "$text-secondary",
  },

  p: {
    fontSize: 16,
    color: "$text-secondary",
  },
});

export const { css, getCssText, keyframes, styled, theme } = stitches;
