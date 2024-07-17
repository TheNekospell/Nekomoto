import './index.css'

export default function Button({text, color, longness, style, disabled, onClick}) {
    return <div onClick={onClick} className={`nBtn ${color}Btn ${longness}Btn ${disabled?'disabledBtn':''}`}  style={style}>
        {text}
    </div>
}
