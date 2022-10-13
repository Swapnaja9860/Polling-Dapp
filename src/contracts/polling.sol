pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

// import "truffle/Console.sol";

// pragma solidity >= 0.7.0<0.9.0;

contract Polling {
    // TODO : check variable names if required rename it
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    struct Poll {
        string title;
        string[] options;
    }

    struct Vote {
        string vote;
        bool voted;
    }

    // Voter[] public voters;
    Poll public poll;
    bool public isPoll;

    // dict of voter and their vote data
    mapping(address => Vote) public votes;
    // each option and their vote count
    mapping(string => uint256) public voteCount;

    uint256 public pollStart;
    uint256 public pollEnd;

    enum State {
        beforeStart,
        afterEnd,
        running
    }

    State public pollState;

    event GetWinner(string winner, uint256 voteCount);
    event Voters(address voter, string option);

    modifier PollCreated() {
        require(isPoll == true, "Poll is not created");
        _;
    }

    function getState() public view returns (State) {
        if (block.timestamp < pollStart) {
            return State.beforeStart;
        } else if (block.timestamp >= pollStart && block.timestamp <= pollEnd) {
            return State.running;
        } else {
            return State.afterEnd;
        }
    }

    function createPoll(string memory title, string[] memory options) public {
        require(msg.sender == owner, "Only admin");
        poll = Poll(title, options);
        isPoll = true;

        pollStart = block.timestamp;
        pollEnd = block.timestamp + 90; //1 hour=60*60 seconds; replace 60 with 3600 for an 1hr
    }

    //explicit getter function for struct because the default getter doesn't return mapping and arrays
    function getPoll() public view returns (Poll memory) {
        return poll;
    }

    function exists(string memory option) public view returns (bool) {
        for (uint256 i = 0; i < poll.options.length; i++) {
            if (
                keccak256(abi.encodePacked((poll.options[i]))) ==
                keccak256(abi.encodePacked((option)))
            ) {
                return true;
            }
        }
        return false;
    }

    function addVote(string memory option) public PollCreated {
        pollState = getState();
        require(pollState == State.running, "voting period ended");
        // add require to check option is valid option is in poll.options
        require(exists(option) == true, "Invalid Option");
        require(msg.sender != owner, "Owner can't vote");
        require(votes[msg.sender].voted != true, "Already voted");
        votes[msg.sender].vote = option;
        votes[msg.sender].voted = true;
        voteCount[option] += 1;

        emit Voters(msg.sender, option);
    }

    function getWinner() public PollCreated returns (string memory winOption) {
        pollState = getState();
        require(pollState == State.afterEnd, "voting is going on");
        uint256 maxCount = 0;
        for (uint256 i = 0; i < poll.options.length; i++) {
            if (voteCount[poll.options[i]] > maxCount) {
                maxCount = voteCount[poll.options[i]];
                winOption = poll.options[i];
            }
        }
        // Console.log(winOption);
        emit GetWinner(winOption, maxCount);
        return winOption;
    }
}
