import { useState } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Filesystem, Directory } from "@capacitor/filesystem";
import gameDB from "./data/eshop-slim.json";

type Game = {
  id: string;
  name: string;
  publisher: string;
};

export default function App() {
  const [games, setGames] = useState<Game[]>([]);

  const pickParentFolder = async () => {
    try {
      // 1. Pick the parent folder
      const result = await FilePicker.pickDirectory();
      if (!result.path) {
        alert("No folder picked");
        return;
      }

      const parentPath = result.path;

      // 2. List subfolders (TitleIDs)
      // ⚠️ depends on plugin support, example with Filesystem.readdir:
      const dir = await Filesystem.readdir({
        path: parentPath,
        directory: Directory.External,
      });

      // 3. Match subfolder names against title DB
      const found: Game[] = [];
      for (const folder of dir.files) {
        const titleId = folder.name;
        const game = (gameDB as any)[titleId];
        if (game) {
          found.push(game);
        } else {
          found.push({
            id: titleId,
            name: "Unknown Game",
            publisher: "Unknown",
          });
        }
      }

      setGames(found);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Switch Save Manager</h1>
      <button onClick={pickParentFolder}>Pick Saves Folder</button>

      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <strong>{game.name}</strong> <br />
              ID: {game.id} <br />
              Publisher: {game.publisher}
            </li>
          ))}
        </ul>
      ) : (
        <p>No saves listed yet</p>
      )}
    </div>
  );
}