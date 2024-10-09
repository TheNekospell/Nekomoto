import { useAccount } from "@starknet-react/core";
import { createContext, useContext, useState, useCallback } from "react";

export const ServerContext = createContext();

export const ServerProvider = ({ children }) => {
	const { address } = useAccount();
	const [serverData, setServerData] = useState({
		Uid: 0,
		Address: 0x0,
		IsStarter: true,
		Active: true,
		NekoSpiritIdList: [],
		NekoSpiritList: [],
		StaticTotalPower: "467676",
		StaticStakePool: "0",
		StaticTotalLuck: "0",
		StaticMintPool: "0",
		StakePoolToClaim: "0",
		MintPoolToClaim: "0",
		StaticEpoch: 1,
		MyPower: "0",
		MyLuck: 0,
		MySSR: 0,
		MyUR: 0,
		EstMintPoolReward: "0",
		EstStakePoolReward: "0",
	});

	const getServerData = () => {
		if (!address) return;
		BACKEND.addressInfo(address).then((result) => {
			console.log("address info: ", result.data);
			setServerData(result.data);
		});
	};

	return (
		<ServerContext.Provider value={{ serverData, getServerData }}>
			{children}
		</ServerContext.Provider>
	);
};

export const useServer = () => useContext(ServerContext);
