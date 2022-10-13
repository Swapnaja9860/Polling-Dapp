import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Poll from "./Poll";
import React from 'react';
import Polling from '../truffle_abis/Polling.json';
import { useState, useEffect } from 'react';
import HistogramChart from './HistogramChart';

const Web3 = require('web3')

function App() {

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [votes, setVotes] = useState([]);
  const [poll_contract, setPollContract] = useState({});
  const [quePoll, setquePoll] = useState({'title': '', 'options': []});
  const [winner, setWinner] = useState('');
  
  useEffect(() => {
    loadWeb3();
    loadAccount();
  }, []);

  const loadWeb3 = async ()=> {
    if(window.etherum){
      window.web3 = new Web3(window.etherum);
      await window.etherum.enable();
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert("No etherum extension in browser detected");
    }
  }

  const getCurrentAccount = async ()=> {
    // const web3 = window.web3;

    let curraccounts = await window.web3.eth.requestAccounts();
    console.log("================curraccounts==================")
    console.log(curraccounts)
    return curraccounts
  }
  const loadAccount = async ()=> {
    const accounts = await getCurrentAccount();
    console.log("================accounts==================")
    console.log(accounts)
    setAccounts(accounts);
    
    const web3 = window.web3;
    // below steps are to get contract address from abi's json
    // get newtork_id from metamask or web3
    const networkID = await web3.eth.net.getId();
    const pollData = Polling.networks[networkID];

    if(pollData){
      // this function gives us a object of contract to
      // access methods and data of contract
      const poll_contract = new web3.eth.Contract(Polling.abi, pollData.address)
      setPollContract(poll_contract);
      //  poll.methods.voteCount();      
    }

  }

  //create poll function
  const createPoll = async(title, options) => {
    setLoading(true);
    await poll_contract.methods.createPoll(title, options).send({ from: accounts[0] }).on('transactionHash', (hash) => {
        setLoading(false);
    })
    const newPoll = await poll_contract.methods.getPoll().call({ from: accounts[0] })
    setquePoll(newPoll)
  
  }

  //add vote function
  const addVote = async(option) => {
    setLoading(true);
    let currrentAcc = await getCurrentAccount()
    await poll_contract.methods.addVote(option).send({ from: currrentAcc[0]}).on('transactionHash', (hash) => {
        setLoading(false);
    })
    
    // await getVoteCount(option);
    // setquePoll(newPoll)

    // console.log("================account==================")
    // console.log(account)
  }

  const getVoteCount = async(option) => {
    const voteCount = await poll_contract.methods.voteCount(option).call({ from: accounts[0]})
    console.log("================voteCount==================")
    console.log(voteCount)
    return voteCount
  }


  //get winner function
  const getWinner = async() => {
    // setLoading(true);
    let currrentAcc = await getCurrentAccount()
    // const win = await poll_contract.methods.getWinner().send({ from: currrentAcc[0]}).on('transactionHash', (hash) => {
    //     setLoading(false);
    // })
    const win = await poll_contract.methods.getWinner().call({ from: currrentAcc[0]})
    console.log("======================win=================")
    console.log(win)
    console.log(typeof win)
    setWinner(win);  
    let voteOption = [];
    await quePoll.options.map(async(option) => {
        let voteCount = await getVoteCount(option);
        voteOption.push({
          'option' : option,
          'count' : voteCount
        })
    })
    console.log("======================voteOption==================")
    console.log(voteOption)
    setVotes(voteOption);
  }


  return (
    <div className="App">
      <Poll createPoll={createPoll} addVote={addVote}/>
      {console.log("======quePoll=============")} 
      {console.log(quePoll.title)}
      {console.log(quePoll.options)}
      
      {/* <h2>{loading}</h2> */}
      {/* { quePoll.options ?
      <div> */}
      <h3>VoteCount</h3>
      {votes.map(vote => {
        return <div>{vote.option} : {vote.count} </div>
      })}
      {/* </div> :
      <h1>Please Vote</h1>

    } */}
    <button type='button' onClick={() => getWinner()}>Winner</button>
    <h3>Winner</h3>
    <h3>{winner}</h3>
    <HistogramChart votes={votes}/>
    {/* {winner ?
    <div>
        <h2> Winner</h2>
        <h3>{winner}</h3>
    </div> : <h2>Please wait to end voting period to see result</h2>
    } */}
    </div>
  );
}

export default App;
