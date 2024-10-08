import "./index.css";
import router from "./router";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { StarknetProvider } from "@components/Starknet/starknet.jsx";
import { ServerProvider } from "./components/Server";

createRoot(document.getElementById("root")).render(
	<StarknetProvider>
		<ServerProvider>
			<RouterProvider router={router} />
		</ServerProvider>
	</StarknetProvider>
);
