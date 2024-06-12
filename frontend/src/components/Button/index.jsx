import './index.css'

export default function Button({text, color, longness, style, disabled, onButtonClick=()=>{}}) {
    return <div onClick={onButtonClick} className={`nBtn ${color}Btn ${longness}Btn ${disabled?'disabledBtn':''}`}  style={style}>
        {text}
    </div>
}