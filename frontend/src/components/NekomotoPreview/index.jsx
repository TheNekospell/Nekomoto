import { Button, Col, Flex, Row } from "antd";
import BoxBorder from "../BoxBorder";
import CardDetail from "../CardDetail";
import RadioButton from "../RadioButton";

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
	stake,
}) {
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

				<Row gutter={16}>
					{addressInfo.NekoSpiritList?.filter((item) =>
						nekoButton === "all"
							? true
							: item.Rarity?.toLowerCase() === nekoButton.toLowerCase()
					).map((item, index) => {
						// console.log("index: ", item, index)
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
