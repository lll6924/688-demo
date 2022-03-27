import React, { Component, setState } from 'react';

import Navigation from './navigation';
import './DSeparation.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import anime from 'animejs';

export default class DSeparation extends Component {
	state = {
    	snum: 1
  	};
	constructor(props) {
	  super(props);
	  this.animation = []
	}
	
	animate= () => {
		console.log('animation!');
		for(const ani of this.animation){
			ani.restart();
		}
   }
   
   componentDidMount=()=>{
	var ani  = anime({
			  targets: '.item .el',
			  translateX: 250
			});
	this.animation.push(ani);
   }
   componentDidUpdate=()=>{
		var ani = anime({
			  targets: '.item .el',
			  translateX: 250
			});
	    this.animation.push(ani);
	}
   
   add=()=>{
		this.setState({ snum: this.state.snum + 1 });
   }
   
   rerun=()=>{
		this.animate();
   }
   
   render = () => {
		var squares = [];
		for (var i = 0; i < this.state.snum; i++) {
    		squares.push(<div className="square el" key={i} ></div>);
    	}
    	return (
	        <Container className="p-3">
		      	<div className='item'>
		      		{squares}
		      	</div>
		      	<Button onClick={ this.add }>ADD</Button>

	        </Container>
		)
   }
}
