import { ChangeEvent } from "react";
import PoiTag from "../types/poiTag";

function PoiTagFilter({selectedValue, setSelectedValue} : PoiTagFilterProps) {
    
    function onChange(event : ChangeEvent<HTMLSelectElement>) {
        if (event.target.value === "") {
            setSelectedValue(undefined);
        }
        else {
            setSelectedValue(event.target.value as PoiTag)
        }
    }

    const options = Object.entries(PoiTag)
        .map(t => <option value={t[0]}>{t[1]}</option>);
    return (
        <div className="filter-list">
            <p>Filter by: </p>
            <select value={selectedValue} onChange={onChange}>
                <option value=""></option>
                {options}
            </select>
        </div>
    );
}

export type PoiTagFilterProps = {
    selectedValue: PoiTag | undefined,
    setSelectedValue: (value: PoiTag | undefined) => void
}

export default PoiTagFilter;