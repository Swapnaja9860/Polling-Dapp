import React from 'react';
import { useState } from 'react';

function Poll(props) {

  const [title, setTitle] = useState('');
  const [option, setOption] = useState('');
  const [seloption, setSeloption] = useState('');
  const [options, setOptions] = useState([]);
  const [ispollCreated, setIspollCreated] = useState(false);

  var pollTitle;
  const handleSubmit = (e) => {
        e.preventDefault();
        props.createPoll(title, options);
        setIspollCreated(true);
        pollTitle = title;
        // setTitle('')
  }
  const handleClick = async(e) => {
        await setOptions(oldArray => [...oldArray, option]);
        setOption('');
  }
  const handleSubmitVote = (e) => {
        e.preventDefault();
        props.addVote(seloption);
  }

  const handleChange = event => {
    console.log(event.target.value);
    setSeloption(event.target.value)
  };

  return (
    <div>
    {!ispollCreated ?
    <div>
    <form onSubmit={handleSubmit} class="form-inline">
        <label><b>Add question for MCQ </b></label><br/>
        <input class='col-lg-4' type='text' placeholder='Title of the Poll' value={title} onChange={(e)=> setTitle(e.target.value)}></input><br/><br/>
       
        <div class="form-group col-lg-3">
          <label class="sr-only"><b>Add Multiple Choices </b></label><br/>
          <input type='text' placeholder='Add Options' value={option} onChange={(e)=> setOption(e.target.value)}></input>
          <button type='button' class="btn btn-primary btn-sm" onClick={handleClick}>Add Choice</button><br/><br/>
         </div>
        <button type='submit' class="btn btn-outline-primary btn-lg">Create</button>
    </form><br/><br/></div> : <h3></h3>}
    
    <form onSubmit={handleSubmitVote}>
    {ispollCreated ?
    <div>
    <h3>{title}</h3>
    
    {options.map((option) => {
        return <div class="form-check" style={{fontSize: 20}} key={option}>
                    <input 
                      type="radio"
                      class="form-check-input"
                      value={option}
                      name='poll'
                      onClick={(e) => handleChange(e)}
                    />
                    <label class="form-check-label">{option}</label>
                  </div>
    })}
    <br/><button class='btn btn-primary btn-lg' type='submit'>Vote</button>
    </div> : <h6 class="alert alert-info text-center col-lg-5">voting will start once poll is created</h6>
    }
   
    </form>
    </div>
  )
}

export default Poll;