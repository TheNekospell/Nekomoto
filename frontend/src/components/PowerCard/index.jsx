import BoxBorder from "../BoxBorder";
import exclamation from "@assets/exclamation.png";
import lineV from "@assets/line-ver.png";

export default function PowerCard({ staticTotalPower, myPower }) {
	return (
		<>
			<div
				style={{
					backgroundColor: "#1d3344",
					padding: "15px 20px",
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
					<div style={{ fontSize: "20px" }}>Power</div>
					<img
						src={exclamation}
						style={{ height: "16px", marginLeft: "10px" }}
						alt=""
					/>
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
						className="grey-text"
						style={{
							borderRadius: "10px",
							padding: "20px 40px",
							backgroundColor: "rgba(14, 39, 54, 1)",
							alignContent: "center",
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							// width: "45%",
						}}
					>
						<div style={{ fontSize: "12px" }}>{"Global Power"}</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "10px",
							}}
						>
							<div style={{ fontSize: "30px", color: "white" }}>
								{staticTotalPower}
							</div>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							borderRadius: "10px",
							padding: "20px 40px",
							backgroundColor: "rgba(14, 39, 54, 1)",
						}}
					>
						<div
							className="grey-text"
							style={{
								alignContent: "center",
								alignItems: "center",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div style={{ fontSize: "12px" }}>{"Global Power"}</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginTop: "10px",
								}}
							>
								<div style={{ fontSize: "30px", color: "#DA3914" }}>
									{myPower}
								</div>
							</div>
						</div>
						<img
							src={lineV}
							style={{ width: "2px", height: "50px", margin: "0 30px" }}
						/>
						<div
							className="grey-text"
							style={{
								alignContent: "center",
								alignItems: "center",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<div style={{ fontSize: "12px" }}>{"Global Power"}</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									marginTop: "10px",
								}}
							>
								<div style={{ fontSize: "30px", color: "white" }}>
									{(myPower / staticTotalPower).toFixed(2) * 100 + "%"}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
