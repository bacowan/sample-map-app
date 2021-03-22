import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import PoiList from "../poiList"
import { act } from 'react-dom/test-utils';
import { PoiListItemProps } from '../poiListItem';
import Poi from '../../types/poi';

const leftClick = { button: 1 };

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

// Test the list itself

test('No POIs renders blank list', () => {
    render(<PoiList pois={[]} selectedPoiIndex={null} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(0);
});

test('Selected POI is marked as selected', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]
    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('Unselected POI is not marked as selected', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]
    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(2);

    const firstElement = list.firstElementChild as HTMLElement;
    const selectedLabel = within(firstElement).getByText('not selected');
    expect(selectedLabel).toBeInTheDocument();
});

test('No selected POI does not highlight any', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]
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
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]
    render(<PoiList pois={pois} selectedPoiIndex={5} setSelectedPoiIndex={() => {}}/>);
    
    const list = screen.getByRole("list");

    expect(list.childNodes.length).toBe(1);

    const firstElement = list.firstElementChild as HTMLElement;
    const firstElementText = within(firstElement).getByText('not selected');
    expect(firstElementText).toBeInTheDocument();
});

// Test the buttons

test('Next button wired up', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(1);
});

test('Previous button wired up', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(0);
});

test('Next button loops', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={1} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('next'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(0);
});

test('Previous button loops', () => {
    const pois: Array<Poi> = [
        { lat: 0, lon: 0, title: "title", description: "desc" },
        { lat: 0, lon: 0, title: "title", description: "desc" }
    ]

    const setSelectedPoiMock = jest.fn();

    render(<PoiList pois={pois} selectedPoiIndex={0} setSelectedPoiIndex={setSelectedPoiMock}/>);
    
    fireEvent.click(screen.getByText('previous'), leftClick);

    expect(setSelectedPoiMock.mock.calls[0][0]).toBe(1);
});