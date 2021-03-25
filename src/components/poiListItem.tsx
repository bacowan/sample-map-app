import Poi from "../types/poi";

function PoiListItem({poi, isSelected, itemClickHandler}: PoiListItemProps) {
    return (
        <li onClick={e => itemClickHandler(poi)} className={isSelected ? 'selected-item' : ''}>
            {poi.title}
        </li>
    );
}

export type PoiListItemProps = {
    poi: Poi,
    isSelected: boolean,
    itemClickHandler: (poi: Poi) => void
}

export default PoiListItem;