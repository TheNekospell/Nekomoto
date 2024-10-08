import BoxBorder from "@components/BoxBorder/index";
import exclamation from "@assets/exclamation.png";
import "./index.css";

import blue from "@assets/blue.png";
import luck from "@assets/luck.png";
import lineV from "@assets/line-ver.png";
import lineH from "@assets/line-hor.png";
import Button from "@components/Button/index";
import { addCommaInNumber, BACKEND } from "../../interface";
import { useAccount } from "@starknet-react/core";

export default function MintPoolCard({
	epoch,
	staticMintPool,
	staticTotalLuck,
	estMintPoolReward,
	mintPoolToClaim,
	setWaiting,
	setSuccess,
}) {

	const {address} = useAccount();

	const claim = async ()=>{
		setWaiting(true);
		const { typedMessage, signature } = await BACKEND.sign(account);
		const result = await BACKEND.claimReward(address, typedMessage, signature);
		console.log("result: ", result);
		setSuccess(true);
	}

	return (
		<>
			<div className="pool-card">
				<BoxBorder />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<div>
							<div style={{ fontSize: "35px" }}>MINTING</div>
							<div style={{ fontSize: "25px" }}>PRIZE POOL</div>
							<div style={{ display: "flex", alignItems: "center" }}>
								<div
									className="grey-text"
									style={{ fontSize: "11px", marginRight: "6px" }}
								>
									{"30% [Emission + Revenue]"}
								</div>
								<img src={exclamation} style={{ height: "16px" }} alt="" />
							</div>
						</div>
						<div>
							<div className="grey-text" style={{ fontSize: "15px" }}>
								{"Epoch #" + epoch}
							</div>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
						}}
					>
						<div className="grey-text" style={{ fontSize: "20px" }}>
							{"Current Pool"}
						</div>
						<div style={{ display: "flex", alignItems: "center" }}>
							<div style={{ fontSize: "40px" }}>{staticMintPool}</div>
							<img src={blue} style={{ height: "30px", marginLeft: "10px" }} />
						</div>
						<div
							className="grey-text"
							style={{
								borderRadius: "4px",
								padding: "10px",
								backgroundColor: "rgba(14, 39, 54, 1)",
								alignContent: "start",
							}}
						>
							<div style={{ display: "flex", alignItems: "center" }}>
								<div style={{ fontSize: "15px" }}>{"Overall Luck"}</div>
								<img
									src={exclamation}
									style={{ height: "16px", marginLeft: "10px" }}
								/>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									flexDirection: "row",
								}}
							>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<img src={luck} style={{ height: "30px" }} />
									<div style={{ fontSize: "20px", color: "white" }}>
										{staticTotalLuck}
									</div>
								</div>
								<img
									src={lineV}
									style={{ margin: "0px 10px", height: "25px" }}
								/>
								<div
									className="grey-text"
									style={{ display: "flex", flexDirection: "column" }}
								>
									<div style={{ fontSize: "15px" }}>
										{addCommaInNumber(staticMintPool / staticTotalLuck)}
									</div>
									<div style={{ fontSize: "10px" }}>{"NKO per Luck"}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<img src={lineH} style={{ width: "100%", height: "1px" }} />
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: "5px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}
					>
						<div>
							<div style={{ display: "flex", alignItems: "center" }}>
								<div style={{ fontSize: "25px" }}>{"My Est. Prize"}</div>
								<img src={exclamation} style={{ height: "12px" }} alt="" />
							</div>
							<div
								className="grey-text"
								style={{ fontSize: "11px", marginRight: "6px" }}
							>
								{"in current epoch"}
							</div>
						</div>
						<div style={{ display: "flex", alignItems: "center" }}>
							<img src={blue} style={{ height: "30px", marginRight: "10px" }} />
							<div style={{ fontSize: "35px" }}>{estMintPoolReward}</div>
						</div>
						<div>
							<div className="grey-text" style={{ fontSize: "15px" }}>
								{"Ends in 21:20:19"}
							</div>
						</div>
					</div>
					<div
						className="grey-text"
						style={{
							borderRadius: "4px",
							padding: "10px",
							backgroundColor: "rgba(14, 39, 54, 1)",
							alignContent: "center",
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							width: "45%",
						}}
					>
						<div style={{ fontSize: "15px" }}>{"Unclaimed Prize"}</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								marginTop: "5px",
							}}
						>
							<div style={{ fontSize: "20px", color: "#E9D78E" }}>
								{mintPoolToClaim}
							</div>
							<img src={blue} style={{ height: "20px", marginLeft: "10px" }} />
						</div>
						<Button
							text={
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
										width: "100%",
										height: "100%",
										fontSize: "12px",
									}}
									onClick={claim}
								>
									{"Claim"}
								</div>
							}
							color={"yellow"}
							longness={"long"}
							style={{ width: "100%", marginTop: "5px", height: "25px" }}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
