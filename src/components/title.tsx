function Title({header, body}: TitleProps) {
    return <div className="header">
        <h1>{header}</h1>
        <p>{body}</p>
    </div>
}

type TitleProps = {
    header: string,
    body: string
}

export default Title;