import { ethers } from "hardhat";

async function main() {
	const [owner] = await ethers.getSigners();

	const Box = await ethers.getContractFactory("Box");
	const box = await Box.connect(owner).deploy();
	const boxAddress = await box.getAddress();
	console.log(`Box deployed to ${boxAddress}`);

	const Neko = await ethers.getContractFactory("Neko");
	const neko = await Neko.connect(owner).deploy(owner.address);
	const nekoAddress = await neko.getAddress();
	console.log(`Neko deployed to ${nekoAddress}`);

	const Prism = await ethers.getContractFactory("Prism");
	const prism = await Prism.connect(owner).deploy();
	const prismAddress = await prism.getAddress();
	console.log(`Prism deployed to ${prismAddress}`);

	const shard = await ethers.getContractFactory("TemporalShard");
	const shardDeploy = await shard.connect(owner).deploy();
	const shardAddress = await shardDeploy.getAddress();
	console.log(`Shard deployed to ${shardAddress}`);

	await box.connect(owner).init(nekoAddress, prismAddress, shardAddress);
	console.log(`Box initialized`);

	console.log(`Please copy the following address into your .env file:`);
	console.log(`BOX_CONTRACT=${boxAddress}`);
	console.log(`NEKO_CONTRACT=${nekoAddress}`);
	console.log(`PRISM_CONTRACT=${prismAddress}`);
	console.log(`SHARD_CONTRACT=${shardAddress}`);

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// npx hardhat run scripts/deploy.ts --network sepolia
// npx hardhat verify --network sepolia
