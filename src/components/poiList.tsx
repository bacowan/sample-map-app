import Poi from "../types/poi";
import PoiListItem from "./poiListItem";

function PoiList({pois, itemClickHandler}: PoiListProps) {
    return (
    <div className="poi-list">
        <strong>Points of interest</strong>
        <ul>
            {pois.map((p, i) => <PoiListItem key={i} poi={p} index={i} itemClickHandler={itemClickHandler}/>)}
        </ul>
    </div>);
}

type PoiListProps = {
    pois: Poi[],
    itemClickHandler: (index: number) => void
}

export default PoiList;