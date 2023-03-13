import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";

import { TaskContractAddress } from "./config";
import { ethers } from "ethers";
import TaskAbi from "./abi/TaskContract.json";
const { abi } = require("./abi/TaskContract.json");
// const { ethers } = require("ethers");
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("metamask not delected");
        alert("Metamask not delected please install if not");
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("connected to ", chainId);
      const goerliChainId = "0x5";
      if (chainId !== goerliChainId) {
        alert("you are not connected to goerli");
      } else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("found accounts", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while conneecting to Metamask", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    let task = {
      taskText: input,
      isDeleted: false,
    };
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );
        TaskContract.addTask(task.taskText, task.isDeleted).then(() => {
          setTasks([...tasks, task]);
        });
      } else {
        console.log("ethereum is not available object doesnt exist");
      }
    } catch (error) {
      console.log(error);
    }
    setInput("");
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.provider();
        const signer = provider.getSigners();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );

        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.provider();
        const signer = provider.getSigners();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          abi,
          signer
        );

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
    connectWallet();
  }, []);

  return (
    <div>
      {currentAccount === "" ? (
        <center>
          <button className='button' onClick={connectWallet}>
            Connect Wallet
          </button>
        </center>
      ) : correctNetwork ? (
        <div className='App'>
          <h2>Task Management DApp</h2>
          <form action=''>
            <TextField
              id='outlined-basic'
              label='Make todo'
              variant='outlined'
              style={{ margin: "0px 5px" }}
              size='small'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant='contained' color='primary' onClick={addTask}>
              Add Task
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item)}
              ></Task>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
            {" "}
            Please connect to goerli and reload
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
