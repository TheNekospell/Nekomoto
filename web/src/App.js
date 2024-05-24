import logo from './logo.svg';
import './App.css';
import isMobile from "is-mobile";

function App() {
  return (
    isMobile() ? (<div className="main-bg" style={{backgroundImage: 'url(/main-mobile.png)'}}>
        <div className="navbar-main">
            <div className="navbar navbar-mobile">
                <div className="nav-left">
                    <img className="nav-img" src="logo.png" alt=""/>
                    <img className="nav-top-title" src="top-title.png" />
                </div>
                <div className="nav-right" onClick={()=>{window.location.href='https://x.com/thenekomoto'}}>
                    <img src="x.png" alt=""/>
                </div>
            </div>
        </div>
        <div className="middle-main middle-main-mobile">
            <div className="middle-middle middle-middle-mobile" >
                <img className="title-img" src="title.png" alt=""/>
                <div className="middle-desc middle-desc-mobile">
                    A fully onchain card game combining RPG elements with collection, nurturing, and strategy mechanics.
                </div>
                <div className="middle-button">
                    <img src="play.png" alt=""/>
                    <span>
                        PLAY
                    </span>
                </div>
            </div>
        </div>
    </div>) : (<div className="main-bg" style={{backgroundImage: 'url(/main.png)'}}>
        <div className="navbar-main">
            <div className="navbar">
                <div className="nav-left">
                    <img className="nav-img" src="logo.png" alt=""/>
                    {/*<div className="nav-title">NekoMoto</div>*/}
                    <img className="nav-top-title" src="top-title.png" />
                </div>
                <div className="nav-right" onClick={()=>{window.location.href='https://x.com/thenekomoto'}}>
                    <img src="x.png" alt=""/>
                </div>
            </div>
        </div>
        <div className="middle-main">
            <div className="middle-middle" >
                <img className="title-max-img" src="title-max.png" alt=""/>
                <div className="middle-desc">
                    A fully onchain card game combining RPG elements with collection, nurturing, and strategy mechanics.
                </div>
                <div className="middle-button">
                    <img src="play.png" alt=""/>
                    <span>
                        PLAY
                    </span>
                </div>
            </div>
        </div>
    </div>)
  );
}

export default App;
