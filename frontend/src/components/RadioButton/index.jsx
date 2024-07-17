import './index.css'

export default function RadioButton({text, active, style, onClick}) {
    return <div className={['radioBtn', active ? 'activeRadioBtn' : ''].join(' ')} style={style} onClick={onClick}>
        {text}
    </div>
}
