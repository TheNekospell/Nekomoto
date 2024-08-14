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

	// useEffect(() => {
	// 	connect({connector});
	// }, []);

	useEffect(() => {
		const target = SN_SEPOLIA;
		console.log("chainId: ", chainId, uint256.uint256ToBN(target));
		if (chainId !== uint256.uint256ToBN(target) && !isMobile) {
			window?.starknet?.request({
				type: "wallet_switchStarknetChain",
				params: {
					chainId: "SN_SEPOLIA",
				},
			});
		}

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
		setTestCode("");
		BACKEND.addressInfo(address).then((result) => {
			setAddressInfo(result.data);
		});
	};

	const items = [
		{
			key: "1",
			label: (
				<Flex
					align="center"
					className="header-btn2"
					justify="space-between"
					onClick={() => navigate("/detail2")}
				>
					<img src={t5} width={15} style={{ marginRight: "6px" }} alt="" />
					<span>My Assets</span>
				</Flex>
			),
		},
		{
			key: "2",
			label: (
				<Flex align="center" justify="space-between" className="header-btn2">
					<img src={t6} width={15} style={{ marginRight: "6px" }} alt="" />
					<span>Buy NKO</span>
				</Flex>
			),
		},
		{
			key: "3",
			label: (
				<Flex
					align="center"
					justify="flex-start"
					style={{ width: "100%", textAlign: "left" }}
				>
					{address && isConnected ? (
						<div className="header-btn2" onClick={() => setVisible(true)}>
							{address.slice(0, 6) + "..." + address.slice(-4)}
						</div>
					) : (
						<div
							className="header-btn"
							onClick={() => {
								// setVisible(true);
								connect({ connector: new ArgentMobileConnector() });
							}}
						>
							Connect Wallet
						</div>
					)}{" "}
				</Flex>
			),
		},
	];

	return (
		<div>
			{!isMobile ? (
				<Row>
					<Col className="header-btn2" onClick={() => navigate("/detail2")}>
						<Flex align="center" justify="space-between">
							<img src={t5} width={15} style={{ marginRight: "6px" }} alt="" />
							<span>My Assets</span>
						</Flex>
					</Col>
					<Col
						className="header-btn2"
						style={{ margin: "0px 12px" }}
						// onClick={valid}
					>
						{/*<Flex align="center" justify="space-between">*/}
						<Flex align="center">
							{/*<img*/}
							{/*    src={blue}*/}
							{/*    width={20}*/}
							{/*    style={{marginRight: "6px"}}*/}
							{/*    alt=""*/}
							{/*/>*/}
							<img src={t6} width={15} style={{ marginRight: "6px" }} alt="" />
							<span>Buy NKO</span>
						</Flex>
					</Col>
					<Col style={{ width: "170px", textAlign: "center" }}>
						{address && isConnected ? (
							<div className="header-btn2" onClick={() => setVisible(true)}>
								{address.slice(0, 6) + "..." + address.slice(-4)}
							</div>
						) : (
							<div
								className="header-btn"
								onClick={() => {
									setVisible(true);
								}}
							>
								Connect Wallet
							</div>
						)}
					</Col>
				</Row>
			) : (
				<Dropdown menu={{ items }} placement="bottomRight">
					<img src={t7} width={18} alt="" />
				</Dropdown>
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
					onCancel={() => setVisible(false)}
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
											onClick={testCode !== "" ? () => active(testCode) : null}
										/>
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
								<div>
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
								</div>
							</div>
						)}
					</div>
				</NekoModal>
			)}
		</div>
	);
}
