import { Contract, RpcProvider, hash } from "starknet";
import nekomotoAbi from "./abi/nekomoto.json" assert { type: "json" };
import nekocoinAbi from "./abi/nekocoin.json" assert { type: "json" };
import prismAbi from "./abi/prism.json" assert { type: "json" };
import shardAbi from "./abi/temporalshard.json" assert { type: "json" };
import { useAccount } from "@starknet-react/core";

const BASE_URL = "https://api.nekomoto.xyz/api"
// const BASE_URL = "http://localhost:8972/api"

export const NEKOMOTO_ADDRESS = "0x03067bc41893eb01563720f2215a3d30584da7d848cd7dad2f155148cf2f49e6"
export const NEKOCOIN_ADDRESS = "0x043326e1bd7b977d7b995f0a3b12e350ac2cce411c3353a04b15cfcf7faf68cf"
export const PRISM_ADDRESS = "0x07891304512ad1fc00ed93ef9588b42d8955ccf5802062ed210feca9c1c72c28"
export const SHARD_ADDRESS = "0x0493c698bddc00cb4459db277035b5aef098bbebe7d55b097964882a823bb247"

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
