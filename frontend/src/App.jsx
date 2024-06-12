import { Outlet } from "react-router-dom";
import PCHeader from "@components/PCHeader/index";
import { useAppStore } from "@stores/index";


function App() {
  const isMobile = useAppStore().device === "mobile";

  return (
    <div className={['app', isMobile?'mobile-app':'pc-app'].join(' ')}>
      <PCHeader />
      <div className="app-content">
      <Outlet />
      </div>
      
    </div>
  );
}

export default App;
