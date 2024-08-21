import "./index.css";
import box from "@assets/box1.png";
import { Col, Row } from "antd";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import { useEffect, useState } from "react";
import { BACKEND, addCommaInNumber } from "@/interface.js";

export default function InfoCard({ totalRewards, treasuryRevenue, totalBurn }) {
	const [usd, setUsd] = useState(0);

	useEffect(() => {
		BACKEND.getPriceUSD().then((priceUSD) => {
			if (
				priceUSD &&
				priceUSD.pairs &&
				priceUSD.pairs[0] &&
				priceUSD.pairs[0].priceUsd
			) {
				console.log("priceUSD: ", priceUSD);
				setUsd(priceUSD.pairs[0].priceUsd);
			}
		});
	}, []);

	return (
		<div className="info-card">
			<BoxBorder />

			<Row justify="center" align="center">
				<Col xs={24} sm={24} lg={12}>
					<div className="card-sub-title">Total Rewards</div>
					<div className="num-60" style={{ margin: "16px 0 8px" }}>
						{addCommaInNumber(totalRewards)}
						<span className="card-sub-title">NPO</span>
					</div>
					{usd > 0 && (
						<div className="grey-text">
							{addCommaInNumber(usd * totalRewards)} USD
						</div>
					)}
				</Col>

				<Col xs={24} sm={24} lg={12} style={{ alignSelf: "center" }}>
					<Row gutter={[16, 16]} className="text-center">
						<Col xs={12} sm={12} lg={7}>
							<div className="info-item">
								<div className="card-sub-title">{addCommaInNumber(usd)}</div>
								<div className="grey-text" style={{ marginTop: "12px" }}>
									NPO Price
								</div>
							</div>
						</Col>
						<Col xs={12} sm={12} lg={7}>
							<div className="info-item">
								<div className="card-sub-title">
									{addCommaInNumber(
										treasuryRevenue?.reduce((acc, cur) => acc + cur.Count, 0) *
											25000
									)}
								</div>
								<div className="grey-text" style={{ marginTop: "12px" }}>
									Total Marketcap
								</div>
							</div>
						</Col>
						<Col xs={12} sm={12} lg={7}>
							<div className="info-item">
								<div className="card-sub-title">
									{addCommaInNumber(totalBurn)}
								</div>
								<div className="grey-text" style={{ marginTop: "12px" }}>
									Total Burn
								</div>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
}
