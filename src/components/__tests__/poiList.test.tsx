import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import PoiList from "../poiList"
import { act } from 'react-dom/test-utils';
import { PoiListItemProps } from '../poiListItem';
import Poi from '../../types/poi';
import PoiTag from '../../types/poiTag';
import { PoiTagFilterProps } from '../poiTagFilter';

const leftClick = { button: 1 };

jest.mock('../poiListItem', () => {
    return {
        __esModule: true,
        default: ({poi, isSelected}: PoiListItemProps) => {
            return (
                <div>
                    <p>{poi.title}</p>
                    <p>{isSelected ? 'selected' : 'not selected'}</p>
                </div>
            );
        },
    };
});

jest.mock('../poiTagFilter', () => {
    return {
        __esModule: true,
        default: ({selectedValue}: PoiTagFilterProps) => {
            return (
                <div>
                    <button data-testid="lodgingButton"/>
                    <p>{selectedValue}</p>
                </div>
            );
        },
    };
});

// Test the list itself

test('No POIs renders blank list', () => {
    render(<PoiList pois={[]} selectedPoi={null} poiFilter={undefined} setSelectedPoi={() => {}} setPoiFilter={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(0);
});

test('Selected POI is marked as selected', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];
    render(<PoiList pois={pois} selectedPoi={pois[0]} poiFilter={undefined} setSelectedPoi={() => {}} setPoiFilter={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('Unselected POI is not marked as selected', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];
    render(<PoiList pois={pois} selectedPoi={pois[1]} poiFilter={undefined} setSelectedPoi={() => {}} setPoiFilter={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('not selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('No selected POI does not highlight any', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];
    render(<PoiList pois={pois} selectedPoi={null} poiFilter={undefined} setSelectedPoi={() => {}} setPoiFilter={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const secondElement = list.lastElementChild as HTMLElement;
    const firstElementText = within(firstElement).getByText('not selected');
    const secondElementText = within(secondElement).getByText('not selected');
    expect(firstElementText).toBeInTheDocument();
    expect(secondElementText).toBeInTheDocument();
});

test('Invalid POI index does not highlight any', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const invalidItem = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1];
    render(<PoiList pois={pois} selectedPoi={invalidItem} poiFilter={undefined} setSelectedPoi={() => {}} setPoiFilter={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(1);

    const firstElement = list.firstElementChild as HTMLElement;
    const firstElementText = within(firstElement).getByText('not selected');
    expect(firstElementText).toBeInTheDocument();
});

// Test the buttons

test('Next button wired up', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={pois[0]} setSelectedPoi={setSelectedPoiMock} poiFilter={undefined} setPoiFilter={() => {}}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(item2);
});

test('Previous button wired up', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={pois[1]} setSelectedPoi={setSelectedPoiMock} poiFilter={undefined} setPoiFilter={() => {}}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(item1);
});

test('Next button loops', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={pois[1]} setSelectedPoi={setSelectedPoiMock} poiFilter={undefined} setPoiFilter={() => {}}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(item1);
});

test('Previous button loops', () => {
    const item1 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const item2 = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };
    const pois: Array<Poi> = [item1, item2];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={pois[0]} setSelectedPoi={setSelectedPoiMock} poiFilter={undefined} setPoiFilter={() => {}}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(item2);
});

test('Pois sorted by date', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "second", description: "desc", plannedArrivalDate: new Date('2020-01-02'), tags: [PoiTag.Lodging] },
        { lat: 0, lon: 0, title: "first", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={null} setSelectedPoi={setSelectedPoiMock} poiFilter={undefined} setPoiFilter={() => {}}/>);

    const list = screen.getByRole("list");

    const firstElement = list.firstElementChild as HTMLElement;
    const secondElement = list.lastElementChild as HTMLElement;
    const firstElementText = within(firstElement).getByText('first');
    const secondElementText = within(secondElement).getByText('second');
    expect(firstElementText).toBeInTheDocument();
    expect(secondElementText).toBeInTheDocument();
});

test('Filter items with single tag', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "Lodging", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] },
        { lat: 0, lon: 0, title: "Maintenance", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Maintenance] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={null} setSelectedPoi={setSelectedPoiMock} poiFilter={PoiTag.Lodging} setPoiFilter={() => {}}/>);

    const list = screen.getByRole("list");

    expect(list.children.length).toBe(1);
    const element = list.firstElementChild as HTMLElement;
    const elementText = within(element).getByText("Lodging");
    expect(elementText).toBeInTheDocument();
});

test('Items with multiple tags are only removed if no tags match the filter', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "Lodging", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging, PoiTag.Onsen] },
        { lat: 0, lon: 0, title: "Maintenance", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Maintenance, PoiTag.Onsen] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoi={null} setSelectedPoi={setSelectedPoiMock} poiFilter={PoiTag.Lodging} setPoiFilter={() => {}}/>);

    const list = screen.getByRole("list");

    expect(list.children.length).toBe(1);
    const element = list.firstElementChild as HTMLElement;
    const elementText = within(element).getByText("Lodging");
    expect(elementText).toBeInTheDocument();
});