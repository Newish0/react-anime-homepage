import React from "react";
import logo from "./logo.png";
import "./App.css";
import {
    BrowserRouter,
    Link,
    Route,
    Routes,
    useLocation,
    Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Anime from "./components/Anime";
import Search from "./components/Search";

function App() {
    const { pathname } = useLocation();

    return (
        <div className="App">
            <header className="App-header">
                <div className="mid-container flex space-between">
                    <div className="item-wrapper">
                        <Link to={"/"} className="clean-link">
                            <span>
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="App-logo"
                                />
                                <span className="App-name">LBox</span>
                            </span>
                        </Link>
                    </div>

                    <div className="App-header-search">
                        <Search defaultQuery="" />
                    </div>

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
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
