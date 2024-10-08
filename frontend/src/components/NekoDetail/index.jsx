import { Col, Row, Flex, Select, Modal } from "antd";
import CardCorner from "../CardCorner";
import CardDetail from "../CardDetail";
import { addCommaInNumber } from "../../interface";
import m1 from "@assets/modal-icon1.png";
import m2 from "@assets/modal-icon2.png";
import m3 from "@assets/modal-icon3.png";
import m4 from "@assets/modal-icon4.png";
import m5 from "@assets/modal-icon5.png";
import Button from "../Button";
import BoxBorder from "../BoxBorder";

export default function NekoDetail({ focus }) {
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

	return (
		<>
			<div className="pool-card">
				<BoxBorder />
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
													addCommaInNumber(upgradeCal[focus?.Level - 1].Prism)}
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
			</div>
		</>
	);
}
