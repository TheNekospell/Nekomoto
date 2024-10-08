import "./index.css";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import inputCardLogo from "@assets/input-card-logo.png";
import { Col, Row, Flex, Input } from "antd";
import { useAppStore } from "@stores/index";
import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import {
	BACKEND,
	nekocoinContract,
	NEKOMOTO_ADDRESS,
	sign,
	waitTx,
	NEKOCOIN_ADDRESS,
	addCommaInNumber,
} from "@/interface.js";
import { cairo, CallData } from "starknet";
import NekoModal from "@components/Modal/index.jsx";
import CardCorner from "@components/CardCorner/index.jsx";
import card3 from "@assets/card3.png";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";

import mintPagePic from "@assets/mint-page.png";
import mintPagePic2 from "@assets/mint-page2.png";
import blue from "@assets/blue.png";
import exclamation from "@assets/exclamation.png";

export default function InputCard() {

	const { account, address, status, chainId, isConnected } = useAccount();
	const [inputValue, setInputValue] = useState("Enter your amount");
	const [visible, setVisible] = useState(false);
	const [text, setText] = useState("");
	const navigate = useNavigate();

	const mint = async (count) => {
		console.log("count: ", count);
		if (!address) {
			return;
		}

		setVisible(true);

		const balance = await nekocoinContract.balance_of(address);
		console.log("balance: ", balance);

		const allowance = await nekocoinContract.allowance(
			account.address,
			NEKOMOTO_ADDRESS
		);
		console.log("allowance: ", allowance);

		if (new BigNumber(balance).lt(new BigNumber(count * 25000 * 10 ** 18))) {
			// console.log(
			// 	"balance: ",
			// 	new BigNumber(balance),
			// 	new BigNumber(count * 25000 * 10 ** 18)
			// );
			setText("Insufficient balance");
			return;
		}

		if (new BigNumber(allowance).lt(new BigNumber(count * 25000 * 10 ** 18))) {
			// console.log("allowance: ", BigInt(allowance), count * 25000 * ( 10 ** 18 ))
			const approve = await account.execute([
				{
					contractAddress: NEKOCOIN_ADDRESS,
					entrypoint: "approve",
					calldata: CallData.compile({
						spender: NEKOMOTO_ADDRESS,
						amount: cairo.uint256(BigInt(count) * 25000n * 10n ** 18n),
					}),
				},
			]);
			console.log("approve: ", approve);
			const approveResult = await waitTx(approve.transaction_hash);
			console.log("approveResult: ", approveResult);
		}

		const { typedMessage, signature } = await sign(account);
		// console.log("typedMessage: ", typedMessage);
		// console.log("signature: ", signature);
		// return

		const result = await BACKEND.summonBox(
			address,
			count,
			typedMessage,
			signature
		);
		console.log("result: ", result);
		setText("Waiting for transaction: " + result.data);
		if (result.success) {
			const summonResult = await waitTx(result.data);
			console.log("summonResult: ", summonResult);
			setText("Success: " + result.data);
		} else {
			setText("Something went wrong: " + result.message);
		}
	};

	return (
		<div>
			<NekoModal
				open={visible}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => {
					setVisible(false);
					setText("");
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
					<h2
						style={{
							textAlign: "center",
							color: "#01dce4",
							fontFamily: "BIG SHOT",
							fontWeight: "bold",
							wordWrap: "break-word",
							wordBreak: "break-all",
						}}
					>
						{text !== "" ? text : "Please sign in your wallet and wait..."}
					</h2>

					{/* {text && text == "Insufficient balance" && (
						<Button
							style={{
								marginTop: "20px",
								fontSize: "15px",
								flexDirection: "row",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							text={"Buy NPO"}
							color={"yellow"}
							longness="long"
							onClick={() => {}}
						/>
					)} */}
					{text && text != "Insufficient balance" && (
						<Button
							style={{
								marginTop: "20px",
								fontSize: "15px",
								flexDirection: "row",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							text={"Go Check"}
							color={"yellow"}
							longness="long"
							onClick={() => navigate("/detail2")}
						/>
					)}
				</div>
			</NekoModal>

			<div className="input-card">
				<BoxBorder />
				<Row gutter={32}>
					<Col className="text-center" style={{ width: "50%" }}>
						<Row>
							<div
								style={{
									fontFamily: "BIG SHOT",
									color: "white",
									fontSize: "20px",
									marginLeft: "25px",
									marginBottom: "10px",
								}}
							>
								{"Summon"}
							</div>
							<span>
								<img
									src={exclamation}
									style={{ height: "20px", marginLeft: "10px" }}
								/>
							</span>
						</Row>
						<img src={mintPagePic} width={"100%"} />
					</Col>
					<Col style={{ width: "50%", paddingRight: "16px" }}>
						<Flex gap={16} vertical style={{ width: "100%" }}>
							<Col style={{ justifyContent: "flex-end", display: "flex" }}>
								<img src={mintPagePic2} width={"70%"} />
							</Col>
							<Col style={{ width: "100%" }}>
								<Row gutter={16}>
									<Col style={{ width: "100%", marginTop: "16px" }}>
										<div
											className="flex justify-between"
											style={{ marginBottom: "12px" }}
										>
											<div className="input-card-text1 font-14px">Amount</div>
											<div
												className="input-card-text2 font-14px"
												style={{ display: "flex", gap: "20px" }}
											>
												<div
													className={"text6"}
													style={{ cursor: "pointer" }}
													onClick={() => setInputValue("5")}
												>
													x5
												</div>
												<div
													className={"text6"}
													style={{ cursor: "pointer" }}
													onClick={() => setInputValue("10")}
												>
													x10
												</div>
												<div
													className={"text6"}
													style={{ cursor: "pointer" }}
													onClick={() => setInputValue("20")}
												>
													x20
												</div>
											</div>
										</div>
										<Input
											placeholder="Enter Amount (x20 max)"
											// type="number"
											size="large"
											className="input-card-input"
											style={{}}
											value={inputValue}
											onChange={(e) => {
												const v = Math.ceil(Number(e.target.value));
												if (isNaN(v)) {
													setInputValue("Enter your amount");
												} else {
													setInputValue(v > 20 ? "20" : v.toString());
												}
											}}
										/>
									</Col>
								</Row>
								<Col
									className="text-center"
									style={{ marginTop: "16px", width: "100%" }}
								>
									<Button
										text={
											<div
												style={{
													display: "flex",
													alignContent: "center",
													textAlign: "center",
													flexDirection: "column",
													width: "100%",
													height: "20px",
												}}
											>
												<div
													style={{
														width: "100%",
														height: "70%",
														fontSize: "16px",
														marginTop: "-5px",
														marginBottom: "3px",
													}}
												>
													{"Mint"}
												</div>
												<div style={{ height: "30%" }}>
													<img
														src={blue}
														style={{
															height: "200%",
															marginRight: "12px",
															transform: "translateY(15%)",
														}}
													/>
													<span style={{ color: "#636363", fontSize: "12px" }}>
														{!isNaN(inputValue) && inputValue > 0
															? addCommaInNumber(inputValue * 25000, true)
															: 0}
													</span>
												</div>
											</div>
										}
										color="yellow"
										longness="long"
										style={{ width: "100%", height: "100%" }}
										onClick={
											!isNaN(inputValue) && inputValue > 0
												? () => mint(Number(inputValue))
												: null
										}
									/>
								</Col>
							</Col>
						</Flex>
					</Col>
				</Row>
			</div>
		</div>
	);
}
