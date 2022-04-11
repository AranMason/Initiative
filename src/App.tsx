import React from 'react';
import './App.scss';
import ItemListener from './components/ItemListener';
import TrackerContainer from './components/TrackerContainer';

const App: React.FC = () => {
    return (
        <React.Fragment>
            <header>Initiative Tracker</header>
            <article className="layout-flex-column flex-gap-m">
                <TrackerContainer />
            </article>
            <footer>Created by Aran Mason</footer>
        </React.Fragment>
    );
};

export default App;
