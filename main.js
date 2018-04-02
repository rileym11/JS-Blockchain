const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timeStamp, transactions, previousHash = '') {
    this.timeStamp = timeStamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timeStamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block Mined : ', this.hash);
  }
}

//==================//==================//==================//==================
//==================//==================//==================//==================

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }
  createGenesisBlock() {
    return new Block('02/04/2018', 'Genesis Block', '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTransaction(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log('Block succesfully mined');
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transac of block.transactions) {
        if (transac.fromAddress === address) {
          balance -= transac.amount;
        }

        if (transac.toAddress === address) {
          balance += transac.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let rileyCoin = new Blockchain();

// Tests
//=======

//Node the file to see these tests
rileyCoin.createTransaction(new Transaction('addressUno', 'addressDos', 100));
rileyCoin.createTransaction(new Transaction('addressDos', 'addressUno', 50));

console.log('\n Starting the Miner....');
rileyCoin.minePendingTransaction('My-mothers-address'); //Mining with 'My Mothers Address', this would be a users id

console.log(
  '\n The balance of my mother is : ',
  rileyCoin.getBalanceOfAddress('My-mothers-address')
);

console.log('\n Starting the Miner....');
rileyCoin.minePendingTransaction('My-mothers-address');

//Here you will see the added reward balance from the first block mined since it went into the pending array
console.log(
  '\n The balance of my mother is : ',
  rileyCoin.getBalanceOfAddress('My-mothers-address')
);
//Is the chain valid?
console.log('Is chain valid? : ', rileyCoin.isChainValid());

// Node to see the whole blockchain with below log

// console.log(JSON.stringify(rileyCoin, null, 4));
