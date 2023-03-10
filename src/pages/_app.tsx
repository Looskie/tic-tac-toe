import type { AppProps } from "next/app";
import { styled, styleResets } from "../stitches.config";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import { hop } from "@onehop/client";
import { Polka } from "../components/Polka";
import { PROJECT_ID } from "../utils/Commons";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  boxSizing: "border-box",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid $bg-tertiary",
  borderRadius: "5px",
  gap: 10,
  background: "$bg-secondary",
  overflow: "hidden",
  maxWidth: 600,
  padding: 15,
  zIndex: 1,
  margin: "0 15px",

  "> h1": {
    fontSize: 30,
    fontWeight: "bold",
  },
});

const Footer = styled("div", {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  height: 50,
  position: "absolute",
  bottom: 10,
});

export default function App({ Component, pageProps }: AppProps) {
  styleResets();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    hop.init({
      projectId: PROJECT_ID,
    });
  }, []);

  return (
    <Wrapper>
      <Container>
        <Component {...pageProps} />
      </Container>
      <Polka />
      <Footer>
        created by{" "}
        <a href="https://github.com/looskie" target="_blank">
          cody
        </a>{" "}
        a{" "}
        <a href="https://capy.lol/" target="_blank">
          capy.lol
        </a>{" "}
        project.
      </Footer>
    </Wrapper>
  );
}
