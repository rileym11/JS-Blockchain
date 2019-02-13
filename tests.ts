import { Blockchain, Transaction } from './main';

let rileyCoin = new Blockchain();


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

