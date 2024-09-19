// import { connect, disconnect, useStarknetkitConnectModal } from "starknetkit"
import { useEffect, useState } from "react";
import { Col, Flex, Row, Modal, Input, Dropdown } from "antd";

import x from "@assets/x.png";
import t1 from "@assets/ti1.png";
import t2 from "@assets/ti2.png";
import t3 from "@assets/ti3.png";
import t4 from "@assets/ti4.png";
import t5 from "@assets/ti5.png";
import t6 from "@assets/ti6.png";
import t7 from "@assets/ti7.png";

import prismPic from "@assets/purple.png";
import nkoPic from "@assets/blue.png";
import nekoPic from "@assets/page-nekomoto.png";
import accountPic from "@assets/account.png";

import blue from "@assets/blue.png";
import user from "@assets/user.png";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { BACKEND, sign } from "@/interface.js";
import { typedData, shortString, uint256, hash } from "starknet";
import Button from "@components/Button/index.jsx";
import NekoModal from "@components/Modal/index.jsx";
import { ArgentMobileConnector } from "starknetkit/argentMobile";

const SN_MAIN = "0x534e5f4d41494e"; // encodeShortString('SN_MAIN'),
const SN_SEPOLIA = "0x534e5f5345504f4c4941"; // encodeShortString('SN_SEPOLIA')

export default function Wallet({ isMobile = false }) {
	const navigate = useNavigate();

	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { account, address, status, chainId, isConnected } = useAccount();

	const [inputValue, setInputValue] = useState("");
	const [visible, setVisible] = useState(false);
	const [accept, setAccept] = useState(false);

	const [text, setText] = useState("");

	const [testCode, setTestCode] = useState("");
	const [addressInfo, setAddressInfo] = useState({ Active: false });

	const [faucetInterval, setFaucetInterval] = useState(false);
	const [faucetResult, setFaucetResult] = useState(
		// "The current round of testing has ended. Thank you for your attention."
		""
	);

	const [activeResult, setActiveResult] = useState("");

	const [prismBalance, setPrismBalance] = useState(0);
	const [nkoBalance, setNkoBalance] = useState(0);

	// useEffect(() => {
	// 	connect({connector});
	// }, []);

	useEffect(() => {
		const target = SN_SEPOLIA;
		console.log("chainId: ", chainId, uint256.uint256ToBN(target));
		// if (chainId !== uint256.uint256ToBN(target) && !isMobile) {
		// 	window?.starknet?.request({
		// 		type: "wallet_switchStarknetChain",
		// 		params: {
		// 			chainId: "SN_SEPOLIA",
		// 		},
		// 	});
		// }

		BACKEND.addressInfo(address).then((result) => {
			const addressInfo = result.data;
			setAddressInfo(addressInfo);
			if (addressInfo.Active) {
				if (inputValue !== "" && address) {
					console.log("accept invitation: ", inputValue, account);
					sign(account).then(({ typedMessage, signature }) => {
						BACKEND.acceptInvitation(
							address,
							inputValue,
							typedMessage,
							signature
						).then((result) => {
							console.log("accept result: ", result);
							setAccept(true);
							if (result.success) {
								setText(result.data);
							} else {
								setText(result.message);
							}
						});
					});
				}
				setInputValue("");
			}
		});
	}, [address, chainId]);

	const establishConnection = async (connector) => {
		await connect({ connector });
		setVisible(false);
	};

	const closeConnection = async () => {
		setVisible(false);
		await disconnect();
	};

	const valid = async () => {
		const { typedMessage, signature } = await sign(account);
		// console.log("typedMessage: ", typedMessage);
		// console.log("signature: ", signature);
		const result = await BACKEND.verifySignature(
			address,
			typedMessage,
			signature
		);
		console.log("result: ", result);
	};

	const active = async (code) => {
		// const { typedMessage, signature } = await sign(account);
		const result = await BACKEND.activeAddress(address, code);
		console.log("active result: ", result);
		if (!result.success) {
			setActiveResult(result.message + ", please try again");
			// setInterval(() => {
			// 	setActiveResult("");
			// }, 10000);
		}
		setTestCode("");
		BACKEND.addressInfo(address).then((result) => {
			setAddressInfo(result.data);
		});
	};

	return (
		<div>
			<Row>
				{address && (
					<Col
						className="header-btn2"
						style={{
							width: "100px",
							// margin: "0px 12px",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Flex align="center" justify="space-between">
							<img
								src={prismPic}
								style={{ marginRight: "10px", height: "30px" }}
								alt=""
							/>
							<span style={{ color: "white" }}>{prismBalance}</span>
						</Flex>
					</Col>
				)}
				{address && (
					<Col
						className="header-btn2"
						style={{
							width: "130px",
							margin: "0px 12px",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Flex
							align="center"
							justify="space-between"
							style={{ width: "100px" }}
						>
							<img
								src={nkoPic}
								style={{ marginRight: "10px", height: "20px" }}
								alt=""
							/>
							<span style={{ color: "white" }}>{nkoBalance}</span>
						</Flex>
						<img src={t6} width={15} style={{ marginLeft: "10px" }} alt="" />
					</Col>
				)}
				{address && (
					<Col
						className="header-btn2"
						style={{
							width: "100px",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Flex
							align="center"
							justify="space-between"
							style={{ width: "100px" }}
						>
							<img
								src={nekoPic}
								style={{ marginRight: "10px", height: "25px" }}
								alt=""
							/>
							<span style={{ color: "white" }}>{0}</span>
						</Flex>
					</Col>
				)}
				<Col
					className={isConnected ? "header-btn2" : "header-btn"}
					style={{
						width: "200px",
						height: "50px",
						textAlign: "center",
						marginLeft: "12px",
						display: "flex",
						alignItems: "center",
					}}
				>
					{address && isConnected ? (
						<div
							style={{
								width: "100%",
								height: "100%",
								// textAlign: "center",
								alignItems: "center",
								display: "flex",
								flexDirection: "row",
								// justify: "space-between",
								justifyContent: "center",
							}}
							onClick={() => setVisible(true)}
						>
							<img
								src={accountPic}
								style={{ marginRight: "10px", height: "20px" }}
							/>

							<span style={{ textAlign: "center", display: "flex" }}>
								{address.slice(0, 6) + "..." + address.slice(-4)}
							</span>
						</div>
					) : (
						<div style={{ width: "100%" }}>Connect Wallet</div>
					)}
				</Col>
			</Row>
			{/* ) : (
				<Dropdown menu={{ items }} placement="bottomRight">
					<img src={t7} width={18} alt="" />
				</Dropdown>
			)} */}

			{faucetResult && (
				<NekoModal
					open={faucetResult !== ""}
					centered={true}
					footer={null}
					maskClosable={true}
					onCancel={() => setFaucetResult("")}
				>
					<div
						style={{
							alignItems: "center",
							justifyContent: "center",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div
							style={{
								fontSize: "20px",
								textAlign: "center",
								// marginLeft: "10px",
								// marginTop: "15px",
								marginBottom: "20px",
								fontFamily: "BIG SHOT",
								color: "#01dce4",
								fontWeight: "bold",
							}}
						>
							{faucetResult}
						</div>
						{faucetResult === "Successful transferred 250,000 NPO" && (
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
								onClick={() => setFaucetResult("")}
							/>
						)}
					</div>
				</NekoModal>
			)}

			{accept && (
				<NekoModal
					open={accept}
					centered={true}
					footer={null}
					maskClosable={true}
					onCancel={() => setAccept(false)}
				>
					<div
						style={{
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
							}}
						>
							{text}
						</h2>
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
							onClick={() => setAccept(false)}
						/>
					</div>
				</NekoModal>
			)}

			{visible && (
				<NekoModal
					open={visible}
					centered={true}
					footer={null}
					maskClosable={true}
					onCancel={() => {
						setVisible(false);
						setActiveResult("");
					}}
				>
					<div>
						<h2
							style={{
								textAlign: "center",
								color: "#01dce4",
								fontFamily: "BIG SHOT",
								fontWeight: "bold",
							}}
						>
							{address && isConnected ? "" : "Connect Wallet"}
						</h2>
					</div>

					{/*<button*/}
					{/*    className={"header-btn"}*/}
					{/*    style={{marginTop: "20px", textAlign: "center"}}*/}
					{/*    onClick={sign}*/}
					{/*>*/}
					{/*    {"TEST"}*/}
					{/*</button>*/}

					<div
						style={{
							marginBottom: "15px",
							marginTop: "20px",
							textAlign: "center",
						}}
					>
						{address && isConnected ? (
							<div>
								<div
									style={{
										fontSize: "16px",
										textAlign: "center",
										marginLeft: "10px",
										fontFamily: "BIG SHOT",
										color: "#01dce4",
										fontWeight: "bold",
									}}
								>
									{address.slice(0, 6) + "..." + address.slice(-4)}
								</div>
								<div
									style={{
										fontSize: "16px",
										textAlign: "center",
										marginLeft: "10px",
										marginTop: "10px",
										fontFamily: "BIG SHOT",
										color: addressInfo.Active ? "#539371" : "grey",
										fontWeight: "bold",
									}}
								>
									{addressInfo.Active ? "Active" : "Not Active"}
								</div>
								{!addressInfo.Active && (
									<div>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												flexDirection: "row",
												marginTop: "20px",
												marginBottom: "10px",
											}}
										>
											<Input
												placeholder="Enter Game Test Code"
												// type="number"
												size="large"
												style={{ width: "200px", marginRight: "20px" }}
												// value={inputValue}
												onChange={(e) => {
													const v = e.target.value;
													if (v) {
														setTestCode(v);
													}
												}}
											/>
											<Button
												text="Active"
												color="yellow"
												longness="short"
												onClick={
													testCode !== "" ? () => active(testCode) : null
												}
											/>
										</div>
										{activeResult !== "" && (
											<div
												style={{
													fontSize: "16px",
													textAlign: "center",
													marginLeft: "10px",
													marginTop: "15px",
													fontFamily: "BIG SHOT",
													color: "white",
													fontWeight: "bold",
												}}
											>
												{activeResult}
											</div>
										)}
									</div>
								)}

								{/*<div*/}
								{/*    style={{*/}
								{/*        fontSize: "20px",*/}
								{/*        fontFamily: "BIG SHOT",*/}
								{/*        color: "#01dce4",*/}
								{/*        marginTop: "18px",*/}
								{/*        textAlign: "center",*/}
								{/*    }}*/}
								{/*>*/}
								{/*    {"My Invitor"}*/}
								{/*</div>*/}

								{/*<div*/}
								{/*    style={{*/}
								{/*        fontSize: "14px",*/}
								{/*        fontFamily: "BIG SHOT",*/}
								{/*        color: "#01dce4",*/}
								{/*        marginTop: "18px",*/}
								{/*        textAlign: "center",*/}
								{/*    }}*/}
								{/*>*/}
								{/*    {"Neko-xxxxxxx"}*/}
								{/*</div>*/}

								<Button
									style={{ marginTop: "20px", textAlign: "center" }}
									onClick={closeConnection}
									text={"Disconnect"}
									color={"yellow"}
									longness="long"
								/>
							</div>
						) : (
							<div>
								<ul>
									{connectors.map((connector) => (
										<div
											key={connector.id}
											style={{
												display: "flex",
												justifyContent: "center",
												marginTop: "20px",
												flexDirection: "row",
											}}
										>
											<button
												style={{
													fontSize: "15px",
													flexDirection: "row",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													width: "200px",
												}}
												className={"header-btn"}
												onClick={() => establishConnection(connector)}
											>
												{connector.icon && (
													<div
														style={{
															marginRight: "20px",
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
														}}
													>
														<img src={connector.icon.dark} width={30} alt="" />
													</div>
												)}
												{connector.name}
											</button>
										</div>
									))}
								</ul>
								{/* <div>
									<Input
										placeholder="Enter Invite Code"
										// type="number"
										size="large"
										style={{ marginTop: "30px", width: "200px" }}
										// value={inputValue}
										onChange={(e) => {
											const v = e.target.value;
											if (v) {
												setInputValue(v);
											}
										}}
									/>
								</div> */}
							</div>
						)}
					</div>
				</NekoModal>
			)}
		</div>
	);
}
