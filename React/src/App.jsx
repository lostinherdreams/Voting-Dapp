import React, { useState, useEffect } from "react";
import * as ethService from "./ethService";
import "./App.css";
import { ethers } from "ethers";

//if not connected connect
const ConnectBtn = () => {
    const [buttonText, setButtonText] = useState("Connecting...");

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const userAddress = await ethService.getUserAddress();
                setButtonText(userAddress);
            } catch (error) {
                console.error("Error fetching user address:", error);
                setButtonText("Error");
            }
        };

        if (window.ethereum) {
            fetchUserAddress();

            const handleAccountsChanged = async () => {
                fetchUserAddress();
            };

            window.ethereum.on("accountsChanged", handleAccountsChanged);

            return () => {
                window.ethereum.off("accountsChanged", handleAccountsChanged);
            };
        }
    }, []);
    return <button className="conection">{buttonText}</button>;
};

const CandidateForm = ({ remainingTime }) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async () => {
        setLoading(true);
        try {
            await ethService.addCandidate(inputValue);
            setInputValue("");
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="addCandidates">
            <div className="form__group field">
                <input
                    type="input"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form__field"
                    placeholder="choose your ID"
                />
            </div>

            <button
                className="candidateBtn btn"
                onClick={handleButtonClick}
                disabled={!inputValue.trim() || remainingTime <= 0 || loading}
            >
                {loading ? "Adding Candidate..." : "Become candidate!"}
            </button>
        </div>
    );
};

const VoteForm = ({ remainingTime }) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async () => {
        setLoading(true);
        let has = await ethService.hasVoted();
        if (has) {
            alert("already voted!");
            setLoading(false);
            return;
        }
        try {
            await ethService.vote(inputValue);
            setInputValue("");
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vote">
            <div className="form__group field">
                <input
                    type="input"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form__field"
                    placeholder="candidate id"
                />
            </div>

            <button
                className="candidateBtn btn"
                onClick={handleButtonClick}
                disabled={!inputValue.trim() || remainingTime <= 0 || loading}
            >
                {loading ? "Voting..." : "Vote"}
            </button>
        </div>
    );
};

const App = () => {
    const [remainingTime, setRemainingTime] = useState(0);
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                console.log("why");
                const candidates = await ethService.getCandidates();

                setCandidates(candidates);
            } catch (error) {
                console.log("Error getting candidates:", error);
            }
        };
        fetchCandidates();
        const interval = setInterval(fetchCandidates, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchRemainingTime = async () => {
            try {
                const time = await ethService.getRemainingTime();
                setRemainingTime(time);
            } catch (error) {
                console.log("Error fetching remaining time:", error);
            }
        };
        fetchRemainingTime();
        const interval = setInterval(fetchRemainingTime, 20 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <div className="header">
                <div className="top-left">
                    <h1>Voting App</h1>
                </div>
                <div className="top-right">
                    <ConnectBtn />
                </div>
            </div>
            <div className="body">
                <div className="canditates-parent">
                    <h2 className="topic">Candidates</h2>
                    <div
                        style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            minWidth: "500px",
                        }}
                        className="scrollable-container"
                        id="scrollbar1"
                    >
                        <table>
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Name</th>
                                    <th>Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr
                                        key={index}
                                        style={{
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? "lightgray"
                                                    : "#ddd",
                                        }}
                                    >
                                        <td className="hj">{index + 1}</td>
                                        <td>{candidate[1]}</td>
                                        <td className="hj">
                                            {candidate[2].toString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="time">
                    <p>Remaining Time: {remainingTime} days left</p>
                </div>
                <div className="fildes">
                    <CandidateForm />
                    <VoteForm />
                </div>
            </div>
        </div>
    );
};

export default App;
