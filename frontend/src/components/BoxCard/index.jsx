import "./index.css";
import box from "@assets/box1.png";
import blueGemBgImg from "@assets/blue-gem-bg.png";
import { Col, Row } from "antd";
import Button from "@components/Button/index";
import BoxBorder from "@components/BoxBorder/index";
import exclamation from "@assets/exclamation.png";

export default function BoxCard({
	type,
	title,
	desc,
	subTitle,
	buttonText = "open",
	onButtonClick,
	subPic = false,
	subFunc = null,
}) {
	return (
		<div className="box-card">
			<BoxBorder />
			<Row justify="center" gutter>
				<Col xs={24} className="text-center">
					<img
						src={type === "gem" ? blueGemBgImg : box}
						width={type === "gem" ? 90 : 56}
					/>
				</Col>

				<Col
					xs={24}
					className="card-sub-title text-center"
					style={{ marginTop: "16px" }}
				>
					{title}
				</Col>
				{desc && (
					<Col
						xs={24}
						className="card-sub-text text-center"
						style={{ marginTop: "4px" }}
					>
						{desc}
					</Col>
				)}
				{subTitle && (
					<Col
						xs={24}
						className="card-desc-title text-center"
						style={{ marginTop: "4px" }}
					>
						{subTitle}
						<img
							width={14}
							style={{ marginLeft: "8px", marginTop: "4px" }}
							src={exclamation}
							alt=""
							onClick={subFunc}
						/>
					</Col>
				)}

				<Col xs={24} className="text-center" style={{ marginTop: "24px" }}>
					<Button
						text={buttonText}
						color="yellow"
						longness="short"
						onClick={onButtonClick}
					/>
				</Col>
			</Row>
		</div>
	);
}
