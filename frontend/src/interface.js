import { Contract, RpcProvider, hash } from "starknet";
import nekomotoAbi from "./abi/nekomoto.json" assert { type: "json" };
import nekocoinAbi from "./abi/nekocoin.json" assert { type: "json" };
import prismAbi from "./abi/prism.json" assert { type: "json" };
import shardAbi from "./abi/temporalshard.json" assert { type: "json" };
import { useAccount } from "@starknet-react/core";

const BASE_URL = "https://api.nekomoto.xyz/api"
// const BASE_URL = "http://localhost:8972/api"

export const NEKOMOTO_ADDRESS = "0x032bf65bdf7fda6c87f738b94203de2e624702cc9373114ac212de2ba89acc6a"
export const NEKOCOIN_ADDRESS = "0x00bb7546cc8fb47530464e39e8effb8ec17ebd9faef7e5a3537a4e6884f14984"
export const PRISM_ADDRESS = "0x060f0508a0cfdb8ffa81ee07db964a3de1ce6594cbccfd679b05611b52c6c707"
export const SHARD_ADDRESS = "0x04a7f4d8e3ebbfcb332b7ec425f0e8e41973a77aae654b5d420ca547fc268ae7"

const provider = new RpcProvider({
    nodeUrl: "https://rpc-sepolia.staging.nethermind.dev",
})

export const nekomotoContract = new Contract(nekomotoAbi, NEKOMOTO_ADDRESS, provider)
export const nekocoinContract = new Contract(nekocoinAbi, NEKOCOIN_ADDRESS, provider)
export const prismContract = new Contract(prismAbi, PRISM_ADDRESS, provider)
export const shardContract = new Contract(shardAbi, SHARD_ADDRESS, provider)
export const waitTx = async (hash) => {
    return await provider.waitForTransaction(hash)
}

export const sign = async (account) => {
    // if (!address || !isConnected) return;

    const text = (await BACKEND.getSignText(account.address)).data;
    console.log("text: ", text);

    const typedMessage = {
        domain: {
            name: "Nekomoto",
            chainId: "SN_SEPOLIA",
            version: "0.1.0",
        },
        types: {
            StarkNetDomain: [
                { name: "name", type: "felt" },
                { name: "chainId", type: "felt" },
                { name: "version", type: "felt" },
            ],
            Message: [{ name: "content", type: "string" }],
        },
        primaryType: "Message",
        message: {
            content: text,
        },
    };

    const signature = await account.signMessage(typedMessage);
    // console.log("signature: ", signature);

    const messageHash = await account.hashMessage(typedMessage)
    // console.log("messageHash: ", messageHash);

    return { typedMessage, signature }
};

export const BACKEND = {

    getSignText: async (address) => {
        const result = await fetch(`${BASE_URL}/address/generateSignature?address=${address}`)
        // console.log("result: ", result)
        return await result.json()
    },

    verifySignature: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/address/valid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    summonBox: async (address, count, typedData, signature) => {
        // console.log("summonBox: ", address, count, typedData, signature)
        const result = await fetch(`${BASE_URL}/box/summon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                count,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    openChest: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/chest/open`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    empowerChest: async (address1, address2, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/chest/empower`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address1,
                address2,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    addressInfo: async (address) => {
        const result = await fetch(`${BASE_URL}/address/info?address=${address}`)
        // console.log("result: ", result)
        return await result.json()
    },

    acceptInvitation: async (address, code, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/address/invitation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                code,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    claimReward: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/reward/claim`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    claimRewardOfInvitation: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/reward/claimInv`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                signature: {
                    signature,
                    typedData,
                }
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    staticInfo: async () => {
        const result = await fetch(`${BASE_URL}/static/info`)
        // console.log("result: ", await result.json())
        return await result.json()
    },

    getPriceUSD: async () => {
        const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d")
        return await response.json();
    },

    activeAddress: async (address, code) => {
        const result = await fetch(`${BASE_URL}/address/active`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address,
                code
            })
        })
        // console.log("result: ", result)
        return await result.json()
    },

    faucet: async (address) => {
        const result = await fetch(`${BASE_URL}/nike/faucet?address=${address}`)
        // console.log("result: ", result)
        return await result.json()
    },

}

export function addCommaInNumber(number, b) {
    if (!number) {
        return "0";
    }

    const numberString = number.toString();

    const parts = numberString.split(".");
    parts[0] = parts[0].length > 3 ? parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") : parts[0];
    if (b) {
        parts[1] = parts[1] ? parts[1] : "";
    } else {
        parts[1] = parts[1] ? parts[1].substring(0, 2) : "";
    }

    return parts[1] ? parts.join(".") : parts[0];
}
