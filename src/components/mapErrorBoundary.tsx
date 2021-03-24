import React from "react";

class MapErrorBoundary extends React.Component<{children: React.ReactNode}, { hasError: boolean }> {
    constructor(props: {children: React.ReactNode}) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <MapErrorMessage/>
        }
        else {
            return this.props.children;
        }
    }
}

function MapErrorMessage() {
    return <h1>Whoops! The map failed to load.</h1>
}

export default MapErrorBoundary