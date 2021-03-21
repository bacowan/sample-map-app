import Poi from "../types/poi";

function PoiListItem({poi, index, itemClickHandler}: PoiListItemProps) {
    return (
        <li onClick={e => itemClickHandler(index)}>
            {poi.title}
        </li>
    );
}

type PoiListItemProps = {
    poi: Poi,
    index: number,
    itemClickHandler: (index: number) => void
}

export default PoiListItem;