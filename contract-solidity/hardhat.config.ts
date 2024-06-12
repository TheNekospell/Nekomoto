import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";

const { SEPOLIA_API_KEY, SEPOLIA_PRIVATEKEY, ETHERSCAN_API_KEY } =
	dotenv.config().parsed || {};

const config: HardhatUserConfig = {
	solidity: {
		version: "0.8.24",
		settings: { optimizer: { enabled: true, runs: 200 } },
	},

	networks: {
		sepolia: {
			url: `${SEPOLIA_API_KEY}`,
			accounts: [`${SEPOLIA_PRIVATEKEY}`],
		},
	},

	etherscan: {
		apiKey: {
			sepolia: `${ETHERSCAN_API_KEY}`,
		},
	},

	sourcify: {
		enabled: true,
	},
};

export default config;
