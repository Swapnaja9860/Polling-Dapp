import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Poll from "./Poll";
import React from 'react';
import Polling from '../truffle_abis/Polling.json';
import { useState, useEffect } from 'react';
import HistogramChart from './HistogramChart';

const Web3 = require('web3')

function App() {

  const [accounts, setAccounts] = useState([]);
  const [votes, setVotes] = useState([]);
  const [poll_contract, setPollContract] = useState({});
  const [quePoll, setquePoll] = useState({'title': '', 'options': []});
  const [winner, setWinner] = useState('');
  
  useEffect(() => {
    loadWeb3();
    loadAccount();
  }, []);

  // create a web3 object
  const loadWeb3 = async ()=> {
    if(window.etherum){
      window.web3 = new Web3(window.etherum);
      await window.etherum.enable();
      window.web3.eth.handleRevert = true
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert("No etherum extension in browser detected");
    }
  }

  // get the account that is selected in metamask
  const getCurrentAccount = async ()=> {
    // const web3 = window.web3;
    let curraccounts = await window.web3.eth.requestAccounts();
    return curraccounts
  }
  
  const loadAccount = async ()=> {
    const accounts = await getCurrentAccount();
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
   
    await poll_contract.methods.createPoll(title, options).send({ from: accounts[0] }).on('transactionHash', (hash) => {
        console.log("Transaction successful")
    })
    const newPoll = await poll_contract.methods.getPoll().call({ from: accounts[0] })
    setquePoll(newPoll)
  
  }

  //add vote function
  const addVote = async(option) => {
   
    let currrentAcc = await getCurrentAccount()
  
    try{
      await poll_contract.methods.addVote(option).send({ from: currrentAcc[0]}).on('transactionHash', (hash) => {
      console.log("Transaction successful")
    })
     
    }
    catch(err){
      var errorMessageInJson = JSON.parse(
          err.message.slice(err.message.indexOf('data')+6, err.message.length-3)
        );
      var errorMessageToShow = errorMessageInJson.data[Object.keys(errorMessageInJson.data)[0]].reason;
      alert(errorMessageToShow);
    }    
    // await getVoteCount(option);
    // setquePoll(newPoll)
  }

  const getVoteCount = async(option) => {
    const voteCount = await poll_contract.methods.voteCount(option).call({ from: accounts[0]})
    return voteCount
  }


  //get winner function
  const getWinner = async() => {
    setVotes([]);
    
    try{
      const win = await poll_contract.methods.getWinner().call({ from: accounts[0]})
      setWinner(win);  
    }catch(err){
      var errorMessageInJson = JSON.parse(
          err.message.slice(24, err.message.length)
        );
      var errorMessageToShow = errorMessageInJson.data[Object.keys(errorMessageInJson.data)[0]].reason;
      alert(errorMessageToShow);
    }
    // let votes = [];
    await quePoll.options.map(async(option) => {
        let voteCount = await getVoteCount(option);
        setVotes((prevState)=> [...prevState,{
          'option' : option,
          'count' : voteCount
        } ])
    })
  }


  return (
    <div className="App" style={{
        backgroundColor: '#c4d7f5',
        width : '100%',
        height : '800px'
      }}>
      <div style={{
        backgroundColor: 'black',
        width : '100%',
        height : '100px',
        color: '#c4d7f5',
        margin: '0'
      }}><h1>Polling System</h1> 
      <small>Create your own poll so that users can vote and get the results</small></div>

      <br/>
      <Poll createPoll={createPoll} addVote={addVote}/>
    
    {/* <button type='button' class='btn btn-primary btn-lg' disabled={!votes.length} onClick={() => getWinner()}>Get the Winner</button> */}
    {/* <button type='button' onClick={() => getWinner()}>Get the Winner</button> */}
    <br/><a style={{ cursor:"pointer" , color:'blue', font:'15'}} onClick={() => getWinner()}>Get the Winner</a>
  
    {winner && votes.length ?
    <div>
        <HistogramChart votes={votes}/>
        <center><h4> Most selected option is <b>'{winner}'</b></h4></center>
    </div> : <h2></h2>
    }
    </div>
  );
}

export default App;
