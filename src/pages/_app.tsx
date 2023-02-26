import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { styled, styleResets } from "../stitches.config";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import { hop } from "@onehop/client";

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100%",
  boxSizing: "border-box",
});

export default function App({ Component, pageProps }: AppProps) {
  styleResets();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const user_id = sessionStorage.getItem("user_id");

    if (!user_id) {
      // define user state in session storage with nanoid
      sessionStorage.setItem("user_id", nanoid(15));
    }

    hop.init({
      projectId: "project_MTEzNjc2NjIzOTg2Njg4MTI5",
    });
  }, []);

  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}
