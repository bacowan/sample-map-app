function Popup({header, body} : PopupProps) {
    return <>
        <strong>{header}</strong>
        <p>{body}</p>
    </>
}

type PopupProps = {
    header: string,
    body: string
}

export default Popup;