import { useState, useEffect } from 'react';
import Map from './components/map';
import PoiList from './components/poiList';
import Title from './components/title'
import { getPois } from './data';
import './App.css';

function App() {
  const [data, _] = useState(getPois());
  const [selectedPoiIndex, setSelectedPoiIndex] = useState<number | null>(null);

  return (
    <div className="App">
      <Title header="Cycling trip across Japan" body="A list of waypoints that I'd like to visit on a cycling trip across Japan."/>
      <Map pois={data} selectedPoiIndex={selectedPoiIndex}/>
      <PoiList pois={data} itemClickHandler={setSelectedPoiIndex}/>
    </div>
  );
}

export default App;
