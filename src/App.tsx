import React from 'react';
import './App.scss';
import ItemListener from './components/ItemListener';
import TrackerContainer from './components/TrackerContainer';

const App: React.FC = () => {
  return (
    <ItemListener>
      {data => {
        return (
          <React.Fragment>
            <header>Iniative Tracker</header>
            <article>
              <TrackerContainer />
            </article>
            <footer>Created by Aran Mason</footer>
          </React.Fragment>
        );
      }}
    </ItemListener>
  );
};

export default App;
