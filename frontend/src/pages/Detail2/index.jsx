import "./index.css";
import ClaimedCard from "@components/ClaimedCard/index";
import BoxCard from "@components/BoxCard/index";
import InviteCard from "@components/InviteCard/index";
import Button from "@components/Button/index";
import EmptyCard from "@components/EmptyCard/index";
import GemItem from "@components/GemItem/index";
import BoxBorder from "@components/BoxBorder/index";
import RadioButton from "@components/RadioButton/index";
import NekoModal from "@components/Modal/index";
import CardCorner from "@components/CardCorner/index";

import exclamation from "@assets/exclamation.png";
import copy from "@assets/copy.png";
import card1 from "@assets/card1.png";
import card2 from "@assets/card2.png";
import card3 from "@assets/card3.png";
import card4 from "@assets/card4.png";
import card5 from "@assets/card5.png";
import m1 from "@assets/modal-icon1.png";
import m2 from "@assets/modal-icon2.png";
import m3 from "@assets/modal-icon3.png";
import m4 from "@assets/modal-icon4.png";
import m5 from "@assets/modal-icon5.png";
import purple from "@assets/purple.png";
import blue from "@assets/blue.png";
import adept1 from "@assets/adept1.png";
import adept2 from "@assets/adept2.png";
import adept3 from "@assets/adept3.png";
import icon5 from "@assets/icon5.png";
import copySuccuess from "@assets/copy_success.png";

import arrowLeft from "@assets/arrow-left.png";
import { useAppStore } from "@stores/index";
import { useEffect, useState } from "react";

import { Col, Row, Flex, Select, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@starknet-react/core";
import {
	BACKEND,
	NEKOCOIN_ADDRESS,
	nekocoinContract,
	NEKOMOTO_ADDRESS,
	nekomotoContract,
	PRISM_ADDRESS,
	prismContract,
	SHARD_ADDRESS,
	shardContract,
	sign,
	addCommaInNumber,
} from "@/interface.js";
import { cairo, CallData } from "starknet";

export default function Detail() {
	const isMobile = useAppStore().device === "mobile";
	const navigate = useNavigate();
	const [isModalOpen1, setIsModalOpen1] = useState(false);
	const [isModalOpen2, setIsModalOpen2] = useState(false);
	const [isModalOpen3, setIsModalOpen3] = useState(false);
	const [isModalOpen4, setIsModalOpen4] = useState(false);
	const [isModalOpen5, setIsModalOpen5] = useState(false);
	const [modalText1, setModalText1] = useState("");
	const [ascendInfo, setAscendInfo] = useState(false);
	const [earningInfo, setEarningInfo] = useState(false);

	const { account, address, status, chainId, isConnected } = useAccount();
	const [addressInfo, setAddressInfo] = useState({});
	const [hhh, setHhh] = useState("");
	const [waiting, setWaiting] = useState(false);
	const [success, setSuccess] = useState("");
	const [prism, setPrism] = useState(0);
	const [nekocoin, setNekocoin] = useState(0);
	const [prismAllowance, setPrismAllowance] = useState(0);
	const [nekocoinAllowance, setNekocoinAllowance] = useState(0);
	const [shardApprove, setShardApprove] = useState(false);
	const [lucky, setLucky] = useState(false);
	const [copySuccess1, setCopySuccess1] = useState(false);
	const [nekoButton, setNekoButton] = useState("all");
	const [focus, setFocus] = useState({});
	const [chestDetail, setChestDetail] = useState({});
	const [info, setInfo] = useState({});

	const options = [
		{ value: "ALL", label: "ALL" },
		{ value: "LEGENDARY", label: "LEGENDARY" },
		{
			value: "EPIC",
			label: "EPIC",
		},
		{ value: "RARE", label: "RARE" },
		{ value: "UNCOMMON", label: "UNCOMMON" },
		{ value: "COMMON", label: "COMMON" },
	];

	useEffect(() => {
		BACKEND.staticInfo().then((result) => {
			console.log("static info: ", result.data);
			setInfo(result.data);
		});

		if (address) {
			BACKEND.addressInfo(address).then((result) => {
				console.log("address info: ", result.data);
				console.log(
					"my staking neko's mana:",
					result.data.NekoSpiritList.filter((x) => x.IsStaked).reduce(
						(a, b) => a + Number(b.Mana),
						0
					)
				);
				setAddressInfo(result.data);
			});
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
			shardContract
				.is_approved_for_all(address, NEKOMOTO_ADDRESS)
				.then((result) => {
					// console.log("nekocoin allowance: ", result)
					setShardApprove(result);
				});
			nekomotoContract.lucky(address).then((result) => {
				// console.log("nekocoin allowance: ", result)
				setLucky(result);
			});

			const urlParams = new URLSearchParams(window.location.search);
			const code = urlParams.get("addr");
			if (code) {
				setIsModalOpen1(true);
				console.log("find empower code: ", code);
			}
		} else {
			setAddressInfo({});
			setPrism(0);
			setNekocoin(0);
			setPrismAllowance(0);
			setNekocoinAllowance(0);
			setShardApprove(false);
			setLucky(false);
		}
	}, [address, hhh]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHhh(new Date().getTime().toString());
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const empower = async () => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("addr");
		sign(account).then(({ typedMessage, signature }) => {
			BACKEND.empowerChest(address, code, typedMessage, signature).then(
				(result) => {
					console.log("result: ", result);
					setModalText1("Empower " + result.success ? "success" : "failed");
					urlParams.delete("addr");
					window.history.replaceState(null, null, window.location.pathname);
				}
			);
		});
	};

	const timeFreeze = async () => {
		setWaiting(true);

		const multiCall = await account.execute([
			{
				contractAddress: SHARD_ADDRESS,
				entrypoint: "set_approval_for_all",
				calldata: CallData.compile({
					operator: NEKOMOTO_ADDRESS,
					approved: true,
				}),
			},
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "start_time_freeze",
				calldata: CallData.compile({
					token_id: cairo.uint256(addressInfo.TemporalShardIdList[0]),
				}),
			},
		]);

		setHhh(multiCall.transaction_hash);
		const result = await account.waitForTransaction(multiCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + multiCall.transaction_hash);
	};

	const openChest = async () => {
		setWaiting(true);
		const { typedMessage, signature } = await sign(account);
		const result = await BACKEND.openChest(address, typedMessage, signature);
		console.log("result: ", result);
		if (result.success) {
			setSuccess("Success: " + result.data);
			setIsModalOpen4(true);
			setChestDetail(result.data);
		} else {
			setSuccess(
				"Something went wrong: Please try again tomorrow at 00:00 AM (UTC)"
			);
		}
	};

	const message = (result) => {
		return (
			(result.success ? "Success: " : "Something went wrong: ") +
			(result.message === "" ? result.data : result.message)
		);
	};

	const claimOfSpirit = async () => {
		setWaiting(true);
		const { typedMessage, signature } = await sign(account);
		const result = await BACKEND.claimReward(address, typedMessage, signature);
		console.log("result: ", result);
		setSuccess(message(result));
	};

	const claimOfInvitation = async () => {
		setWaiting(true);
		const { typedMessage, signature } = await sign(account);
		const result = await BACKEND.claimRewardOfInvitation(
			address,
			typedMessage,
			signature
		);
		console.log("result: ", result);
		setSuccess(message(result));
	};

	const getAscendUpgradePrism = (level) => {
		if (level === 0) {
			return 9;
		} else if (level === 1) {
			return 16;
		} else if (level === 2) {
			return 27;
		} else if (level === 3) {
			return 47;
		} else if (level === 4) {
			return 82;
		} else if (level === 5) {
			return 142;
		} else if (level === 6) {
			return 247;
		} else if (level === 7) {
			return 429;
		} else {
			return 746;
		}
	};

	const getAscendUpgradeNeko = (level) => {
		if (level === 0) {
			return 100;
		} else if (level === 1) {
			return 437;
		} else if (level === 2) {
			return 1910;
		} else if (level === 3) {
			return 8345;
		} else if (level === 4) {
			return 36469;
		} else if (level === 5) {
			return 159370;
		} else if (level === 6) {
			return 696448;
		} else if (level === 7) {
			return 3043477;
		} else {
			return 13299996;
		}
	};

	const getAscendUpgrade = (level) => {
		if (level === 0) {
			return 2;
		} else if (level === 1) {
			return 5;
		} else if (level === 2) {
			return 10;
		} else if (level === 3) {
			return 15;
		} else if (level === 4) {
			return 20;
		} else if (level === 5) {
			return 28;
		} else if (level === 6) {
			return 35;
		} else if (level === 7) {
			return 43;
		} else {
			return 51;
		}
	};

	const upgradeAscend = async () => {
		setWaiting(true);
		// const {typedMessage, signature} = await sign(account)
		let arr = [];
		const ascendUpgradePrism = getAscendUpgradePrism(addressInfo.Buff?.Level);
		const ascendUpgradeNeko = getAscendUpgradeNeko(addressInfo.Buff?.Level);
		if (prismAllowance < ascendUpgradePrism) {
			arr.push({
				contractAddress: PRISM_ADDRESS,
				entrypoint: "approve",
				calldata: CallData.compile({
					spender: NEKOMOTO_ADDRESS,
					amount: cairo.uint256(BigInt(ascendUpgradePrism) * 10n ** 18n),
				}),
			});
		}
		if (nekocoinAllowance < ascendUpgradeNeko) {
			arr.push({
				contractAddress: NEKOCOIN_ADDRESS,
				entrypoint: "approve",
				calldata: CallData.compile({
					spender: NEKOMOTO_ADDRESS,
					amount: cairo.uint256(BigInt(ascendUpgradeNeko) * 10n ** 18n),
				}),
			});
		}
		arr.push({
			contractAddress: NEKOMOTO_ADDRESS,
			entrypoint: "upgrade_acend",
			calldata: CallData.compile({}),
		});
		const multiCall = await account.execute(arr);
		setHhh(multiCall.transaction_hash);
		const result = await account.waitForTransaction(multiCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + multiCall.transaction_hash);
	};

	const copyOnClick = (address) => {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(address)
				.then(() => {
					console.log("Address copied to clipboard:", address);
				})
				.catch((err) => {
					console.error("Failed to copy: ", err);
				});
			setCopySuccess1(true);
			setTimeout(() => {
				setCopySuccess1(false);
			}, 2000);
		}
	};

	const stake = async (input) => {
		setWaiting(true);
		const mCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "stake",
				calldata: CallData.compile({ token_id: [cairo.uint256(input)] }),
			},
		]);

		setHhh(mCall.transaction_hash);
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + mCall.transaction_hash);
	};

	const unstake = async (input) => {
		setWaiting(true);
		const mCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "withdraw",
				calldata: CallData.compile({ token_id: [cairo.uint256(input)] }),
			},
		]);

		setHhh(mCall.transaction_hash);
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + mCall.transaction_hash);
	};

	const stakeAll = async () => {
		setWaiting(true);
		const mCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "stake",
				calldata: CallData.compile({
					token_id: addressInfo.NekoSpiritList?.filter((x) => !x.IsStaked).map(
						(x) => cairo.uint256(x.TokenId)
					),
				}),
			},
		]);

		setHhh(mCall.transaction_hash);
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + mCall.transaction_hash);
	};

	const unStakeAll = async () => {
		setWaiting(true);
		const mCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "withdraw",
				calldata: CallData.compile({
					token_id: addressInfo.NekoSpiritList?.filter((x) => x.IsStaked).map(
						(x) => cairo.uint256(x.TokenId)
					),
				}),
			},
		]);

		setHhh(mCall.transaction_hash);
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result: ", result);
		setSuccess("Success: " + mCall.transaction_hash);
	};

	const upgradeCal = [
		{ level: "Lv2", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 100 },
		{ level: "Lv3", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 120 },
		{ level: "Lv4", SPI: 2, ATK: 1, DEF: 1, SPD: 0, Neko: 130 },
		{ level: "Lv5", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 140 },
		{ level: "Lv6", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 155 },
		{ level: "Lv7", SPI: 2, ATK: 1, DEF: 1, SPD: 1, Neko: 165 },
		{ level: "Lv8", SPI: 4, ATK: 3, DEF: 2, SPD: 1, Neko: 200, Prism: 1 },
		{ level: "Lv9", SPI: 4, ATK: 3, DEF: 2, SPD: 1, Neko: 245 },
		{ level: "Lv10", SPI: 4, ATK: 3, DEF: 3, SPD: 1, Neko: 300 },
		{ level: "Lv11", SPI: 6, ATK: 5, DEF: 3, SPD: 1, Neko: 370 },
		{ level: "Lv12", SPI: 6, ATK: 7, DEF: 3, SPD: 2, Neko: 455 },
		{ level: "Lv13", SPI: 12, ATK: 9, DEF: 5, SPD: 3, Neko: 1000, Prism: 2 },
		{ level: "Lv", SPI: 0, ATK: 0, DEF: 0, SPD: 0 },
	];

	const upgrade = async (tokenId) => {
		setWaiting(true);

		let arr = [];
		if (
			upgradeCal[focus.Level - 1].Prism &&
			prismAllowance < upgradeCal[focus.Level - 1].Prism
		) {
			arr.push({
				contractAddress: PRISM_ADDRESS,
				entrypoint: "approve",
				calldata: CallData.compile({
					spender: NEKOMOTO_ADDRESS,
					amount: cairo.uint256(
						BigInt(upgradeCal[focus.Level - 1].Prism) * 10n ** 18n
					),
				}),
			});
		}
		if (
			upgradeCal[focus.Level - 1].Neko &&
			nekocoinAllowance < upgradeCal[focus.Level - 1].Neko
		) {
			arr.push({
				contractAddress: NEKOCOIN_ADDRESS,
				entrypoint: "approve",
				calldata: CallData.compile({
					spender: NEKOMOTO_ADDRESS,
					amount: cairo.uint256(
						BigInt(upgradeCal[focus.Level - 1].Neko) * 10n ** 18n
					),
				}),
			});
		}
		arr.push({
			contractAddress: NEKOMOTO_ADDRESS,
			entrypoint: "upgrade",
			calldata: CallData.compile({ token_id: cairo.uint256(tokenId) }),
		});
		const mCall = await account.execute(arr);

		setHhh(mCall.transaction_hash);
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result ", result);
		setSuccess("Success: " + mCall.transaction_hash);
	};

	const ascendData = [
		{ level: 9, prism: 746, neko: 13299996, percentage: "51%" },
		{ level: 8, prism: 429, neko: 3043477, percentage: "43%" },
		{ level: 7, prism: 247, neko: 696448, percentage: "35%" },
		{ level: 6, prism: 142, neko: 159370, percentage: "28%" },
		{ level: 5, prism: 82, neko: 36469, percentage: "20%" },
		{ level: 4, prism: 47, neko: 8345, percentage: "15%" },
		{ level: 3, prism: 27, neko: 1910, percentage: "10%" },
		{ level: 2, prism: 16, neko: 437, percentage: "5%" },
		{ level: 1, prism: 9, neko: 100, percentage: "2%" },
	];

	return (
		<div>
			<NekoModal
				open={waiting}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => {
					setWaiting(false);
					setSuccess("");
				}}
			>
				<div
					style={{
						marginTop: "20px",
						marginBottom: "20px",
						alignItems: "center",
						justifyContent: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<h3
						style={{
							textAlign: "center",
							color: "#01dce4",
							fontFamily: "BIG SHOT",
							fontWeight: "bold",
							wordWrap: "break-word",
							wordBreak: "break-all",
						}}
					>
						{success !== ""
							? success
							: "Please sign in your wallet and wait..."}
					</h3>

					{success && (
						<Button
							style={{
								marginTop: "20px",
								fontSize: "15px",
								flexDirection: "row",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							text={"OK"}
							color={"yellow"}
							longness="long"
							onClick={() => {
								setWaiting(false);
								setSuccess("");
							}}
						/>
					)}
				</div>
			</NekoModal>

			<div className="detail padding-top-80 padding-bottom-80">
				<Flex
					className="back-btn"
					align="center"
					onClick={() => navigate("/assets")}
				>
					<img
						src={arrowLeft}
						width={16}
						alt=""
						style={{ marginRight: "12px" }}
					/>
					Assets
				</Flex>

				<Row gutter={{ md: 0, lg: 16 }}>
					<Col xs={24} sm={24} lg={12} className="margin-top-16">
						<InviteCard
							chestEmpower={addressInfo.ChestEmpower || []}
							chestOpenable={addressInfo.ChestOpenable}
							openedChestCount={info?.chestCount}
							openedMasterChestCount={info?.masterChestCount}
							openChest={openChest}
						/>
					</Col>
					<Col xs={24} sm={24} lg={12} className="margin-top-16">
						<ClaimedCard
							type="short"
							totalClaimed={addressInfo.TotalClaimed}
							totalMana={addressInfo.TotalMana}
							shard={addressInfo.TemporalShardIdList?.length}
							boost={addressInfo.Buff?.Boost}
							lucky={lucky}
							startTime={addressInfo.Buff?.StartTime}
							bountyWave={addressInfo.IsInBountyWave}
							startTimeFreeze={timeFreeze}
						/>
					</Col>
				</Row>

				{/* <Row gutter={{ xs: 0, sm: 16 }}>
        <Col xs={24} sm={12}>
          <InviteCard />
        </Col>
        <Col xs={24} sm={12}>
          <ClaimedCard type="short" />
        </Col>
      </Row> */}

				<Row gutter={{ md: 0, lg: 16 }}>
					<Col xs={24} sm={24} lg={6} className="margin-top-16">
						<BoxCard
							type="gem"
							title={addCommaInNumber(addressInfo.ToClaim) + " NKO"}
							subTitle="Earnings"
							subPic={true}
							subFunc={() => setEarningInfo(true)}
							buttonText="Claim"
							onButtonClick={claimOfSpirit}
						/>
					</Col>
					<Col xs={24} sm={24} lg={9} className="margin-top-16">
						<EmptyCard>
							<Row>
								<Col xs={24} sm={24}>
									<Flex justify="space-between">
										<div>
											<Flex align="center" className="card-little-title">
												Ascend
												<img
													width={14}
													style={{ marginLeft: "8px" }}
													src={exclamation}
													alt=""
													onClick={() => setAscendInfo(true)}
												/>
											</Flex>
										</div>
										<div className="card-little-title">
											{Math.round(Number(addressInfo.Buff?.Boost || 0) * 100) +
												"%"}
										</div>
									</Flex>
								</Col>
								<Col xs={24} sm={24} style={{ marginTop: "8px" }}>
									<div className="grey-text-little">Global mana bonus</div>
								</Col>
							</Row>
							<Row style={{ flex: 1 }}>
								<Col xs={12} sm={12} style={{ marginTop: "24px" }}>
									<GemItem
										color="purple"
										title="Prism"
										descLeft={prism}
										descRight={getAscendUpgradePrism(addressInfo.Buff?.Level)}
									/>
								</Col>
								<Col xs={12} sm={12} style={{ marginTop: "24px" }}>
									<GemItem
										color="blue"
										title="NKO"
										descLeft={nekocoin}
										descRight={getAscendUpgradeNeko(addressInfo.Buff?.Level)}
									/>
								</Col>
								<Col
									xs={24}
									sm={24}
									className="text-center"
									style={{ alignSelf: "flex-end", marginTop: "24px" }}
								>
									<Button
										text={
											"UP TO " + getAscendUpgrade(addressInfo.Buff?.Level) + "%"
										}
										color="yellow"
										longness="short"
										onClick={upgradeAscend}
									/>
								</Col>
							</Row>
						</EmptyCard>
					</Col>
					<Col xs={24} sm={24} lg={9} className="margin-top-16">
						<EmptyCard>
							<Row>
								<Col xs={24} sm={24}>
									<div className="card-little-title">
										Referral Rewards {"(" + addressInfo.InviteCount + ")"}
									</div>
								</Col>

								<Col xs={24} sm={24} style={{ margin: "8px 0 18px" }}>
									<Flex align="center" className="blue-text">
										{addressInfo.InviteCode}
										<img
											width={14}
											style={{ marginLeft: "8px" }}
											src={copySuccess1 ? copySuccuess : copy}
											alt=""
											onClick={() => copyOnClick(addressInfo.InviteCode)}
										/>
									</Flex>
								</Col>
							</Row>
							<Flex justify="space-between" className="card-mini-title">
								<div>Claimed</div>
								<div>{addressInfo.InvitationReward?.ClaimedAmount}</div>
							</Flex>
							<Flex justify="space-between" className="card-mini-title">
								<div>Available</div>
								<div>
									{Math.max(
										Math.min(
											Number(addressInfo.InvitationReward?.TotalAmount) -
												Number(addressInfo.InvitationReward?.UnlockedAmount),
											Number(addressInfo.InvitationReward?.ClaimedAmount)
										),
										0
									)}
								</div>
							</Flex>
							<Flex justify="space-between" className="card-mini-title">
								<div>Locked</div>
								<div>
									{Math.max(
										Number(addressInfo.InvitationReward?.TotalAmount) -
											Number(addressInfo.InvitationReward?.UnlockedAmount),
										0
									)}
								</div>
							</Flex>
							<Row style={{ flex: 1 }}>
								<Col
									xs={24}
									sm={24}
									className="text-center"
									style={{ alignSelf: "flex-end", marginTop: "24px" }}
								>
									<Button
										text="Claim"
										color="yellow"
										longness="short"
										onClick={claimOfInvitation}
									/>
								</Col>
							</Row>
						</EmptyCard>
					</Col>
				</Row>

				<div className="cards-wrapper margin-top-16">
					<BoxBorder color="#0E222F" />
					<div className="card-title">
						{"My Neko (" +
							addressInfo.NekoSpiritList?.filter(
								(item) => item.IsStaked === true
							).length +
							"/" +
							addressInfo.NekoSpiritList?.length +
							")"}
					</div>
					<Flex
						style={{ margin: "24px 0" }}
						justify="space-between"
						align="center"
					>
						{isMobile ? (
							<Select
								defaultValue="ALL"
								style={{ width: 100 }}
								options={options}
							></Select>
						) : (
							<div>
								<RadioButton
									text="all"
									active={nekoButton === "all"}
									onClick={() => setNekoButton("all")}
								/>
								<RadioButton
									text="LEGENDARY"
									active={nekoButton === "LEGENDARY"}
									onClick={() => setNekoButton("LEGENDARY")}
								/>
								<RadioButton
									text="EPIC"
									active={nekoButton === "EPIC"}
									onClick={() => setNekoButton("EPIC")}
								/>
								<RadioButton
									text="RARE"
									active={nekoButton === "RARE"}
									onClick={() => setNekoButton("RARE")}
								/>
								<RadioButton
									text="UNCOMMON"
									active={nekoButton === "UNCOMMON"}
									onClick={() => setNekoButton("UNCOMMON")}
								/>
								<RadioButton
									text="COMMON"
									active={nekoButton === "COMMON"}
									onClick={() => setNekoButton("COMMON")}
								/>
							</div>
						)}

						<Flex>
							<div
								className="card-desc-title"
								style={
									addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
										.length > 0
										? {
												marginRight: "18px",
												fontSize: "12px",
												cursor: "pointer",
										  }
										: {
												marginRight: "18px",
												fontSize: "12px",
												cursor: "pointer",
												filter: "grayscale(1)",
										  }
								}
								onClick={
									addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
										.length > 0
										? stakeAll
										: null
								}
							>
								Stake All
							</div>
							<div
								className="card-desc-title"
								style={
									addressInfo.NekoSpiritList?.filter((item) => item.IsStaked)
										.length > 0
										? { fontSize: "12px", cursor: "pointer" }
										: {
												fontSize: "12px",
												cursor: "pointer",
												filter: "grayscale(1)",
										  }
								}
								onClick={
									addressInfo.NekoSpiritList?.filter((item) => item.IsStaked)
										.length > 0
										? unStakeAll
										: null
								}
							>
								UnStake All
							</div>
						</Flex>
					</Flex>

					<Row gutter={16}>
						{addressInfo.NekoSpiritList?.filter((item) =>
							nekoButton === "all"
								? true
								: item.Rarity?.toLowerCase() === nekoButton.toLowerCase()
						).map((item, index) => {
							// console.log("index: ", item, index)
							return (
								<Col xs={12} sm={12} lg={4} key={index}>
									<Flex
										className="card-item"
										justify="center"
										vertical="column"
									>
										<img src={card1 || card2 || card3} alt="" />
										<Button
											onClick={
												item.IsStaked
													? () => {
															setIsModalOpen3(true);
															setFocus(item);
													  }
													: () => {
															setIsModalOpen2(true);
															setFocus(item);
													  }
											}
											text={item.IsStaked ? "level up" : "staking"}
											color={item.IsStaked ? "orange" : "yellow"}
											longness="short"
										/>
									</Flex>
								</Col>
							);
						})}
					</Row>
				</div>

				<NekoModal
					title="Details"
					open={isModalOpen2}
					onCancel={() => setIsModalOpen2(false)}
				>
					<Flex justify="center" vertical="column">
						<Row>
							<Col xs={24} sm={24} lg={12} className="modal-card">
								<div className="modal-card-inner">
									<CardCorner />
									<img src={card3} width={192} alt="" />
								</div>
							</Col>
							<Col
								xs={24}
								sm={24}
								lg={12}
								style={{
									flex: 1,
									padding: "15px 15px 21px ",
									marginLeft: "32px",
								}}
							>
								<Flex className="modal-detail" vertical="column">
									<div className="modal-text1 margin-top-16">
										{"# " + focus.TokenId}
									</div>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Earning</div>
										<div className="modal-text3">{focus.Rewards}</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Claimed</div>
										<div className="modal-text3">{focus.ClaimedRewards}</div>
									</Flex>
									{/*<Flex justify="space-between" className="margin-bottom-16">*/}
									{/*    <div className="modal-text2">APR</div>*/}
									{/*    <div className="modal-text3">/</div>*/}
									{/*</Flex>*/}
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Status</div>
										<div className="modal-text3">
											{focus.IsStaked ? "Staked" : "Available"}
										</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">LV</div>
										<div className="modal-text3">{focus?.Level}</div>
									</Flex>
								</Flex>
							</Col>
						</Row>

						<Button
							text="Staking"
							color="yellow"
							longness="short"
							style={{ marginTop: "48px" }}
							onClick={() => stake(focus.TokenId)}
						/>
					</Flex>
				</NekoModal>

				<NekoModal
					title="Details - LV UP"
					open={isModalOpen3}
					onCancel={() => setIsModalOpen3(false)}
				>
					<Flex justify="center" vertical="column">
						<Row>
							<Col xs={24} sm={24} lg={12} className="modal-card">
								<div className="modal-card-inner">
									<CardCorner />
									<img src={card3} width={192} alt="" />
								</div>
							</Col>
							<Col
								xs={24}
								sm={24}
								lg={12}
								style={{
									flex: 1,
									padding: "15px 15px 21px ",
									marginLeft: "32px",
								}}
							>
								<Flex className="modal-detail" vertical="column">
									<div className="modal-text1 margin-top-16">
										{"# " + focus.TokenId}
									</div>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Earning</div>
										<div className="modal-text3">
											{focus?.Rewards?.substring(
												0,
												focus?.Rewards?.indexOf(".") + 3
											)}
										</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Claimed</div>
										<div className="modal-text3">
											{focus?.ClaimedRewards?.substring(
												0,
												focus?.ClaimedRewards?.indexOf(".") + 3
											)}
										</div>
									</Flex>
									{/*<Flex justify="space-between" className="margin-bottom-16">*/}
									{/*    <div className="modal-text2">APR</div>*/}
									{/*    <div className="modal-text3">/</div>*/}
									{/*</Flex>*/}
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Status</div>
										<div className="modal-text3">
											{focus?.IsStaked ? "Staked" : "Available"}
										</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">LV</div>
										<div className="modal-text3">{focus?.Level}</div>
									</Flex>
								</Flex>
							</Col>
						</Row>
						<Row justify="center">
							<Col xs={24} sm={24} lg={18}>
								<Flex justify="center" style={{ marginBottom: "10px" }}>
									<div className="modal-text1">{"LV" + focus.Level}</div>
									{focus.Level !== 13 && focus.Level > 0 && (
										<div className="modal-text1">{" → "}</div>
									)}
									{focus.Level !== 13 && focus.Level > 0 && (
										<div className="modal-text4">
											&nbsp;
											{"LV" +
												(focus.Level === 13 ? 13 : Number(focus.Level) + 1)}
										</div>
									)}
								</Flex>
								<Flex justify="space-between">
									<Flex align="center" className="modal-text5">
										{" "}
										<img
											src={m1}
											width={14}
											alt=""
											style={{ marginRight: "10px" }}
										/>
										SPI
									</Flex>
									<Flex>
										<div className="modal-text6">{focus.SPI}</div>
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus.Level !== 13 && focus.Level > 0 && (
											<div
												className={
													upgradeCal[focus.Level - 1].SPI > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{Number(focus.SPI) + upgradeCal[focus.Level - 1].SPI}
											</div>
										)}
									</Flex>
								</Flex>
								<Flex justify="space-between">
									<Flex align="center" className="modal-text5">
										{" "}
										<img
											src={m2}
											width={14}
											alt=""
											style={{ marginRight: "10px" }}
										/>
										ATK
									</Flex>
									<Flex>
										<div className="modal-text6">{focus.ATK}</div>
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus.Level !== 13 && focus.Level > 0 && (
											<div
												className={
													upgradeCal[focus.Level - 1].ATK > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{Number(focus.ATK) + upgradeCal[focus.Level - 1].ATK}
											</div>
										)}
									</Flex>
								</Flex>
								<Flex justify="space-between">
									<Flex align="center" className="modal-text5">
										{" "}
										<img
											src={m3}
											width={14}
											alt=""
											style={{ marginRight: "10px" }}
										/>
										DEF
									</Flex>
									<Flex>
										<div className="modal-text6">{focus.DEF}</div>
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus.Level !== 13 && focus.Level > 0 && (
											<div
												className={
													upgradeCal[focus.Level - 1].DEF > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{Number(focus.DEF) + upgradeCal[focus.Level - 1].DEF}
											</div>
										)}
									</Flex>
								</Flex>
								<Flex justify="space-between">
									<Flex align="center" className="modal-text5">
										{" "}
										<img
											src={m4}
											width={14}
											alt=""
											style={{ marginRight: "10px" }}
										/>
										SPD
									</Flex>
									<Flex>
										<div className="modal-text6">{focus.SPD}</div>
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus.Level !== 13 && focus.Level > 0 && (
											<div
												className={
													upgradeCal[focus.Level - 1].SPD > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{Number(focus.SPD) + upgradeCal[focus.Level - 1].SPD}
											</div>
										)}
									</Flex>
								</Flex>
								<Flex justify="space-between">
									<Flex align="center" className="modal-text5">
										{" "}
										<img
											src={m5}
											width={14}
											alt=""
											style={{ marginRight: "10px" }}
										/>
										MANA
									</Flex>
									<Flex>
										<div className="modal-text6">
											{addCommaInNumber(focus.Mana)}
										</div>
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus.Level !== 13 && focus.Level > 0 && (
											<div className="modal-text7">
												{addCommaInNumber(
													Number(focus.Mana) +
														0.065 *
															(0.4 * Number(upgradeCal[focus.Level - 1].SPI) +
																0.3 * Number(upgradeCal[focus.Level - 1].ATK) +
																0.2 * Number(upgradeCal[focus.Level - 1].DEF) +
																0.1 * Number(upgradeCal[focus.Level - 1].SPD))
												)}
											</div>
										)}
									</Flex>
								</Flex>
								{upgradeCal[focus.Level - 1]?.Prism &&
									upgradeCal[focus.Level - 1].Prism > 0 && (
										<Flex
											className="black-bg2"
											justify="space-between"
											align="center"
											style={{ marginTop: "16px" }}
										>
											<Flex align="center">
												<img
													src={purple}
													width={24}
													style={{ marginRight: "10px" }}
													alt=""
												/>
												<div className="modal-text3">Prism</div>
											</Flex>
											<Flex>
												<div className="modal-text3">{prism}</div>
												<div className="modal-text9">
													{"/" + upgradeCal[focus.Level - 1].Prism}
												</div>
											</Flex>
										</Flex>
									)}
								{upgradeCal[focus.Level - 1]?.Neko &&
									upgradeCal[focus.Level - 1].Neko > 0 && (
										<Flex
											className="black-bg3"
											justify="space-between"
											align="center"
											style={{ marginTop: "16px" }}
										>
											<Flex align="center">
												<img
													src={blue}
													width={24}
													style={{ marginRight: "10px" }}
													alt=""
												/>
												<div className="modal-text3">NKO</div>
											</Flex>
											<Flex>
												<div className="modal-text3">{nekocoin}</div>
												<div className="modal-text9">
													{"/" + upgradeCal[focus.Level - 1].Neko}
												</div>
											</Flex>
										</Flex>
									)}
							</Col>
						</Row>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								padding: "24px 80px",
							}}
						>
							<Button
								text="LV UP"
								color="orange"
								longness="short"
								style={{ marginTop: "24px" }}
								onClick={() => upgrade(focus.TokenId)}
							/>
							<Button
								text={"Unstake"}
								color={"blue"}
								longness={"short"}
								style={{ marginTop: "24px" }}
								onClick={() => unstake(focus.TokenId)}
							/>
						</div>
					</Flex>
				</NekoModal>

				<NekoModal
					title=""
					open={isModalOpen4}
					onCancel={() => {
						setIsModalOpen4(false);
						setSuccess("");
					}}
				>
					<div className="modal-title text-center margin-bottom-16">
						{ascendInfo?.ChestEmpower && ascendInfo?.ChestEmpower.length >= 5
							? "Open Master's Box"
							: "Open Adept's Chest"}
					</div>
					<Row justify="center" gutter={16}>
						{chestDetail?.Token2Amount && chestDetail?.Token2Amount > 0 && (
							<Col>
								<div className="adept-bg">
									<img src={adept1} width={80} alt="" />
									<div className="modal-text1">Prism</div>
									<div className="modal-text10">
										{"x" + chestDetail?.Token2Amount}
									</div>
								</div>
							</Col>
						)}

						{chestDetail?.Token1Amount && chestDetail?.Token1Amount > 0 && (
							<Col>
								<div className="adept-bg">
									<img src={adept2} width={80} alt="" />
									<div className="modal-text1">NKO</div>
									<div className="modal-text10">
										{"x" + chestDetail?.Token1Amount}
									</div>
								</div>
							</Col>
						)}

						{chestDetail?.NFTAmount && chestDetail?.NFTAmount > 0 && (
							<Col>
								<div className="adept-bg">
									<img src={adept3} width={80} alt="" />
									<div className="modal-text1">Temporal Shard</div>
									<div className="modal-text10">
										{"x" + chestDetail?.NFTAmount}
									</div>
								</div>
							</Col>
						)}
					</Row>
					<Flex justify="center">
						<Button
							text="Get"
							color="yellow"
							longness="short"
							style={{ marginTop: "48px" }}
							onButtonClick={() => {
								setIsModalOpen4(false);
								setSuccess("");
							}}
						/>
					</Flex>
				</NekoModal>

				<NekoModal
					title=""
					open={isModalOpen5}
					onCancel={() => setIsModalOpen5(false)}
				>
					<div className="modal-title text-center margin-bottom-16">
						Choose Wallet
					</div>
					<Flex className="black-bg5" justify="center" align="center">
						<div className="modal-text1 text-center">Metamask</div>
					</Flex>
					<Flex className="black-bg4" justify="center" align="center">
						<div className="modal-text1 text-center">OKX</div>
					</Flex>
					<input
						className="input-card-input"
						placeholder="Enter Amount"
						type="text"
					/>
					<Flex justify="center">
						<Button
							text="Connect"
							color="yellow"
							longness="long"
							style={{ marginTop: "48px" }}
						/>
					</Flex>
				</NekoModal>
			</div>

			<NekoModal
				open={isModalOpen1}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => {
					setIsModalOpen1(false);
					setModalText1("");
				}}
			>
				<h2
					style={{
						textAlign: "center",
						color: "#01dce4",
						fontFamily: "BIG SHOT",
						fontWeight: "bold",
					}}
				>
					{modalText1 === ""
						? "Click Empower to help your friends!"
						: modalText1}
				</h2>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{modalText1 === "" ? (
						<Button
							style={{ marginTop: "20px", textAlign: "center" }}
							onClick={empower}
							text={"EMPOWER"}
							color={"yellow"}
							longness="long"
						/>
					) : (
						<Button
							style={{ marginTop: "20px", textAlign: "center" }}
							onClick={() => {
								setIsModalOpen1(false);
								setModalText1("");
							}}
							text={"Close"}
							color={"yellow"}
							longness="long"
						/>
					)}
				</div>
			</NekoModal>

			<NekoModal
				open={earningInfo}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => setEarningInfo(false)}
				title={"Earning"}
			>
				<div
					style={{
						display: "flex",
						alignItems: "flex",
						flexDirection: "row",
						justifyContent: "center",
						color: "#90A6AF",
						fontFamily: "BIG SHOT",
						fontSize: "14px",
						lineHeight: "18px",
						fontWeight: "400",
					}}
				>
					<div style={{ marginRight: "10px" }}>&#8226;</div>
					<div>{"Include 10% tax "}</div>
				</div>
			</NekoModal>

			<NekoModal
				open={ascendInfo}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => setAscendInfo(false)}
				title={"Ascend: Mana Bonus"}
			>
				<div
					style={{
						display: "flex",
						alignItems: "flex",
						flexDirection: "row",
						justifyContent: "center",
						color: "#90A6AF",
						fontFamily: "BIG SHOT",
						fontSize: "14px",
						lineHeight: "18px",
						fontWeight: "400",
					}}
				>
					<div style={{ marginRight: "10px" }}>&#8226;</div>
					<div>
						{
							"Ascend has a total of 1-9 levels, and different levels bring different bonuses. Users spend "
						}
						<span style={{ color: "#01DCE4", display: "inline" }}>
							{"Prism"}
						</span>
						<span> </span>
						<span style={{ color: "#FBA323", display: "inline" }}>
							{"+$NKO"}
						</span>
						{" to upgrade"}
					</div>
				</div>
				<div
					style={{
						marginTop: "20px",
						display: "flex",
						alignItems: "flex",
						flexDirection: "row",
						justifyContent: "center",
						color: "#90A6AF",
						fontFamily: "BIG SHOT",
						fontSize: "14px",
						lineHeight: "18px",
						fontWeight: "400",
					}}
				>
					<div style={{ marginRight: "10px" }}>&#8226;</div>
					<div>
						Ascend bonus extends the total mana of NFT pledged by users
						permanently
					</div>
				</div>
				<div
					style={{
						backgroundColor: "#253b4b",
						marginTop: "20px",
						fontSize: "12px",
						fontFamily: "BIG SHOT",
						fontWeight: "400",
					}}
				>
					<table
						style={{
							border: "none",
							borderCollapse: "collapse",
							width: "100%",
						}}
					>
						<thead style={{ backgroundColor: "#162734" }}>
							<tr style={{ color: "#90A6AF" }}>
								<th style={{ padding: "8px" }}>Level</th>
								<th style={{ padding: "8px" }}>Prism Consume</th>
								<th style={{ padding: "8px" }}>NKO Consume</th>
								<th style={{ padding: "8px" }}>Global Mana</th>
							</tr>
						</thead>
						<tbody>
							{ascendData.map((item, index) => {
								return (
									<tr key={index} style={{ color: "white" }}>
										<td
											style={{
												padding: "10px",
												paddingLeft: "15px",
												verticalAlign: "top",
												marginLeft: "8px",
											}}
										>
											{item.level}
										</td>
										<td
											style={{
												padding: "10px",
												paddingLeft: "20px",
												verticalAlign: "top",
												marginLeft: "8px",
											}}
										>
											{item.prism}
										</td>
										<td
											style={{
												padding: "10px",
												paddingLeft: "20px",
												verticalAlign: "top",
												marginLeft: "8px",
											}}
										>
											{item.neko}
										</td>
										<td
											style={{
												padding: "10px",
												paddingLeft: "20px",
												verticalAlign: "top",
												marginLeft: "8px",
											}}
										>
											{item.percentage}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</NekoModal>
		</div>
	);
}
