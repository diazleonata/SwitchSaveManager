import { useState } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFolder = async () => {
    if (loading) return; // prevent spamming
    setLoading(true);

    try {
      // Always request permissions first
      await FilePicker.requestPermissions();

      // Pick directory
      const result = await FilePicker.pickDirectory();
      if (result.path) {
        setSelectedDir(result.path);
      }
    } catch (err) {
      console.error("Error picking folder:", err);
      setSelectedDir("Error: Unable to pick folder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={pickFolder} disabled={loading}>
          {loading ? "Opening…" : "Select Folder"}
        </button>

        {selectedDir && (
          <p>
            <strong>Selected folder:</strong> {selectedDir}
          </p>
        )}
      </div>
    </>
  );
}

export default App;