import { Button, Col, Flex, Row } from "antd";
import BoxBorder from "../BoxBorder";
import CardDetail from "../CardDetail";
import RadioButton from "../RadioButton";
import "./index.css";

import m1 from "@assets/modal-icon1.png";
import m2 from "@assets/modal-icon2.png";
import m3 from "@assets/modal-icon3.png";
import m4 from "@assets/modal-icon4.png";
import m5 from "@assets/modal-icon5.png";

export default function NekomotoPreview({
	addressInfo,
	nekoButton,
	setNekoButton,
	setFocus,
	unstake,
	unStakeAll,
	stake,
	stakeAll,
}) {
	const StakeButton = ({ mainTitle, subTitle, func, condition }) => {
		return (
			<>
				<div
					style={{
						marginRight: "18px",
						fontSize: "12px",
						cursor: condition ? "pointer" : "default",
						color: "black",
						backgroundColor: "#ede6c5",
						borderRadius: "20px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						padding: "2px 16px",
						// filter: condition ? "" : "grayscale(0.5)",
						opacity: condition ? 1 : 0.5,
					}}
					className={condition ? "stake-button" : ""}
					onClick={condition ? func : null}
				>
					{mainTitle}
					{subTitle && (
						<div style={{ fontSize: "8px", margin: "0" }}>{subTitle}</div>
					)}
				</div>
			</>
		);
	};

	return (
		<>
			<div className="pool-card" style={{ height: "100%" }}>
				<BoxBorder />
				<div className="card-title">
					{"My Neko (" +
						addressInfo.NekoSpiritList?.filter((item) => item.IsStaked === true)
							.length +
						"/" +
						addressInfo.NekoSpiritList?.length +
						")"}
				</div>
				<Flex
					style={{ margin: "24px 0" }}
					justify="space-between"
					align="center"
				>
					<div>
						<RadioButton
							text="all"
							active={nekoButton === "all"}
							onClick={() => setNekoButton("all")}
						/>
						<RadioButton
							text="UR"
							active={nekoButton === "UR"}
							onClick={() => setNekoButton("UR")}
						/>
						<RadioButton
							text="SSR"
							active={nekoButton === "SSR"}
							onClick={() => setNekoButton("SSR")}
						/>
						<RadioButton
							text="SR"
							active={nekoButton === "SR"}
							onClick={() => setNekoButton("SR")}
						/>
						<RadioButton
							text="R"
							active={nekoButton === "R"}
							onClick={() => setNekoButton("R")}
						/>
						<RadioButton
							text="N"
							active={nekoButton === "N"}
							onClick={() => setNekoButton("N")}
						/>
					</div>
				</Flex>

				<Flex style={{ justifyContent: "end" }}>
					<StakeButton
						mainTitle="Stake All"
						subTitle="Batch"
						func={stakeAll}
						condition={
							addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
								.length > 0
						}
					/>
					<StakeButton
						mainTitle="Stake All"
						subTitle="Successive"
						func={stakeAll}
						condition={
							addressInfo.NekoSpiritList?.filter((item) => !item.IsStaked)
								.length > 0
						}
					/>
					<StakeButton
						mainTitle="Stake All"
						subTitle="Successive"
						func={unStakeAll}
						condition={
							addressInfo.NekoSpiritList?.filter((item) => item.IsStaked)
								.length > 0
						}
					/>
				</Flex>

				<Row gutter={16}>
					{addressInfo.NekoSpiritList?.filter((item) =>
						nekoButton === "all"
							? true
							: item.Rarity?.toLowerCase() === nekoButton.toLowerCase()
					).map((item, index) => {
						return (
							<Col xs={12} sm={12} lg={4} key={index}>
								<Flex className="card-item" justify="center" vertical="column">
									<CardDetail item={item} onClick={() => setFocus(item)} />
									<Button
										style={{ marginTop: "10px" }}
										onClick={
											item.IsStaked
												? () => {
														setFocus(item);
														unstake(item.TokenId);
												  }
												: () => {
														setFocus(item);
														stake(item.TokenId);
												  }
										}
										text={item.IsStaked ? "UNSTAKE" : "STAKE"}
										color={item.IsStaked ? "orange" : "yellow"}
										longness="short"
									/>
								</Flex>
							</Col>
						);
					})}
				</Row>
			</div>
		</>
	);
}
