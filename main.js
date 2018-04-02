const SHA256 = require('crypto-js/sha256');

//Declaring blueprint for each Block with a hash made up of all its properties
class Block {
  constructor(index, timeStamp, data, previousHash = '') {
    this.index = index;
    this.timeStamp = timeStamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }
  //Create the hash based on all the class's properties so that any change in any property
  // will cause any subsequent blocks to be marked as false
  calculateHash() {
    return SHA256(
      this.index +
        this.timeStamp +
        JSON.stringify(this.data) +
        this.previousHash
    ).toString();
  }
}

//Declaring blueprint for the Blockchain with a genesis block made
class Blockchain {
  constructor() {
    //Starting the chain with the genesis block
    this.chain = [this.createGenesisBlock()];
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
    newBlock.hash = newBlock.calculateHash();
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
rileyCoin.addBlock(new Block(1, '03/04/2018', { amount: 4 }));
rileyCoin.addBlock(new Block(2, '05/04/2018', { amount: 6 }));

// Node this file to see the whole blockchain with below log

// console.log(JSON.stringify(rileyCoin, null, 4));

//Node this file to see if the chain is valid with below log and add overide changes to see outcome

console.log('First Is chain valid? : ', rileyCoin.isChainValid());
rileyCoin.chain[1].data = { amount: 1000 }; // Change the value exchanged (try to steal an extra 996)
rileyCoin.chain[1].calculateHash(); // Re calculate the hash

console.log('Second Is chain valid? : ', rileyCoin.isChainValid());
