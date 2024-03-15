import React, { useState, useEffect } from "react";
import * as ethService from "./ethService";
import "./App.css";
import { ethers } from "ethers";

//if not connected connect
const ConnectBtn = () => {
    const [buttonText, setButtonText] = useState("Conecting...");
    const handleClick = async () => {
        try {
            let userAddress = await ethService.getUserAddress();
            setButtonText(userAddress);
        } catch (error) {
            console.error("Error fetching user address:", error);
        }
    };
    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                const userAddress = await ethService.getUserAddress();
                setButtonText(userAddress);
                ethService.hasVoted;
            } catch (error) {
                console.error("Error fetching user address:", error);
                setButtonText("Error");
            }
        };

        if (window.ethereum) {
            fetchUserAddress();

            // Add an event listener for 'accountsChange'
            const handleAccountsChanged = async () => {
                handleClick();
            };

            // Add the event listener
            window.ethereum.on("accountsChanged", handleAccountsChanged);

            // Cleanup the event listener when the component is unmounted
            return () => {
                window.ethereum.off("accountsChanged", handleAccountsChanged);
            };
        }
    }, []);
    return <button className="conection">{buttonText}</button>;
};

const CandidateForm = ({ remainingTime }) => {
    const [inputValue, setInputValue] = useState(""); // State to store input value
    const [loading, setLoading] = useState(false); // State to manage loading state

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value when it changes
    };

    const handleButtonClick = async () => {
        setLoading(true); // Set loading state to true when "Become candidate!" button is clicked
        try {
            await ethService.addCandidate(inputValue);
            setInputValue(""); // Clear input value after successful addition
        } catch (error) {
            // Error handling is already done in addCandidate function, so no need for additional handling here
        } finally {
            setLoading(false); // Reset loading state whether an error occurred or not
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
    const [inputValue, setInputValue] = useState(""); // State to store input value
    const [loading, setLoading] = useState(false); // State to manage loading state

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value when it changes
    };

    const handleButtonClick = async () => {
        setLoading(true); // Set loading state to true when vote button is clicked
        let has = await ethService.hasVoted();
        if (has) {
            alert("already voted!");
            setLoading(false);
            return;
        }
        try {
            ethService.vote(inputValue);
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
                const candidates = await ethService.getCandidates();
                setCandidates(candidates);
            } catch (error) {
                console.error("Error getting candidates:", error);
            }
        };
        fetchCandidates();
        const interval = setInterval(fetchCandidates, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchRemainingTime = async () => {
            try {
                const time = await ethService.getRemainingTime();
                setRemainingTime(time);
            } catch (error) {
                console.error("Error fetching remaining time:", error);
            }
        };
        fetchRemainingTime();
        const interval = setInterval(fetchRemainingTime, 20 * 1000); // Update every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
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
