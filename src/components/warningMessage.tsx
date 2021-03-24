function WarningMessage({message} : WarningMessageProps) {
    return (
        <div className="warning-message">
            <p>{message}</p>
        </div>
    );
}

type WarningMessageProps = {
    message: string
};

export default WarningMessage;