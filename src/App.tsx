import { useState } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import gameDB from "./data/eshop-slim.json"; // slim JSON

type Game = {
  id: string;
  name: string;
  publisher: string;
};

export default function App() {
  const [selected, setSelected] = useState<Game | null>(null);

  const pickSaveFolder = async () => {
    try {
      // 1. Ask for dir
      const result = await FilePicker.pickDirectory();
      if (!result.path) {
        alert("No folder picked");
        return;
      }

      const path = result.path;

      // 2. Extract TitleID from folder name
      // Example: /storage/emulated/0/Switch/Saves/01005CA01580E000
      const parts = path.split("/");
      const titleId = parts[parts.length - 1];

      // 3. Lookup in JSON
      const game = (gameDB as any)[titleId];

      if (game) {
        setSelected(game);
      } else {
        alert(`Unknown TitleID: ${titleId}`);
      }
    } catch (err) {
      console.error("Error picking folder:", err);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Switch Save Manager</h1>
      <button onClick={pickSaveFolder}>Pick Save Folder</button>

      {selected ? (
        <div style={{ marginTop: "1rem" }}>
          <h2>{selected.name}</h2>
          <p><b>ID:</b> {selected.id}</p>
          <p><b>Publisher:</b> {selected.publisher}</p>
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>No save selected yet</p>
      )}
    </div>
  );
}