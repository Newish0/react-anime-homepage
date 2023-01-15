import React from "react";
import logo from "./logo.png";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Anime from "./components/Anime";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="items-wrapper mid-container">
                    <Link to={"/"} className="clean-link">
                        <span>
                            <img src={logo} alt="logo" className="App-logo" />
                            <span className="App-name">LBox</span>
                        </span>
                    </Link>
                    {/* <span>Item 1</span>
                    <span>Item 2</span>
                    <span>Item 3</span>
                    <span>Item 4</span> */}
                </div>
            </header>

            <main className="App-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/anime/:id" element={<Anime />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
