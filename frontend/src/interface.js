const BASE_URL = "http://localhost:8972/api"

// const summonBox

export const BACKEND = {

    getSignText: async (address) => {
        const result = await fetch(`${BASE_URL}/address/generateSignature?address=${address}`, {
            method: "GET",
            // headers: {
            //     "Content-Type": "application/json",
            // },
        })
        console.log("result: ", result)
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
                typedData,
                signature
            })
        })
    }
}
