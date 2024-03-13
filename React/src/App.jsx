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
        <button onClick={handleClick} id="con">
            {buttonText}
        </button>
    );
};

const App = () => {
    const [candidates, setCandidates] = useState([]);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const fetchRemainingTime = async () => {
            try {
                const time = await ethService.getRemainingTime();
                setRemainingTime(time); // Assuming time is a BigNumber
            } catch (error) {
                console.error("Error fetching remaining time:", error);
            }
        };
        fetchRemainingTime();
        const interval = setInterval(fetchRemainingTime, 10000); // Update every 10 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    ethService.getCandidates()

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
                <div className="time">
                    <p>Remaining Time: {remainingTime} days left</p>
                </div>
            </div>
            {/* <div>
                <h2>Candidates</h2>
                <ul>
                    {candidates.map((candidate) => (
                        <li key={candidate.candidateAddress}>
                            {candidate.name}
                        </li>
                    ))}
                </ul>
            </div> */}{" "}
            {/* {remainingTime > 0 && !hasVoted && (
                <div>
                    <h2>Vote</h2>
                    <select
                        onChange={(e) => setSelectedCandidate(e.target.value)}
                    >
                        <option value="" disabled selected>
                            Select a candidate
                        </option>
                        {candidates.map((candidate) => (
                            <option
                                key={candidate.candidateAddress}
                                value={candidate.name}
                            >
                                {candidate.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={vote}>Vote</button>
                </div>
            )} */}
        </div>
    );
};

export default App;
