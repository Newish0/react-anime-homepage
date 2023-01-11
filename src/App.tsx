import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="items-wrapper">
                    <span>Item 1</span>
                    <span>Item 2</span>
                    <span>Item 3</span>
                    <span>Item 4</span>
                </div>
            </header>

            <main className="App-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/anime/:id"
                        element={null /* TODO COMPONENT */}
                    />
                </Routes>
            </main>
        </div>
    );
}

export default App;
