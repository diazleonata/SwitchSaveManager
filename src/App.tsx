import { useState } from "react";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [selectedDir, setSelectedDir] = useState<string | null>(null);

    const pickFolder = async () => {
        try {
            // Request permissions (no need to check manually)
            await FilePicker.requestPermissions();

            // Pick directory
            const result = await FilePicker.pickDirectory();
            if (result.path) {
                setSelectedDir(result.path);
            }
        } catch (err) {
            console.error("Error picking folder:", err);
            setSelectedDir("Error: Unable to pick folder");
        }
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>

            <h1>Vite + React</h1>

            <div className="card">
                <button onClick={pickFolder}>Select Folder</button>
                {selectedDir && (
                    <p>
                        <strong>Selected folder:</strong> {selectedDir}
                    </p>
                )}
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>

            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
