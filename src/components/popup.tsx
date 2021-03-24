import Poi from "../types/poi";
import PoiTag from "../types/poiTag";

function Popup({poi} : PopupProps) {
    return <>
        <strong>{poi.title}: {poi.plannedArrivalDate.toDateString()}</strong>
        <p>Tags: {poi.tags.join(", ")}</p>
        <p>{poi.description}</p>
    </>
}

type PopupProps = {
    poi: Poi
}

export default Popup;