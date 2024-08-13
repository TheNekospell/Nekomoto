import "./index.css";
import InputCard from "@components/InputCard/index";
import BoxCard from "@components/BoxCard/index";
import InfoCard from "@components/InfoCard/index";
import Table from "@components/Table/index";

import PCHeader from "@components/PCHeader/index";
import logoText from "@assets/text-logo.png";
import play from "@assets/play.png";
import { Col, Flex, Row } from "antd";
import { useEffect, useState } from "react";
import { BACKEND, NEKOMOTO_ADDRESS } from "@/interface.js";
import { useAccount } from "@starknet-react/core";
import NekoModal from "@components/Modal/index.jsx";
import CardCorner from "@components/CardCorner/index.jsx";
import card3 from "@assets/card3.png";
import Button from "@components/Button/index.jsx";
import { CallData } from "starknet";
import { useNavigate } from "react-router-dom";
import CardDetail from "@components/CardDetail/index.jsx";

const style = { background: "#0092ff", padding: "8px 0" };

export default function Assets() {
	const [info, setInfo] = useState({});
	const { account, address, status, chainId, isConnected } = useAccount();
	const [isModalOpen1, setIsModalOpen1] = useState(false);
	const navigate = useNavigate();
	const [addressInfo, setAddressInfo] = useState({});
	const [hhh, setHhh] = useState("");

	useEffect(() => {
		BACKEND.staticInfo().then((result) => {
			console.log("static info: ", result.data);
			setInfo(result.data);
		});
		if (address) {
			BACKEND.addressInfo(address).then((result) => {
				console.log("address info: ", result.data);
				setAddressInfo(result.data);
			});
		}
	}, [address, hhh]);

	useEffect(() => {
		const interval = setInterval(() => {
			setHhh(new Date().getTime().toString());
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const openChest = async () => {
		const multiCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "starter_pack",
				calldata: CallData.compile({}),
			},
		]);
		// console.log("multiCall: ", multiCall)
		const result = await account.waitForTransaction(multiCall.transaction_hash);
		console.log("result: ", result);
		setIsModalOpen1(true);
	};

	return (
		<div>
			<NekoModal
				title="Starter Pack"
				open={isModalOpen1}
				onCancel={() => setIsModalOpen1(false)}
			>
				<Flex justify="center" vertical="column">
					<div className="modal-card">
						<div className="modal-card-inner">
							<CardCorner />
							{/* <img src={card3} width={192} alt=""/> */}
							<CardDetail
								item={{
									Level: 1,
									SPI: 5,
									ATK: 3,
									DEF: 3,
									SPD: 1,
									Fade: 125,
									Mana: 0.234,
									Rarity: "Common",
								}}
							/>
						</div>
					</div>
					<Button
						text="GO CHECK"
						color="yellow"
						longness="short"
						style={{ marginTop: "48px" }}
						onClick={() => navigate("/detail2")}
					/>
				</Flex>
			</NekoModal>

			<div className="assets padding-top-80 padding-bottom-80">
				<Row gutter={16}>
					<Col
						style={{ marginTop: "16px" }}
						className="gutter-row"
						xs={24}
						sm={24}
						lg={18}
					>
						<InputCard />
					</Col>
					<Col
						style={{ marginTop: "16px" }}
						className="gutter-row"
						xs={24}
						sm={24}
						lg={6}
					>
						<BoxCard
							title="Starter Pack"
							buttonText={
								addressInfo.IsStarter === true ? "open" : "already opened"
							}
							onButtonClick={addressInfo.IsStarter === true ? openChest : null}
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: "16px", marginBottom: "16px" }}>
					<Col xs={24}>
						<InfoCard
							totalRewards={info.totalRewards}
							treasuryRevenue={info.treasuryRevenue}
							totalBurn={info.totalBurn}
						/>
					</Col>
				</Row>

				<Row>
					<Table records={info.treasuryRevenue} />
				</Row>
			</div>
		</div>
	);
}
