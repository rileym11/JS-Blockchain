# Typescript Blockchain
This project was a way for me to understand how blockchains work. It originally started in Javascript but
I have recently converted it to Typescript for a better understanding.

Step 1: Clone the repository
  ```bash
  $ git clone https://github.com/rileym11/Typescript-Blockchain
  ```
Step 2 (optional): Set the config in `config.ts`
  ```ts
  export const difficulty = 5; // how hard each block is to create (higher number = harder)
  export const miningReward = 10; // how many coins are users rewarded with for successful block creation
  ```
Step 3: Run the Blockchain!
  ```bash
  $ yarn && yarn start
  ```
