import { useState, useEffect } from 'react';
import Map from './components/map';
import PoiList from './components/poiList';
import Title from './components/title'
import './App.css';
import { getPois } from './utils';
import Poi from './types/poi';
import PoiTag from './types/poiTag';

function App() {
  const [data, setData] = useState<Poi[]>([]);
  const [selectedPoiIndex, setSelectedPoiIndex] = useState<number | null>(null);

  useEffect(() => {
    async function getData() {
      setData(await getPois());
    }
    getData();
  }, []);

  return (
    <div className="App">
      <Title header="Cycling trip across Japan" body="A list of waypoints that I'd like to visit on a cycling trip across Japan."/>
      <Map pois={data} selectedPoiIndex={selectedPoiIndex}/>
      <PoiList pois={data} selectedPoiIndex={selectedPoiIndex} setSelectedPoiIndex={setSelectedPoiIndex}/>
    </div>
  );
}

export default App;
