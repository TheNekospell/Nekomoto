import purple1 from "@assets/purple1.png";
import seven from "@assets/seven.png";
import BoxBorder from "../BoxBorder";
import { useAccount } from "@starknet-react/core";
import { useMemo, useState } from "react";
import claimedMask from "@assets/claimed-mask.png";

import {
	BACKEND,
	NEKOCOIN_ADDRESS,
	nekocoinContract,
	NEKOMOTO_ADDRESS,
	nekomotoContract,
	PRISM_ADDRESS,
	prismContract,
	sign,
	addCommaInNumber,
} from "@/interface.js";
import { useEffect } from "react";

export default function CheckCard({ setWaiting, setSuccess }) {

	const { account, address } = useAccount();
	const [check_status, setCheckStatus] = useState(0);

	useEffect(() => {
		prismContract.read_check_in().then((result) => {
			setCheckStatus(result)
		})
	}, [address])

	const checkInContract = async () => {
		setWaiting(true)
		const mCall = await account.execute([
			{
				contractAddress: NEKOMOTO_ADDRESS,
				entrypoint: "check_in",
				calldata: CallData.compile({})
			}
		])
		const result = await account.waitForTransaction(mCall.transaction_hash);
		console.log("result: ", result);
		// setSuccess("Success: " + mCall.transaction_hash);
		if (result.execution_status === "SUCCEEDED") {
			setWaiting(false);
		}
	};

	const calCheckStatus = (check_status) => {
		return [
			check_status >> 7 & 1,
			check_status >> 6 & 1,
			check_status >> 5 & 1,
			check_status >> 4 & 1,
			check_status >> 3 & 1,
			check_status >> 2 & 1,
			check_status >> 1 & 1,
			check_status & 1
		]
	}

	const checkStatus = useMemo(() => calCheckStatus(check_status), [check_status])

	const today = () => {
		const date = new Date();
		return date.getUTCDay()
	}

	const CheckItem = ({ checkIn, title, click }) => {
		return (
			<>
				<div
					className="grey-text"
					style={{
						position: "relative",
						borderRadius: "4px",
						padding: "10px",
						backgroundColor: click ? "#E9D78E" : "rgba(14, 39, 54, 1)",
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center",
						margin: "5px 5px",
						height: "100%",
					}}
					onClick={click ? checkInContract : null}
				>
					<div style={{ opacity: checkIn === 1 ? "0.5" : "1" }}>{title}</div>
					<img src={purple1} style={{
						height: "25px",
						opacity: checkIn === 1 ? "0.5" : "1"
					}} />
					{checkIn === 1 && (<img src={claimedMask} style={{ scale: "50%", position: "absolute", alignContent: "center", marginTop: "5px" }} />)}
				</div >
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
							<CheckItem title={"MON"} checkIn={checkStatus[0]} click={checkStatus[0] !== 1 && today === 0} />
							<CheckItem title={"THU"} checkIn={checkStatus[3]} click={checkStatus[3] !== 1 && today === 3} />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
							}}
						>
							<CheckItem title={"TUE"} checkIn={checkStatus[1]} click={checkStatus[1] !== 1 && today === 1} />
							<CheckItem title={"FRI"} checkIn={checkStatus[4]} click={checkStatus[4] !== 1 && today === 4} />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
							}}
						>
							<CheckItem title={"WED"} checkIn={checkStatus[2]} click={checkStatus[2] !== 1 && today === 2} />
							<CheckItem title={"SAT"} checkIn={checkStatus[5]} click={checkStatus[5] !== 1 && today === 5} />
						</div>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100px",
								height: "100%",
							}}
						>
							<CheckItem style={{ width: "100px" }} title={"SUN"} checkIn={checkStatus[6]} click={checkStatus[6] !== 1 && today === 6} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
