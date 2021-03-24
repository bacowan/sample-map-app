import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import PoiList from "../poiList"
import { act } from 'react-dom/test-utils';
import { PoiListItemProps } from '../poiListItem';
import Poi from '../../types/poi';
import PoiTag from '../../types/poiTag';
import { PoiTagFilterProps } from '../poiTagFilter';

const leftClick = { button: 1 };
const basicPoi : Poi = { lat: 0, lon: 0, title: "title", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] };

jest.mock('../poiListItem', () => {
    return {
        __esModule: true,
        default: ({poi, index, isSelected, itemClickHandler}: PoiListItemProps) => {
            return (
                <div>
                    <p>{poi.title}</p>
                    <p>{index}</p>
                    <p>{isSelected ? 'selected' : 'not selected'}</p>
                </div>
            );
        },
    };
});

const mockLodgingTag = PoiTag.Lodging;
jest.mock('../poiTagFilter', () => {
    return {
        __esModule: true,
        default: ({selectedValue, setSelectedValue}: PoiTagFilterProps) => {
            return (
                <div>
                    <button data-testid="lodgingButton" onClick={() => setSelectedValue(mockLodgingTag)}/>
                    <p>{selectedValue}</p>
                </div>
            );
        },
    };
});

// Test the list itself

test('No POIs renders blank list', () => {
    render(<PoiList pois={[]} selectedPoiIndex={null} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(0);
});

test('Selected POI is marked as selected', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];
    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('Unselected POI is not marked as selected', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];
    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('not selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('No selected POI does not highlight any', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];
    render(<PoiList pois={pois} selectedPoiIndex={null} setSelectedPoiIndex={() => {}}/>);
    
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
    const pois: Array<Poi> = [basicPoi];
    render(<PoiList pois={pois} selectedPoiIndex={5} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(1);

    const firstElement = list.firstElementChild as HTMLElement;
    const firstElementText = within(firstElement).getByText('not selected');
    expect(firstElementText).toBeInTheDocument();
});

// Test the buttons

test('Next button wired up', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(1);
});

test('Previous button wired up', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(0);
});

test('Next button loops', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(0);
});

test('Previous button loops', () => {
    const pois: Array<Poi> = [basicPoi, basicPoi];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(1);
});

test('Pois sorted by date', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "second", description: "desc", plannedArrivalDate: new Date('2020-01-02'), tags: [PoiTag.Lodging] },
        { lat: 0, lon: 0, title: "first", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Lodging] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={null} setSelectedPoiIndex={setSelectedPoiMock}/>);

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
        { lat: 0, lon: 0, title: "Lodging", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [mockLodgingTag] },
        { lat: 0, lon: 0, title: "Maintenance", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Maintenance] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={null} setSelectedPoiIndex={setSelectedPoiMock}/>);

    const lodgingButton = screen.getByTestId("lodgingButton");
    const list = screen.getByRole("list");

    lodgingButton.click();

    expect(list.children.length).toBe(1);
    const element = list.firstElementChild as HTMLElement;
    const elementText = within(element).getByText("Lodging");
    expect(elementText).toBeInTheDocument();
});

test('Items with multiple tags are only removed if no tags match the filter', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "Lodging", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [mockLodgingTag, PoiTag.Onsen] },
        { lat: 0, lon: 0, title: "Maintenance", description: "desc", plannedArrivalDate: new Date('2020-01-01'), tags: [PoiTag.Maintenance, PoiTag.Onsen] }
    ];

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={null} setSelectedPoiIndex={setSelectedPoiMock}/>);

    const lodgingButton = screen.getByTestId("lodgingButton");
    const list = screen.getByRole("list");

    lodgingButton.click();

    expect(list.children.length).toBe(1);
    const element = list.firstElementChild as HTMLElement;
    const elementText = within(element).getByText("Lodging");
    expect(elementText).toBeInTheDocument();
});