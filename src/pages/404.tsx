import { useRouter } from "next/router";
import { Button } from "../components/Button";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <h1>Uh oh</h1>
      <p>Seems like your lost</p>
      <Button onClick={() => router.push("/")} secondary>
        Go home
      </Button>
    </>
  );
}
