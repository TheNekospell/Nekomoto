const express = require("express");
const { Account, cairo, CallData, Contract, json, RpcProvider, uint256 } = require('starknet');
require('dotenv').config()


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const provider = new RpcProvider({
    nodeUrl: "https://rpc-sepolia.staging.nethermind.dev",
});
// console.log("provider", provider);

const account = new Account(provider, process.env.ACCOUNT_ADDRESS, process.env.PRIVATE_KEY);

app.post("/valid", async function (req, res) {
    console.log("-----------------valid ")

    try {
        const { address, typedMessage, signature } = req.body

        console.log("valid: ", address, typedMessage, signature)

        acc = new Account(provider, address, "0xaaa")
        const result = await acc.verifyMessage(typedMessage, signature)
        console.log("result: ", result)
        res.send(result)
    } catch (e) {
        console.log("valid error: ", e)
        res.status(500).send(e)
        return
    }

})

app.post("/send", async function (req, res) {
    console.log("-----------------send ")
    try {
        // console.log("req.body: ", req.body)

        const { to, nekocoin, prism, nft } = req.body;
        if (!to) {
            res.status(500).send("to is required");
            return;
        }

        console.log("send: ", to, nekocoin, prism, nft)


        let arr = []
        // console.log("arr: ", arr)

        if (nekocoin) {
            arr.push({
                contractAddress: process.env.NEKO_CONTRACT_SN,
                entrypoint: "transfer",
                calldata: CallData.compile({
                    recipient: to,
                    amount: cairo.uint256(BigInt(nekocoin)),
                })
            })
        }

        if (prism) {
            arr.push({
                contractAddress: process.env.PRISM_CONTRACT_SN,
                entrypoint: "mint",
                calldata: CallData.compile({
                    recipient: to,
                    amount: cairo.uint256(BigInt(prism)),
                })
            })
        }

        if (nft) {
            arr.push({
                contractAddress: process.env.SHARD_CONTRACT_SN,
                entrypoint: "mint",
                calldata: CallData.compile({
                    recipient: to,
                    count: cairo.uint256(BigInt(nft)),
                })
            })
        }

        if (!arr.length) {
            res.status(500).send("nekocoin or prism or nft is required");
            return;
        }

        const multicall = await account.execute(arr, {
            maxFee: 10 ** 15
        })

        const result = await account.waitForTransaction(multicall.transaction_hash)
        // console.log("result: ", result)

        res.send(multicall.transaction_hash)

    } catch (e) {

        console.log("send error: ", e)
        res.status(500).send(e)
        return

    }

})

app.post("/summon", async function (req, res) {
    console.log("-----------------summon ")
    try {

        const { to, count, random } = req.body;
        if (!to) {
            res.status(500).send("to is required");
            return;
        }
        console.log("summon: ", to, count, random)

        const multicall = await account.execute([{
            contractAddress: process.env.BOX_CONTRACT_SN,
            entrypoint: "summon",
            calldata: CallData.compile({
                recipient: to,
                count: cairo.uint256(BigInt(count)),
                random: cairo.uint256(BigInt(random)),
            })
        }])
        const result = await account.waitForTransaction(multicall.transaction_hash)
        // console.log("result: ", result)

        res.send(multicall.transaction_hash)

    } catch (e) {

        console.log("summon error: ", e)
        res.status(500).send(e)
        return

    }

})

app.post("/burn", async function (req, res) {
    console.log("-----------------burn ")
    try {

        const { count } = req.body;
        if (!count) {
            res.status(500).send("count is required");
            return;
        }

        console.log("burn: ", count)

        const multicall = await account.execute([{
            contractAddress: process.env.NEKO_CONTRACT_SN,
            entrypoint: "burn",
            calldata: CallData.compile({
                count: cairo.uint256(BigInt(count)),
            })
        }])
        const result = await account.waitForTransaction(multicall.transaction_hash)
        // console.log("result: ", result)

        res.send(multicall.transaction_hash)

    } catch (e) {
        console.log("burn error: ", e)
        res.status(500).send(e)
        return
    }
})


app.listen(8973, function () {
    console.log("Server is running on port 8973");
})