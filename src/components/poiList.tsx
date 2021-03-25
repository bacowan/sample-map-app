import { useState } from "react";
import Poi from "../types/poi";
import PoiTag from "../types/poiTag";
import PoiListItem from "./poiListItem";
import PoiTagFilter from "./poiTagFilter";

function PoiList({pois, selectedPoi, setSelectedPoi, poiFilter, setPoiFilter}: PoiListProps) {

    const filteredPois = pois
        .filter(p => poiFilter == undefined || p.tags.includes(poiFilter))
        .sort((p1, p2) => p2.plannedArrivalDate > p1.plannedArrivalDate ? -1 : 1)

    function previousClick() {
        if (selectedPoi != null) {
            const index = filteredPois.indexOf(selectedPoi);
            setSelectedPoi(filteredPois[(index + filteredPois.length - 1) % filteredPois.length]);
        }
    }

    function nextClick() {
        if (selectedPoi != null) {
            const index = filteredPois.indexOf(selectedPoi);
            setSelectedPoi(filteredPois[(index + 1) % filteredPois.length]);
        }
    }

    return (
        <div className="poi-list">
            <strong className="poi-list-header">Points of interest</strong>
            <PoiTagFilter selectedValue={poiFilter} setSelectedValue={setPoiFilter}/>
            <ul>
                {filteredPois.map((p, i) => <PoiListItem
                    key={i}
                    poi={p}
                    isSelected={p === selectedPoi}
                    itemClickHandler={setSelectedPoi}/>)}
            </ul>
            <div className="navigation-buttons poi-list-footer">
                <button onClick={previousClick}>previous</button>
                <button onClick={nextClick}>next</button>
            </div>
        </div>);
}

type PoiListProps = {
    pois: Poi[],
    selectedPoi: Poi | null,
    poiFilter: PoiTag | undefined,
    setSelectedPoi: (poi: Poi) => void,
    setPoiFilter: (tag: PoiTag | undefined) => void
}

export default PoiList;