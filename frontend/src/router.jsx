import App from "./App.jsx";
import Home from "@pages/Home/index";
import Assets from "@pages/Assets/index";
import Detail2 from "@pages/Detail2/index";

import {createBrowserRouter} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <Home/>},
            {path: "/assets", element: <Assets/>},
            // { path: "/detail", element: <Detail /> },
            {path: "/detail2", element: <Detail2/>},
        ],
    },
]);

export default router;
