import { useState } from "react";
import Poi from "../types/poi";
import PoiTag from "../types/poiTag";
import PoiListItem from "./poiListItem";
import PoiTagFilter from "./poiTagFilter";

function PoiList({pois, selectedPoiIndex, setSelectedPoiIndex, poiFilter, setPoiFilter}: PoiListProps) {

    function previousClick() {
        if (selectedPoiIndex != null) {
            setSelectedPoiIndex((selectedPoiIndex + pois.length - 1) % pois.length);
        }
    }

    function nextClick() {
        if (selectedPoiIndex != null) {
            setSelectedPoiIndex((selectedPoiIndex + 1) % pois.length);
        }
    }

    return (
        <div className="poi-list">
            <strong className="poi-list-header">Points of interest</strong>
            <PoiTagFilter selectedValue={poiFilter} setSelectedValue={setPoiFilter}/>
            <ul>
                {pois
                    .filter(p => poiFilter == undefined || p.tags.includes(poiFilter))
                    .sort((p1, p2) => p2.plannedArrivalDate > p1.plannedArrivalDate ? -1 : 1)
                    .map((p, i) => <PoiListItem
                        key={i}
                        poi={p}
                        index={i}
                        isSelected={i === selectedPoiIndex}
                        itemClickHandler={setSelectedPoiIndex}/>)}
            </ul>
            <div className="navigation-buttons poi-list-footer">
                <button onClick={previousClick}>previous</button>
                <button onClick={nextClick}>next</button>
            </div>
        </div>);
}

type PoiListProps = {
    pois: Poi[],
    selectedPoiIndex: number | null,
    poiFilter: PoiTag | undefined,
    setSelectedPoiIndex: (index: number) => void,
    setPoiFilter: (tag: PoiTag | undefined) => void
}

export default PoiList;