require("dotenv").config()

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(String(API_URL));

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x60512d06103a3092f6c7dc3bb5e5ee3441627dbe"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(String(PUBLIC_KEY), 'latest');

   //the transaction
   const trx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
  };    

  const signPromise = web3.eth.accounts.signTransaction(trx, String(PRIVATE_KEY))
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        String(signedTx.rawTransaction),
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })  
}

mintNFT("ipfs://QmYkHgmHQei9DYVZ8Ee2gRRmwNLUyjgDP6ydiMyu5RcfEG")