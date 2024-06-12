import './index.css'

export default function RadioButton({text, active, style}) {
    return <div className={['radioBtn', active ?'activeRadioBtn':''].join(' ')}  style={style}>
        {text}
    </div>
}