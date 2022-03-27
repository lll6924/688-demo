import React, { useState } from 'react';

import Navigation from './navigation';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

const More = () => (
<>
   <Container className="p-3">
		<h1>
		More Demonstrations
		</h1>

	<ListGroup variant="flush">
	  <ListGroup.Item>
	  <a href="https://notebooks.gesis.org/binder/jupyter/user/mlds-lab-ml-demos-d4wgb092/notebooks/bernoulli_likelihood_demo.ipynb" target="_blank">Bernoulli Likelihood Demo</a>
	  </ListGroup.Item>
	  <ListGroup.Item>
	  	<a href="https://physics.weber.edu/schroeder/software/demos/IsingModel.html"  target="_blank">Ising Model</a>
	  </ListGroup.Item>
	</ListGroup>
</Container>
</>
);

export default More;