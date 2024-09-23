import "./index.css";
import logo from "@assets/logo.png";
import logoText from "@assets/text-logo.png";
import x from "@assets/x.png";
import faucet from "@assets/faucet.png";
import starterPack from "@assets/starter-pack.png";
import pageMint from "@assets/page-mint.png";
import pageMintSelected from "@assets/page-mint-selected.png";
import pageNeko from "@assets/page-nekomoto.png";
import pageNekoSelected from "@assets/page-nekomoto-selected.png";
import pageExtra from "@assets/page-extra.png";
import pageExtraSelected from "@assets/page-extra-selected.png";
import exclamation from "@assets/exclamation.png";

import blue from "@assets/blue.png";
import user from "@assets/user.png";
import { Row, Col, Flex, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "@stores/index";
import Wallet from "@components/Wallet/wallet.jsx";
import { useAccount } from "@starknet-react/core";

export default function PCHeader() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const homePage = pathname === "/";
	const inMintPage = pathname === "/assets";
	const inNekoPage = pathname.includes("detail");

	const { account, address, status, chainId, isConnected } = useAccount();

	return (
		<div className="pcHeader flex justify-between align-center">
			<div
				className="flex justify-between align-center"
				style={{ cursor: "pointer" }}
				onClick={() => navigate("/")}
			>
				<img src={logo} width={48} alt="" />
				<img src={logoText} width={116} alt="" style={{ marginLeft: "12px" }} />
				{!homePage && address && (
					<div style={{ display: "flex", gap: "20px", marginLeft: "12px" }}>
						<div
							className={"header-btn2"}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "rgba(255, 255, 255, 1)",
							}}
						>
							<img src={faucet} style={{ height: "30px" }} />
							<div style={{ marginLeft: "8px" }}>Claim NPO</div>
						</div>

						<div
							className={"header-btn2"}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "black",
								backgroundColor: "rgba(233, 215, 142, 1)",
							}}
						>
							<img src={starterPack} style={{ height: "30px" }} />
							<div
								style={{
									marginLeft: "8px",
									fontSize: "14px",
									position: "relative",
								}}
							>
								<div>Starter Pack!</div>
								<div
									style={{
										color: "#01dce4",
										fontSize: "9px",
										marginTop: "4px",
										left: "50%",
										transform: "translateX(-50%)",
										position: "absolute",
									}}
								>
									Free
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			{homePage && (
				<div>
					<a href={"https://x.com/TheNekomoto"} target="_blank">
						<img src={x} width={48} alt="" />
					</a>
				</div>
			)}
			{/* {isMobile ? (
				<Wallet isMobile={isMobile} />
			) : ( */}
			{!homePage && (
				<>
					<div
						style={{
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
							display: "flex",
							flexDirection: "row",
							gap: "20px",
						}}
					>
						<div
							className={
								inMintPage ? "header-btn-radius2" : "header-btn-radius"
							}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
							onClick={() => navigate("/assets")}
						>
							<img
								src={inMintPage ? pageMintSelected : pageMint}
								style={{ height: "30px", marginRight: "2px" }}
							/>
							<div
								style={{
									marginLeft: "8px",
									fontSize: "14px",
									position: "relative",
								}}
							>
								<div>Mint</div>
							</div>
						</div>

						<div
							className={inNekoPage ? "header-btn-radius2" : "header-btn-radius"}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
							onClick={() => navigate("/detail2")}
						>
							<img
								src={inNekoPage ? pageNekoSelected : pageNeko}
								style={{ height: "30px", marginRight: "2px" }}
							/>
							<div
								style={{
									marginLeft: "8px",
									fontSize: "14px",
									position: "relative",
								}}
							>
								<div>Yield</div>
							</div>
						</div>

						<div
							className={"header-btn-radius"}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={pageExtra}
								style={{ height: "30px", marginRight: "2px" }}
							/>
							<div
								style={{
									marginLeft: "8px",
									fontSize: "14px",
									position: "relative",
								}}
							>
								<div>Buff</div>
							</div>
						</div>
					</div>
					{/*{detailPage && (<div></div>)}*/}
					{/*{assetsPage && (<div></div>)}*/}
					<div>
						<Wallet />
					</div>
				</>
			)}
		</div>
	);
}
