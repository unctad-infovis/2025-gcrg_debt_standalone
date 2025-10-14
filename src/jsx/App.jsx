import React, { useState, useEffect } from 'react';
import '../styles/styles.less';

// Load context
import { StaticDataContextProvider } from './context/StaticData.js';
import { FocusContextProvider } from './context/Focus.js';
import { RadialDataContextProvider } from './context/RadialData.js';
import { MetricContextProvider } from './context/Metric';
import { PanelContextProvider } from './context/Panel';
import viewPort from './helpers/viewPort';
import Center from './radial/Radial.Center.jsx';
import Download from './Download.jsx';

// Load components
import Radial from './radial/Radial.jsx';
import Dotplot from './dotplot/Dotplot.jsx';
import Panel from './panel/Panel.jsx';
import Filter from './filters/Filter.jsx';

function App() {
  const { smScreen, height } = viewPort();

  const REDIRECT_URL = 'https://unctad-infovis.github.io/2025-gcrg_debt_globe_standalone/';
  const IDLE_TIME = 2 * 60; // 2 minutes in seconds

  const [timer, setTimer] = useState(IDLE_TIME);

  // Reset timer on user activity
  useEffect(() => {
    const resetTimer = () => setTimer(IDLE_TIME);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [IDLE_TIME]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Redirect when timer reaches 0
  useEffect(() => {
    if (timer === 0) {
      window.location.href = REDIRECT_URL;
    }
  }, [timer]);

  return (
    <div className="app">
      <StaticDataContextProvider>
        <FocusContextProvider>
          <div className="dashboard" id="app-root-2025-gcrg_debt_standalone-download">
            <Filter />
            {height <= 900 && <Center radius={0} />}
            <div className="visuals">
              {' '}
              <MetricContextProvider>
                <PanelContextProvider>
                  <RadialDataContextProvider>
                    {smScreen ? <Dotplot /> : <Radial />}
                  </RadialDataContextProvider>
                  <Panel />
                </PanelContextProvider>
              </MetricContextProvider>
            </div>
            <div className="source">
              <em>Source:</em>
              {' '}
              UN Trade and Development (UNCTAD)
            </div>
          </div>
          <div className="backbutton_container"><a type="button" href="https://unctad-infovis.github.io/2025-gcrg_debt_globe_standalone/">Back</a></div>
          <Download />
          <noscript>Your browser does not support JavaScript!</noscript>
        </FocusContextProvider>
      </StaticDataContextProvider>
    </div>
  );
}

export default App;
