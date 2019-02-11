export interface TransactionConstructor {
  fromAddress: string;
  toAddress: string;
  amount: number;
}
export interface BlockConstructor {
  previousHash: string;
  transactions: TransactionConstructor[];
  timeStamp: string | number;
}