import { useState } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Filesystem } from "@capacitor/filesystem";
import gameDB from "./data/eshop-slim.json";

type Game = {
  id: string;
  name: string;
  publisher: string;
};

declare global {
  interface Window {
    resolveLocalFileSystemURL: any;
  }
}

export default function App() {
  const [games, setGames] = useState<Game[]>([]);

  // ✅ Check/request storage permission only if needed
  const ensurePermissions = async (): Promise<boolean> => {
    try {
      const perm = await Filesystem.checkPermissions();
      if (perm.publicStorage !== "granted") {
        const req = await Filesystem.requestPermissions();
        if (req.publicStorage !== "granted") {
          alert("Storage permission is required to read saves!");
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn("Permission check failed (might be SAF-only):", err);
      // Some Android versions don’t require READ/WRITE for content://
      return true;
    }
  };

  const pickParentFolder = async () => {
    try {
      const granted = await ensurePermissions();
      if (!granted) return;

      // 1. Pick parent folder (returns SAF URI)
      const result = await FilePicker.pickDirectory();
      console.log("PickDirectory result:", result);

      if (!result.path) {
        alert("No folder picked");
        return;
      }

      const folderUri = result.path; // expect content://

      if (!folderUri.startsWith("content://")) {
        alert("Expected a SAF content:// URI, got: " + folderUri);
        return;
      }

      // 2. Use cordova-plugin-file to resolve & list subfolders
      window.resolveLocalFileSystemURL(
        folderUri,
        (dirEntry: any) => {
          const reader = dirEntry.createReader();
          reader.readEntries(
            (entries: any[]) => {
              const found: Game[] = [];
              for (const entry of entries) {
                if (entry.isDirectory) {
                  const titleId = entry.name;
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
              }
              setGames(found);
            },
            (err: any) => {
              console.error("Error reading entries", err);
              alert("Could not list subfolders");
            }
          );
        },
        (err: any) => {
          console.error("resolveLocalFileSystemURL failed", err);
          alert("Could not resolve folder: " + err.message);
        }
      );
    } catch (err) {
      console.error("Error picking folder:", err);
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