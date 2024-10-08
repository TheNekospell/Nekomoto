import NekoModal from "../Modal";
import Button from "../../components/Button/index";

export default function WaitCard({ waiting, setWaiting, success, setSuccess }) {
	return (
		<>
			<NekoModal
				open={waiting}
				centered={true}
				footer={null}
				maskClosable={true}
				onCancel={() => {
					setWaiting(false);
					setSuccess("");
				}}
			>
				<div
					style={{
						marginTop: "20px",
						marginBottom: "20px",
						alignItems: "center",
						justifyContent: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<h3
						style={{
							textAlign: "center",
							color: "#01dce4",
							fontFamily: "BIG SHOT",
							fontWeight: "bold",
							wordWrap: "break-word",
							wordBreak: "break-all",
						}}
					>
						{success !== ""
							? success
							: "Please sign in your wallet and wait..."}
					</h3>

					{success && (
						<Button
							style={{
								marginTop: "20px",
								fontSize: "15px",
								flexDirection: "row",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							text={"OK"}
							color={"yellow"}
							longness="long"
							onClick={() => {
								setWaiting(false);
								setSuccess("");
							}}
						/>
					)}
				</div>
			</NekoModal>
		</>
	);
}
