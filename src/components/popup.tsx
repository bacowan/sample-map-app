import Poi from "../types/poi";
import PoiTag from "../types/poiTag";

function Popup({poi} : PopupProps) {
    return <>
        <strong>{poi.title}: {poi.plannedArrivalDate.toDateString()}</strong>
        <p>Tags: {poi.tags.map(t => Object.entries(PoiTag).filter(p => p[0] === t)[0][1]).join(", ")}</p>
        <p>{poi.description}</p>
    </>
}

type PopupProps = {
    poi: Poi
}

export default Popup;