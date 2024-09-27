import exclamation from "@assets/exclamation.png";
import BoxBorder from "../BoxBorder";
import ratePic from "@assets/rate.png";
import rateMark from "@assets/rate-mark.png";
import rateMark2 from "@assets/rate-mark2.png";

export default function UnlockRate({ rate = 60 }) {
	const RateUnit = ({ percent, value }) => {
		const mark = percent <= rate + 10;
		return (
			<>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div
						style={{ fontSize: "15px", color: mark ? "#FBA323" : "#90A6AF" }}
					>
						{percent + "%"}
					</div>
					<img
						src={mark ? rateMark : rateMark2}
						style={{ scale: "50%", transform: "translateX(-5px)" }}
						alt={""}
					/>
					<div
						style={{ fontSize: "15px", color: mark ? "#FBA323" : "#90A6AF" }}
					>
						{value + " K"}
					</div>
				</div>
			</>
		);
	};

	return (
		<>
			<div
				style={{
					backgroundColor: "#1d3344",
					padding: "20px 20px",
					fontFamily: "BIG SHOT",
					position: "relative",
					color: "white",
				}}
			>
				<BoxBorder />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "start",
						alignItems: "center",
					}}
				>
					<div style={{ fontSize: "20px" }}>Global Unlock Rate</div>
					<img src={exclamation} style={{ height: "16px",marginLeft: "10px" }} alt="" />
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: "10px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<img src={ratePic} style={{ height: "60px" }} alt="" />
						<div
							style={{
								color: "#FBA323",
								fontSize: "30px",
								position: "absolute",
								textShadow:
									"2px 0 0 black, -2px 0 0 black, 0 2px 0 black, 0 -2px 0 black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black",
								transform: "translateY(40%)",
							}}
						>
							{rate + "%"}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginLeft: "20px",
						}}
						className="grey-text"
					>
						<div style={{ fontSize: "13px", marginBottom: "38px" }}>LV.</div>
						<div style={{ fontSize: "13px" }}>LV.</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							marginLeft: "10px",
							width: "100%",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								width: "100%",
								position: "relative",
							}}
						>
							<div
								style={{
									width: "93%",
									height: "9px",
									backgroundColor: "#22495C",
									borderRadius: "4px",
									transform: "translateX(10px)",
									position: "absolute",
								}}
							/>
							<div
								style={{
									width: Math.max(0, ((rate - 50) / 50) * 93) + 1 + "%",
									height: "9px",
									backgroundColor: "#E9D78E",
									borderRadius: "4px",
									transform: "translateX(10px)",
									position: "absolute",
								}}
							/>
							<RateUnit percent={50} value={0} rate={rate} />
							<RateUnit percent={60} value={200} rate={rate} />
							<RateUnit percent={70} value={300} rate={rate} />
							<RateUnit percent={80} value={400} rate={rate} />
							<RateUnit percent={90} value={500} rate={rate} />
							<RateUnit percent={100} value={600} rate={rate} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
