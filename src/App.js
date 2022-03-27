import React, { useState } from 'react';

import Navigation from './navigation';
import { BrowserRouter , Route, Routes } from "react-router-dom";
import DSeparation from './DSeparation'
import Home from './home'
import HamiltonianMonteCarlo from './HamiltonianMonteCarlo'
import More from './more'

const App = () => (
<>
	<Navigation>
	</Navigation>
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/D_Separation" element={<DSeparation/>} />
            <Route exact path="/Hamiltonian_Monte_Carlo" element={<HamiltonianMonteCarlo/>} />
            <Route exact path="/more" element={<More/>} />
          </Routes>
      </BrowserRouter>
</>
);

export default App;