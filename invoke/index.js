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

app.post("/send", async function (req, res) {
    console.log("-----------------send ")
    try {
        // console.log("req.body: ", req.body)



        const { to, nekocoin, prism, nft } = req.body;
        if (!to) {
            res.status(400).send("to is required");
            return;
        }


        let arr = []
        // console.log("arr: ", arr)

        if (nekocoin) {
            arr.push({
                contractAddress: process.env.NEKO_CONTRACT_SN,
                entrypoint: "transfer",
                calldata: CallData.compile({
                    recipient: to,
                    amount: cairo.uint256(nekocoin),
                })
            })
        }

        if (prism) {
            arr.push({
                contractAddress: process.env.PRISM_CONTRACT_SN,
                entrypoint: "mint",
                calldata: CallData.compile({
                    recipient: to,
                    amount: cairo.uint256(prism),
                })
            })
        }

        if (nft) {
            arr.push({
                contractAddress: process.env.SHARD_CONTRACT_SN,
                entrypoint: "mint",
                calldata: CallData.compile({
                    recipient: to,
                    count: cairo.uint256(nft),
                })
            })
        }

        if (!arr.length) {
            res.status(400).send("nekocoin or prism or nft is required");
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
        res.status(400).send(e)
        return

    }

})

app.post("/summon", async function (req, res) {
    console.log("-----------------summon ")
    try {

        const { to, count, random } = req.body;
        if (!to) {
            res.status(400).send("to is required");
            return;
        }

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
        res.status(400).send(e)
        return

    }

})

app.post("/burn", async function (req, res) {
    console.log("-----------------burn ")
    try {

        const { count } = req.body;
        if (!count) {
            res.status(400).send("count is required");
            return;
        }

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
        res.status(400).send(e)
        return
    }
})


app.listen(8973, function () {
    console.log("Server is running on port 8973");
})