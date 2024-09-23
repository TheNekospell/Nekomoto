import purple1 from "@assets/purple1.png";
import seven from "@assets/seven.png";
import BoxBorder from "../BoxBorder";

export default function CheckCard() {
	const CheckItem = () => {
		return (
			<>
				<div
					className="grey-text"
					style={{
						borderRadius: "4px",
						padding: "10px",
						backgroundColor: "rgba(14, 39, 54, 1)",
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center",
						margin: "5px 5px",
						height: "100%",
					}}
				>
					<div>{"MON"}</div>
					<img src={purple1} style={{ height: "25px" }} />
				</div>
			</>
		);
	};

	return (
		<>
			<div
				style={{
					backgroundColor: "#1d3344",
					position: "relative",
					padding: "10px 20px",
					height: "100%",
					width: "100%",
					fontFamily: "BIG SHOT",
				}}
			>
				<BoxBorder />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						width: "100%",
						height: "100%",
						justifyContent: "space-between",
						textAlign: "center",
					}}
				>
					{/* daily check-in */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							alignContent: "center",
							width: "25%",
							height: "100%",
						}}
					>
						<div style={{ color: "white" }}>{"Daily Check-in"}</div>
						<img src={seven} style={{ height: "60px" }} />
						<div className="grey-text">{"accumulate days"}</div>
					</div>
					{/* check week */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							width: "75%",
							height: "100%",
							alignItems: "center",
							marginLeft: "15px",
							justifyContent: "space-between",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
							}}
						>
							<CheckItem />
							<CheckItem />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
							}}
						>
							<CheckItem />
							<CheckItem />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
							}}
						>
							<CheckItem />
							<CheckItem />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
								height: "100%",
							}}
						>
							<CheckItem style={{ width: "100px" }} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
