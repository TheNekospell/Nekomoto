import { Outlet } from "react-router-dom";
import PCHeader from "@components/PCHeader/index";
import { useAppStore } from "@stores/index";
import { useEffect } from "react";
import { BACKEND } from "@/interface.js";
import { useAccount } from "@starknet-react/core";

function App() {
    const {device, toggleDevice} = useAppStore();
    const isMobile = device === "mobile";
    
    
    useEffect(() => {
        function resized(value) {
            console.log("value: ", document.body.clientWidth);
            toggleDevice();
            window.removeEventListener("resize", resized); // <---- added
        }
        
        window.addEventListener("resize", resized);
        
        return () => {
            window.removeEventListener("resize", resized);
        };
    });
    
    return (
        <div className={["app", isMobile ? "mobile-app" : "pc-app"].join(" ")}>
            <meta name="referrer" content="no-referrer"/>
            <PCHeader/>
            <div className="app-content">
                <Outlet/>
            </div>
        </div>
    );
}

export default App;
