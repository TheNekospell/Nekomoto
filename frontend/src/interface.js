import { Contract, RpcProvider, hash } from "starknet";
import nekomotoAbi from "./abi/nekomoto.json" assert { type: "json" };
import nekocoinAbi from "./abi/nekocoin.json" assert { type: "json" };
import prismAbi from "./abi/prism.json" assert { type: "json" };
import shardAbi from "./abi/temporalshard.json" assert { type: "json" };
import { useAccount } from "@starknet-react/core";

const BASE_URL = "https://api.nekomoto.xyz/api"
// const BASE_URL = "http://localhost:8972/api"

export const NEKOMOTO_ADDRESS = "0x042b24431afebcbfbe8f23c94b68012a9526efb8cd519cd85f0453a5dba3ac2e"
export const NEKOCOIN_ADDRESS = "0x03b11fb2ed953d3d4a1381019c93d0cd99843f1bd8588bdff1aab7d2aa099e9a"
export const PRISM_ADDRESS = "0x06039adc3b41cd0b98a4d9410b67837b06aa88a5f1523b8463c04afba4dad35a"
export const SHARD_ADDRESS = "0x019917c28a97fe3571497a030d17938c1f270922058a934e77b6d486e9939789"

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
