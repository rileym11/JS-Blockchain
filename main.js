const SHA256 = require('crypto-js/sha256');

//Declaring blueprint for each Block with a hash made up of all its properties
class Block {
  constructor(index, timeStamp, data, previousHash = '') {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  //Create the hash based on all the class's properties so that any change in any property
  // will cause any subsequent blocks to be marked as false
  calculateHash() {
    return SHA256(
      this.index +
        this.timeStamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }
  // Block the ability for users to spam block transactions by requiring 'mining' with sufficient
  // computing power based on a certain number of 0s in the hash
  mineBlock(difficulty) {
    while (
      // Run while the indexes up to the difficulty are not all 0s
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      //Nonce provides a non important variable we can change on each run
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block Mined : ', this.hash);
  }
}

//==================//==================//==================//==================
//==================//==================//==================//==================

//Declaring blueprint for the Blockchain with a genesis block made
class Blockchain {
  constructor() {
    //Starting the chain with the genesis block
    this.chain = [this.createGenesisBlock()];
    //Add the difficulty for block mining, add to increase time between new block mines (number specified
    // will be the number of 0s a hash needs to have infront before it is created)
    this.difficulty = 5;
  }
  createGenesisBlock() {
    // Adding data to the first block aka genesis block to start the chain (0 is added as the prev hash because there is none for this block)
    return new Block(0, '02/04/2018', 'Genesis Block', '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  isChainValid() {
    //Looping from the second block (index 1) as not to include the genesis block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      //Check if there is just something wrong with the hashing
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      //Check if the current blocks hash does not match up with the prev blocks hash e.g. something
      //in the previous block has been tampered with
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    //If no problems return true (It's valid)
    return true;
  }
}

let rileyCoin = new Blockchain();

//Create blocks

console.log('Mining block 1...');
rileyCoin.addBlock(new Block(1, '03/04/2018', { amount: 4 }));
console.log('Mining block 2...');
rileyCoin.addBlock(new Block(2, '05/04/2018', { amount: 6 }));
console.log('Mining block 3...');
rileyCoin.addBlock(new Block(3, '07/04/2018', { amount: 36 }));

// Node this file to see the whole blockchain with below log

// console.log(JSON.stringify(rileyCoin, null, 4));

//Node this file to see if the chain is valid with below log and add overide changes to see outcome

// console.log('First Is chain valid? : ', rileyCoin.isChainValid());
// rileyCoin.chain[1].data = { amount: 1000 }; // Change the value exchanged (try to steal an extra 996)
// rileyCoin.chain[1].calculateHash(); // Re calculate the hash
// console.log('Second Is chain valid? : ', rileyCoin.isChainValid());
