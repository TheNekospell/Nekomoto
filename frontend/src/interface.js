import {Contract, RpcProvider} from "starknet";
import nekomotoAbi from "./abi/nekomoto.json" assert {type: "json"};
import nekocoinAbi from "./abi/nekocoin.json" assert {type: "json"};
import prismAbi from "./abi/prism.json" assert {type: "json"};

// const BASE_URL = "https://api.nekomoto.xyz/api"
const BASE_URL = "http://localhost:8972/api"

export const NEKOMOTO_ADDRESS = "0x01878545224d2c514135026db0c0d0b6e11d26dbeecc1cc23ba90cc1b3b6cfdf"
export const NEKOCOIN_ADDRESS = "0x05a357b97222f7ac8bdae3fab9f0a9fbc2f6b9272d393cb5228beda350098175"
export const PRISM_ADDRESS = "0x055b02963367fad7b4fe4ae93a99483a8cc256f7324a02fd29f231e7400ce64b"

const provider = new RpcProvider({
    nodeUrl: "https://starknet-sepolia.public.blastapi.io",
})

export const nekomotoContract = new Contract(nekomotoAbi, NEKOMOTO_ADDRESS, provider)
export const nekocoinContract = new Contract(nekocoinAbi, NEKOCOIN_ADDRESS, provider)
export const prismContract = new Contract(prismAbi, PRISM_ADDRESS, provider)
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
                {name: "name", type: "felt"},
                {name: "chainId", type: "felt"},
                {name: "version", type: "felt"},
            ],
            Message: [{name: "content", type: "string"}],
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

    return {typedMessage, signature}
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

    claimRewardOfMint: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/reward/claimMint`, {
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
