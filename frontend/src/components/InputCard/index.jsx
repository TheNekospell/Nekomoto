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
} from "@/interface.js";
import { cairo, CallData } from "starknet";
import NekoModal from "@components/Modal/index.jsx";
import CardCorner from "@components/CardCorner/index.jsx";
import card3 from "@assets/card3.png";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";

export default function InputCard() {
	const { device } = useAppStore();

	const { account, address, status, chainId, isConnected } = useAccount();
	const [inputValue, setInputValue] = useState(0);
	const [allowance, setAllowance] = useState(0);
	const [visible, setVisible] = useState(false);
	const [text, setText] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!address) return;
		const allowance = async () => {
			return await nekocoinContract.allowance(
				account.address,
				NEKOMOTO_ADDRESS
			);
		};
		try {
			allowance().then((res) => {
				console.log("allowance: ", res);
				setAllowance(res);
			});
		} catch (e) {
			console.log("allowance error: ", e);
		}
	}, [address]);

	const mint = async (count) => {
		console.log("count: ", count);
		if (!address) {
			return;
		}

		setVisible(true);

		if (new BigNumber(allowance) < new BigNumber(count * 25000 * 10 ** 18)) {
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
			setText("Success: ", result.data);
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

					{text && (
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

			<div className="input-card  ">
				<BoxBorder />
				<Row gutter={32}>
					<Col className="input-card-logo text-center" xs={24} sm={6}>
						<img src={inputCardLogo} width={144} />
					</Col>
					<Col xs={24} sm={18}>
						<Flex gap={16} vertical>
							<Col className={`card-title ${device}-center`}>Summon</Col>
							<Col>
								<Row gutter={16} justify={{ xs: "center", sm: "start" }}>
									<Col xs={24} sm={16}>
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
										{/*<input*/}
										{/*    className="input-card-input"*/}
										{/*    placeholder="Enter Amount"*/}
										{/*    type="text"*/}
										{/*/>*/}
										<Input
											placeholder="Enter Amount (x20 max)"
											// type="number"
											size="large"
											className="input-card-input"
											// style={{margin: "12px 0"}}
											value={inputValue}
											onChange={(e) => {
												const v = Math.ceil(Number(e.target.value));
												if (isNaN(v)) {
													setInputValue("0");
												} else {
													setInputValue(v > 20 ? "20" : v.toString());
												}
											}}
										/>
									</Col>
									<Col
										xs={24}
										sm={6}
										className="text-center"
										style={{ marginTop: "32px" }}
									>
										<Button
											text="Mint"
											color="yellow"
											longness="short"
											onClick={
												inputValue > 0 ? () => mint(Number(inputValue)) : null
											}
										/>
									</Col>
								</Row>
							</Col>

							<Col className={`input-card-text3 font-14px ${device}-center`}>
								{inputValue * 25000} NKO
							</Col>
						</Flex>
					</Col>
				</Row>
			</div>
		</div>
	);
}
