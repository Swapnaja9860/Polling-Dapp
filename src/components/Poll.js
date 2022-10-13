import React from 'react';
import { useState } from 'react';

function Poll(props) {
   const [title, setTitle] = useState('');
   const [address, setAddress] = useState('');
   const [option, setOption] = useState('');
   const [seloption, setSeloption] = useState('');
   const [options, setOptions] = useState([]);

   const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(title)
        // console.log("================option===");
        // console.log(option);
        props.createPoll(title, options);
        setTitle('')
  }
  const handleClick = async(e) => {
        await setOptions(oldArray => [...oldArray, option]);
        setOption('');
        // console.log("================options===");
        // console.log(options);
  }
  const handleSubmitVote = (e) => {
        e.preventDefault();
        // console.log(title)
        // console.log("================option===");
        // console.log(option);
        props.addVote(seloption, address);
        setAddress('')
  }

  return (
    <div><h1>Polling System</h1>
    
    <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Title of the Poll' value={title} onChange={(e)=> setTitle(e.target.value)}></input><br/>
        <input type='text' placeholder='Add Options' value={option} onChange={(e)=> setOption(e.target.value)}></input>
        <button type='button' onClick={handleClick}>Add Option</button><br/>
        <button type='submit'>Create</button>
    </form>
    <form onSubmit={handleSubmitVote}>
      <input type='text' placeholder='address' value={address} onChange={(e)=> setAddress(e.target.value)}></input><br/>
    
    {options ?
    <div>
        <h2> Available Options</h2>
        { options.map(item => {
        return <button type='button' onClick={() => setSeloption(item)}>{item}</button>
    })}
    </div> : <h2>No Available Options</h2>
    }
    <button type='submit'>Vote</button>
    </form>
    
    </div>
  )
}

export default Poll;