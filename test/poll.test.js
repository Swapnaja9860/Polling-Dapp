const { assert } = require('chai');

const Poll = artifacts.require("Polling");

require('chai')
.use(require('chai-as-promised'))
.use(require('chai-string'))
.should()

contract ('Poll', ([owner, customer]) => {

    let poll_obj; 

    before(async() => {
        poll_obj = await Poll.new();
    })

    describe("Mock Poll deployed", async()=>{
        it("Test create poll", async()=> {
          await poll_obj.createPoll("Blockchain is here to stay", ["yes", "no"], {from : owner});
        //   let poll_data = await poll_obj.poll();
        //   let title = await poll_data["title"];
        //   assert.startsWith(title, "Blockchain");
        // equal is only used for numbers not strings 
        //   assert.equal(title, "Blockchain is here to stay")  
           
        })

        it("Test add vote", async()=> {
          await poll_obj.addVote("yes", {from : customer});
          let voter = await poll_obj.votes(customer);
          let vote = await voter["vote"];
          assert.startsWith(vote, "yes");
        //   let count = await poll_obj.voteCount("yes");
        //   assert.equal(count, 1);

        })

        it('test get winner functionality', async()=> {
          // this.timeout(3600);

          setTimeout(async() =>{
            let winner = await poll_obj.getWinner({from : customer});
            console.log(winner);
            assert.startsWith(winner, "adfg");
            });
          }, 3600);


        // TODO : testcase for winner make sure to add after the voting time
    })
})