import {useAccount} from "@starknet-react/core";
import {createContext, useContext, useEffect, useState} from "react";
import {nekocoinContract, NEKOMOTO_ADDRESS, nekomotoContract, prismContract} from "@/interface.js";

export const ContractContext = createContext(undefined);

export const ContractProvider = ({children}) => {

    const {address} = useAccount();
    const [prism, setPrism] = useState(0);
    const [nekocoin, setNekocoin] = useState(0);
    const [prismAllowance, setPrismAllowance] = useState(0);
    const [nekocoinAllowance, setNekocoinAllowance] = useState(0);
    const [scroll, setScroll] = useState(0);

    const refreshContractData = () => {
        if (address) {
            prismContract.balance_of(address).then((result) => {
                // console.log("prism: ", result)
                setPrism(Number(result / BigInt(10 ** 18)));
            });
            nekocoinContract.balance_of(address).then((result) => {
                // console.log("nekocoin: ", result)
                setNekocoin(Number(result / BigInt(10 ** 18)));
            });
            prismContract.allowance(address, NEKOMOTO_ADDRESS).then((result) => {
                // console.log("prism allowance: ", result)
                setPrismAllowance(Number(result / BigInt(10 ** 18)));
            });
            nekocoinContract.allowance(address, NEKOMOTO_ADDRESS).then((result) => {
                // console.log("nekocoin allowance: ", result)
                setNekocoinAllowance(Number(result / BigInt(10 ** 18)));
            });
            nekomotoContract.check_coin(address).then((result) => {
                console.log("scroll: ", result)
                setScroll(Number(result));
            })
        } else {
            setPrism(0);
            setNekocoin(0);
            setPrismAllowance(0);
            setNekocoinAllowance(0);
            setScroll(0);
        }
    }

    useEffect(() => {
        refreshContractData();
    }, [address]);


    return (
        <ContractContext.Provider
            value={{scroll, prism, nekocoin, prismAllowance, nekocoinAllowance, refreshContractData}}>
            {children}
        </ContractContext.Provider>
    );
};

export const useContractData = () => useContext(ContractContext);
