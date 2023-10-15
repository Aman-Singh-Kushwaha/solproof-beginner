// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new keypair
    const from = Keypair.generate();
    //Wallet Balance of sender
    const fromWalletBalance = await connection.getBalance(new PublicKey(from.publicKey))

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();
    const toWalletBalance = await connection.getBalance(new PublicKey(to.publicKey))

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );
    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();
    
    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });
    
    console.log("Airdrop completed for the Sender account");
    
    console.log(`Balances before transaction: 
        sender: ${parseInt(fromWalletBalance)/ LAMPORTS_PER_SOL}.
        reciever: ${parseInt(toWalletBalance)/ LAMPORTS_PER_SOL}
    `)

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: (fromWalletBalance / 2 )*LAMPORTS_PER_SOL
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);

    console.log(`Balances after transaction: 
        sender: ${parseInt(fromWalletBalance)/ LAMPORTS_PER_SOL}.
        reciever: ${parseInt(toWalletBalance)/ LAMPORTS_PER_SOL}
    `)
}

transferSol();