import { SHA256 } from 'crypto-js';
import { difficulty, miningReward } from './config';
import {
  TransactionConstructor,
  BlockConstructor,
} from './types';

//Declaring blueprint for transactions
export class Transaction implements TransactionConstructor {
  constructor(
    public fromAddress: string,
    public toAddress: string,
    public amount: number,
  ) {}
}

//Declaring blueprint for each Block with a hash made up of all its properties
class Block implements BlockConstructor {
  timeStamp: string | number;
  transactions: TransactionConstructor[];
  previousHash: string;
  hash: string;
  private nonce: number;

  constructor(timeStamp: string | number, transactions: Transaction[], previousHash = '') {
    this.timeStamp = timeStamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  //Create the hash based on all the class's properties so that any change in any property
  // will cause any subsequent blocks to be marked as false
  calculateHash() {
    return SHA256(
      this.timeStamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }
  // Block the ability for users to spam block transactions by requiring 'mining' with sufficient
  // computing power based on a certain number of 0s in the hash
  mineBlock(difficulty: number) {
    while (
      // Run while the indexes up to the difficulty are not all 0s
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      //Nonce provides a non important variable we can change on each run which will alter the hash
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block Mined : ', this.hash);
    console.log('Nonce : ', this.nonce);
  }
}

//==================//==================//==================//==================
//==================//==================//==================//==================

//Declaring blueprint for the Blockchain with a genesis block made
export class Blockchain {
  private chain: Block[];
  private readonly difficulty: number;
  private pendingTransactions: Transaction[]
  private readonly miningReward: number;

  constructor() {
    //Starting the chain with the genesis block
    this.chain = [this.createGenesisBlock()];
    //Add the difficulty for block mining, add to increase time between new block mines (number specified
    // will be the number of 0s a hash needs to have infront before it is created)
    this.difficulty = difficulty;
    //All the transactions made inbetween Blocks are included in this pending array and will be executed on the next hash generation
    this.pendingTransactions = [];
    //Reward for generating  hash
    this.miningReward = miningReward;
  }
  createGenesisBlock() {
    // Adding data to the first block aka genesis block to start the chain (0 is added as the prev hash because there is none for this block)
    return new Block(
      '02/04/2018',
      [new Transaction(null, 'Genesis Block', 0)],
      '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTransaction(miningRewardAddress: string) {
    //Sets the date of new blocks to the moment they are created and sets the transactions of the new block to all of the pending
    //transactions
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log('Block succesfully mined');

    this.chain.push(block);
    //Send the mining reward for mining a new hash to the mining reward address (since this block has just executed all the pending
    // transactions, we reset the pending transactions array to include only the reward transfer which will be executed once the next
    // block is mined )
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
  }

  //Gets a users balance by checking all transactions theyve made
  getBalanceOfAddress(address: string) {
    let balance = 0;

    //Loop through each block in the chain
    for (const block of this.chain) {
      // Then loop through each transaction in each individual block
      for (const transac of block.transactions) {
        //If you are the sender of the transaction, remove the amount of the transaction from your wallet
        if (transac.fromAddress === address) {
          balance -= transac.amount;
        }

        // If you are the receiver of the transaction, add the amount of the transaction to your wallet
        if (transac.toAddress === address) {
          balance += transac.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    //Looping from the second block (index 1) as not to include the genesis block
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      //   //Check if there is just something wrong with the hashing
      //   if (currentBlock.hash !== currentBlock.calculateHash()) {
      //     return false;
      //   }

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
