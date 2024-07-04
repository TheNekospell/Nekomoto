const BASE_URL = process.env.BACKEND

// const summonBox

export const BACKEND = {
    
    getSignText: async (address) => {
        const result = await fetch(`${BASE_URL}/generateSignature` + `?address=${address}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
        return await result.json()
    },
    
    verifySignature: async (address, typedData, signature) => {
        const result = await fetch(`${BASE_URL}/valid`, {
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
