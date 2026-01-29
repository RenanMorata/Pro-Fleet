import { TopBar } from "./components/TopBar";
import { Board } from "./components/Board";
import { fronts } from "./data/fronts";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial" }}>
      <TopBar />
      <Board fronts={fronts} />
    </div>
  );
}
