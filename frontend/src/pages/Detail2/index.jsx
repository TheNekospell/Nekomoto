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

import mintPagePic from "@assets/mint-page.png";

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

import CardDetail from "@components/CardDetail/index.jsx";
import UnlockRate from "../../components/UnlockRate";
import PowerCard from "../../components/PowerCard";
import StakePoolCard from "../../components/StakePoolCard";
import NekomotoPreview from "../../components/NekomotoPreview";
import NekomotoDetail from "../../components/NekomotoDetail";

export default function Detail() {
	// const isMobile = useAppStore().device === "mobile";
	const isMobile = false;
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
				if (focus?.TokenId) {
					setFocus(
						result.data.NekoSpiritList.find((x) => x.TokenId === focus.TokenId)
					);
				}
				const urlParams = new URLSearchParams(window.location.search);
				const code = urlParams.get("addr");
				if (code && result?.data?.RequestToEmpower && code !== address) {
					setIsModalOpen1(true);
					console.log("find empower code: ", code);
				}
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
		} else {
			setAddressInfo({
				InviteCode: "",
				Buff: {
					Level: 0,
				},
				TemporalShardIdList: [],
				TotalMana: 0,
				ToClaim: 0,
				InviteCount: 0,
				InvitationReward: {
					TotalAmount: 0,
					UnlockedAmount: 0,
					ClaimedAmount: 0,
				},
				NekoSpiritList: [],
			});
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
		}, 15000);

		return () => clearInterval(interval);
	}, []);

	const message = (result) => {
		return (
			(result.success ? "Success: " : "Something went wrong: ") +
			(result.message === "" ? result.data : result.message)
		);
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
		// setSuccess("Success: " + mCall.transaction_hash);
		if (result.execution_status === "SUCCEEDED") {
			setWaiting(false);
			setIsModalOpen2(false);
			setIsModalOpen3(true);
		}
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
		// setSuccess("Success: " + mCall.transaction_hash);
		if (result.execution_status === "SUCCEEDED") {
			setWaiting(false);
			setIsModalOpen3(false);
			setIsModalOpen2(true);
		}
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

		const result = await account.waitForTransaction(mCall.transaction_hash);
		setHhh(mCall.transaction_hash);
		console.log("result ", result);
		// setSuccess("Success: " + mCall.transaction_hash);
		if (result.execution_status === "SUCCEEDED") {
			setWaiting(false);
			// setFocus(addressInfo.NekoSpiritList.find((x) => x.TokenId === tokenId));
		}
	};

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

			<div
				className="detail padding-top-80 padding-bottom-80"
				style={{ width: "100%", height: "100%" }}
			>
				<Row gutter={16} style={{ height: "100%" }}>
					<Col
						style={{ width: "55%", height: "100%" }}
						className="margin-top-16"
						gutter={16}
					>
						<UnlockRate style={{ height: "50%" }} />
						<div style={{ marginBottom: "16px" }} />
						<PowerCard style={{ height: "50%" }} />
					</Col>
					<Col
						style={{ width: "45%", height: "100%" }}
						className="margin-top-16"
					>
						<StakePoolCard />
					</Col>
				</Row>

				<Row gutter={{ md: 0, lg: 16 }}>
					<Col
						style={{ width: "55%", height: "100%" }}
						className="margin-top-16"
						gutter={16}
					>
						<NekomotoPreview
							addressInfo={addressInfo}
							nekoButton={nekoButton}
							setNekoButton={setNekoButton}
							setIsModalOpen3={setIsModalOpen3}
							setFocus={setFocus}
						/>
					</Col>
					<Col
						style={{ width: "55%", height: "100%" }}
						className="margin-top-16"
						gutter={16}
					></Col>
				</Row>

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
									{/*<img src={card3} width={192} alt=""/>*/}
									<CardDetail item={focus} />
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
										{"# " + focus?.TokenId}
									</div>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Earning</div>
										<div className="modal-text3">
											{addCommaInNumber(focus?.Rewards)}
										</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Claimed</div>
										<div className="modal-text3">
											{addCommaInNumber(focus?.ClaimedRewards)}
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
									{/*<img src={card3} width={192} alt=""/>*/}
									<CardDetail item={focus} />
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
										{"# " + focus?.TokenId}
									</div>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Earning</div>
										<div className="modal-text3">
											{addCommaInNumber(focus?.Rewards)}
										</div>
									</Flex>
									<Flex justify="space-between" className="margin-bottom-16">
										<div className="modal-text2">Claimed</div>
										<div className="modal-text3">
											{addCommaInNumber(focus?.ClaimedRewards)}
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
									<div className="modal-text1">{"LV" + focus?.Level}</div>
									{focus?.Level !== 13 && focus?.Level > 0 && (
										<div className="modal-text1">{" → "}</div>
									)}
									{focus?.Level !== 13 && focus?.Level > 0 && (
										<div className="modal-text4">
											&nbsp;
											{"LV" +
												(focus?.Level === 13 ? 13 : Number(focus?.Level) + 1)}
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
										<div className="modal-text6">
											{addCommaInNumber(focus?.SPI)}
										</div>
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div
												className={
													upgradeCal[focus?.Level - 1].SPI > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{addCommaInNumber(
													Number(focus?.SPI) + upgradeCal[focus?.Level - 1].SPI
												)}
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
										<div className="modal-text6">
											{addCommaInNumber(focus?.ATK)}
										</div>
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div
												className={
													upgradeCal[focus?.Level - 1].ATK > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{addCommaInNumber(
													Number(focus?.ATK) + upgradeCal[focus?.Level - 1].ATK
												)}
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
										<div className="modal-text6">
											{addCommaInNumber(focus?.DEF)}
										</div>
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div
												className={
													upgradeCal[focus?.Level - 1].DEF > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{addCommaInNumber(
													Number(focus?.DEF) + upgradeCal[focus?.Level - 1].DEF
												)}
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
										<div className="modal-text6">
											{addCommaInNumber(focus?.SPD)}
										</div>
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div
												className={
													upgradeCal[focus?.Level - 1].SPD > 0
														? "modal-text7"
														: "modal-text8"
												}
											>
												{addCommaInNumber(
													Number(focus?.SPD) + upgradeCal[focus?.Level - 1].SPD
												)}
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
											{addCommaInNumber(focus?.Mana)}
										</div>
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text8">&nbsp;{">"}&nbsp;</div>
										)}
										{focus?.Level !== 13 && focus?.Level > 0 && (
											<div className="modal-text7">
												{addCommaInNumber(
													Number(focus?.Mana) +
														0.065 *
															(0.4 * Number(upgradeCal[focus?.Level - 1].SPI) +
																0.3 * Number(upgradeCal[focus?.Level - 1].ATK) +
																0.2 * Number(upgradeCal[focus?.Level - 1].DEF) +
																0.1 * Number(upgradeCal[focus?.Level - 1].SPD))
												)}
											</div>
										)}
									</Flex>
								</Flex>
								{upgradeCal[focus?.Level - 1]?.Prism &&
									upgradeCal[focus?.Level - 1].Prism > 0 && (
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
												<div className="modal-text3">
													{addCommaInNumber(prism)}
												</div>
												<div className="modal-text9">
													{"/" +
														addCommaInNumber(
															upgradeCal[focus?.Level - 1].Prism
														)}
												</div>
											</Flex>
										</Flex>
									)}
								{upgradeCal[focus?.Level - 1]?.Neko &&
									upgradeCal[focus?.Level - 1].Neko > 0 && (
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
												<div className="modal-text3">NPO</div>
											</Flex>
											<Flex>
												<div className="modal-text3">
													{addCommaInNumber(nekocoin)}
												</div>
												<div className="modal-text9">
													{"/" +
														addCommaInNumber(upgradeCal[focus?.Level - 1].Neko)}
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
								text={focus?.Level == 13 ? "LV MAX" : "LV UP"}
								color="orange"
								longness="short"
								style={
									focus?.Level == 13
										? { filter: "grayscale(1)", marginTop: "24px" }
										: { marginTop: "24px" }
								}
								onClick={
									focus?.Level == 13 ? null : () => upgrade(focus?.TokenId)
								}
							/>

							<Button
								text={"Unstake"}
								color={"blue"}
								longness={"short"}
								style={{ marginTop: "24px" }}
								onClick={() => unstake(focus?.TokenId)}
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
						{addressInfo?.ChestEmpower?.length >= 5
							? "Open Master's Box"
							: "Open Adept's Chest"}
					</div>
					<Row justify="center" gutter={16}>
						{chestDetail?.Token2Amount > 0 && (
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

						{chestDetail?.Token1Amount > 0 && (
							<Col>
								<div className="adept-bg">
									<img src={adept2} width={80} alt="" />
									<div className="modal-text1">NPO</div>
									<div className="modal-text10">
										{"x" + chestDetail?.Token1Amount}
									</div>
								</div>
							</Col>
						)}

						{chestDetail?.NFTAmount > 0 && (
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
							onClick={() => {
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
							// onClick={empower}
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
							{"+$NPO"}
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
								<th style={{ padding: "8px" }}>NPO Consume</th>
								<th style={{ padding: "8px" }}>Global Mana</th>
							</tr>
						</thead>
						<tbody>
							{/* {ascendData?.map((item, index) => {
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
							})} */}
						</tbody>
					</table>
				</div>
			</NekoModal>
		</div>
	);
}
