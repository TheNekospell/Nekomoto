import { expect } from "chai";
import hre from "hardhat";

describe("Summon", function () {
	it("", async function () {
		const [owner, player1, player2] = await hre.ethers.getSigners();
		console.log(`owner: ${await owner.getAddress()}`);

		const nekoSpirit = await hre.ethers.deployContract("Box", [], owner);
		console.log(`Box deployed to ${await nekoSpirit.getAddress()}`);

		const nekoCoin = await hre.ethers.deployContract(
			"Neko",
			[owner.address],
			owner
		);
		console.log(`Neko deployed to ${await nekoCoin.getAddress()}`);

		const prism = await hre.ethers.deployContract("Prism", [], owner);
		console.log(`Prism deployed to ${await prism.getAddress()}`);

		const shard = await hre.ethers.deployContract("TemporalShard", [], owner);
		console.log(`Shard deployed to ${await shard.getAddress()}`);

		await nekoSpirit.init(
			await nekoCoin.getAddress(),
			await prism.getAddress(),
			await shard.getAddress()
		);

		await nekoCoin
			.connect(owner)
			.transfer(player1.address, 1000000000000000000000000000n);
		await prism
			.connect(owner)
			.mint(player1.address, 1000000000000000000000000000n);
		for (let i = 0; i < 10; i++) {
			await shard.connect(owner).mint(player1.address);
		}

		await nekoCoin
			.connect(player1)
			.approve(await nekoSpirit.getAddress(), 1000000000000000000000000000n);
		await prism
			.connect(player1)
			.approve(await nekoSpirit.getAddress(), 1000000000000000000000000000n);
		await shard
			.connect(player1)
			.setApprovalForAll(await nekoSpirit.getAddress(), true);

		await nekoSpirit.connect(owner).summon(player1.address, 10, 898989);

		await nekoSpirit.connect(player1).stake([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

		expect((await nekoSpirit.ownerOf(1)) === owner.address);
		// console.log(await nekoCoin.balanceOf(player1.address));
		// console.log(
		// 	await nekoCoin.allowance(player1.address, await nekoSpirit.getAddress())
		// );

		for (let i = 0; i < 13; i++) {
			await nekoSpirit.connect(player1).upgrade(6);
		}

		expect((await nekoSpirit.generate(6, false)).level === 13n);

		await nekoSpirit.connect(player1).startTimeFreeze(1);

		expect(nekoSpirit.timeFreeze(player1.address));

		for (let i = 0; i < 9; i++) {
			await nekoSpirit.connect(player1).upgradeAscend();
		}

		expect((await nekoSpirit.ascend(player1.address))[0] === 9n);

		await nekoSpirit.connect(player1).starterPack();
	});
});
