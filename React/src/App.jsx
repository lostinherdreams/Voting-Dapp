import React, { useState, useEffect } from "react";
import * as ethService from "./ethService";
import "./App.css";
import { ethers } from "ethers";

const ConnectBtn = () => {
    const [buttonText, setButtonText] = useState("Connect");
    let flag = false;
    const handleClick = async () => {
        try {
            const userAddress = await ethService.getUserAddress();
            setButtonText(userAddress);
            flag = true;
        } catch (error) {
            console.error("Error fetching user address:", error);
        }
    };
    useEffect(() => {
        // Add an event listener for 'accountsChange'
        const handleAccountsChanged = async () => {
            if (flag) {
                const userAddress = await ethService.getUserAddress();
                handleClick(userAddress);
            }
        };

        if (window.ethereum) {
            // Add the event listener
            window.ethereum.on("accountsChanged", handleAccountsChanged);

            // Cleanup the event listener when the component is unmounted
            return () => {
                window.ethereum.off("accountsChanged", handleAccountsChanged);
            };
        }
    }, []);

    return (
        <button onClick={handleClick} className="conection">
            {buttonText}
        </button>
    );
};

const CandidateForm = ({ remainingTime, hasVoted }) => {
    const [inputValue, setInputValue] = useState(""); // State to store input value

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value when it changes
    };

    const handleButtonClick = async () => {
        await ethService.addCandidate(inputValue);
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
                disabled={!inputValue.trim() || remainingTime <= 0}
            >
                Become candidate!
            </button>
        </div>
    );
};

const VoteForm = ({ remainingTime, hasVoted }) => {
    const [inputValue, setInputValue] = useState(""); // State to store input value

    const handleInputChange = (event) => {
        setInputValue(event.target.value); // Update input value when it changes
    };

    const handleButtonClick = () => {
        ethService.vote(inputValue);
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
                disabled={!inputValue.trim() || remainingTime <= 0 || hasVoted}
            >
                Vote
            </button>
        </div>
    );
};

const App = () => {
    const [remainingTime, setRemainingTime] = useState(0);
    const [candidates, setCandidates] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);

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

    useEffect(() => {
        const fetchhasVoted = async () => {
            try {
                const has = await ethService.hasVoted();
                setHasVoted(has);
            } catch (error) {
                console.error("Error fetching voted or not:", error);
            }
        };
        fetchhasVoted();
        const interval = setInterval(fetchhasVoted, 1000); // Update every 10 seconds

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
                                                    : "transparent",
                                        }}
                                    >
                                        <td>{index}</td>
                                        <td>{candidate[1]}</td>
                                        <td>{candidate[2].toString()}</td>
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
