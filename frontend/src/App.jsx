import { Outlet } from "react-router-dom";
import PCHeader from "@components/PCHeader/index";
import { useAppStore } from "@stores/index";
import { useEffect, useState } from "react";
import { BACKEND } from "@/interface.js";

function App() {
	const { device, toggleDevice } = useAppStore();

	useEffect(() => {
		function resized(value) {
			// console.log("value: ", document.body.clientWidth);
			toggleDevice();
			window.removeEventListener("resize", resized); // <---- added
		}

		window.addEventListener("resize", resized);

		return () => {
			window.removeEventListener("resize", resized);
		};
	});



	return (
		// <div className={["app", isMobile ? "mobile-app" : "pc-app"].join(" ")}>
		<div className={"app pc-app"}>
			<meta name="referrer" content="no-referrer" />
			<PCHeader />
			<div className="app-content">
				<Outlet />
			</div>
		</div>
	);
}

export default App;
