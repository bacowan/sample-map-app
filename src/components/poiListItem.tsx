import Poi from "../types/poi";

function PoiListItem({poi, index, isSelected, itemClickHandler}: PoiListItemProps) {
    return (
        <li onClick={e => itemClickHandler(index)} className={isSelected ? 'selected-item' : ''}>
            {poi.title}
        </li>
    );
}

export type PoiListItemProps = {
    poi: Poi,
    index: number,
    isSelected: boolean,
    itemClickHandler: (index: number) => void
}

export default PoiListItem;