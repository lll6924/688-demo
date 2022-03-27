import React, { useState } from 'react';

import Navigation from './navigation';
import Container from 'react-bootstrap/Container';

const Home = () => (
<>
    <Container className="p-3">
    <div>
      <h1 className="header">Probabilistic Graphical Models</h1>
      <p><b>Course Description:</b> Probabilistic graphical models are an intuitive visual language for describing the structure of joint probability distributions using graphs. They enable the compact representation and manipulation of exponentially large probability distributions, which allows them to efficiently manage the uncertainty and partial observability that commonly occur in real-world problems. As a result, graphical models have become invaluable tools in a wide range of areas from computer vision and sensor networks to natural language processing and computational biology. The aim of this course is to develop the knowledge and skills necessary to effectively design, implement and apply these models to solve real problems.</p>
      <p><b>Prerequisites:</b> Students entering the class should have good programming skills and knowledge of algorithms. Undergraduate-level knowledge of probability, linear algebra, and calculus will be assumed. <b>A prior course in machine learning is extremely helpful. </b></p>
      <p><b>Textbook:</b> There is no required textbook. Supplemental readings will be assigned from <i>Machine Learning: A Probabilistic Perspective</i> by Kevin Murphy (primary) and Koller and Friedman’s <i>Probabilistic Graphical Models</i> (secondary). The readings in the two books will cover similar topics.</p>
    </div>
  </Container>
</>

);

export default Home;