import React, { Component, setState } from 'react';

import Navigation from './navigation';
import './DSeparation.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import anime from 'animejs';

import * as d3 from 'd3'

export default class DSeparation extends Component {
	state = {
    	snum: 1
  	};
	constructor(props) {
	  super(props);
	  this.nodes = [
		     {"name": "1"},
		  ]
		this.n = 1;
		this.links = [
		]
		this.window_w = 800;
		this.window_h = 600;
	}
	
	copy = () => {
		var _nodes = structuredClone(this.nodes);
		for(var i=0;i<_nodes.length;i++)
			_nodes[i]['hasLink'] = false;
		var _links = []
		for(var i=0;i<this.links.length;i++){
			_links.push({source:_nodes[this.links[i].source],target:_nodes[this.links[i].target]})
			_nodes[this.links[i].source]['hasLink'] = true;
			_nodes[this.links[i].target]['hasLink'] = true;
		}
		return [_nodes, _links]
	}
	
	animate= () => {
		console.log('animation!');
		d3.selectAll("line").remove();
		d3.selectAll("circle").remove();
		d3.selectAll("text").remove();
		var ar = this.copy();
		var _nodes = ar[0]; 
		var _links = ar[1];
				console.log(_links);
		console.log(_nodes);
		function ticked(){
			var u = d3.select('.links')
				.selectAll('line')
				.data(_links)
				.join('line')
				.attr('x1', function(d) {
					return d.source.x
				})
				.attr('y1', function(d) {
					return d.source.y
				})
				.attr('x2', function(d) {
					return d.target.x
				})
				.attr('y2', function(d) {
					return d.target.y
				})
				.attr('stroke-width', 5)
				.attr('marker-end','url(#arrow)');
					var u = d3.select('.nodes')
					.selectAll('text')
					.data(_nodes)
					.join('text')
					.text(function(d) {
						return d.name
					})
					.attr('x', function(d) {
						return d.x
					})
					.attr('y', function(d) {
						return d.y
					})
					.attr('dy', function(d) {
						return 5
					});
			var u = d3.select('.circles')
				.selectAll('circle')
				.data(_nodes)
				.join('circle')
				.attr('r', 20)
				.attr('cx', function(d) {
					return d.x
				})
				.attr('cy', function(d) {
					return d.y
				});
		}
		var simulation = d3.forceSimulation(_nodes)
					.force('charge', d3.forceManyBody().strength(function(d){ return d.hasLink? -1000:-200; }))
				   .force("forceX",d3.forceX(this.window_w/2) )
				   .force("forceY",d3.forceY(this.window_h/2) )
   					.force('link', d3.forceLink().links(_links))
					.on('tick', ticked);
   }
   

   
   
   componentDidMount=()=>{

		d3.select('svg').append("defs").append("marker")
		    .attr("id", "arrow")
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", 0)
		    .attr("markerWidth", 4)
		    .attr("markerHeight", 4)
		    .attr("orient", "auto")
		  .append("svg:path")
		    .attr("d", "M0,-5L10,0L0,5")
		    .attr("fill","#ccc");
			this.animate();
		   }
   componentDidUpdate=()=>{
		this.animate();

	}
   
   addNode=()=>{
		if(this.n>=10)return;
		this.n++;
		this.nodes.push({"name":this.n.toString()});
		this.animate();
   }
   
   		exists=(l,r)=>{
			for(var i=0;i<this.links.length;i++)
				if(l==this.links[i].source&&r==this.links[i].target)return true;
			return false;
		}	
   
   addEdge=()=>{
		if(this.links.length >= this.n*(this.n-1)/2) return;
		function getRandomInt(max) {
		  return Math.floor(Math.random() * max);
		}	

		var l = getRandomInt(this.n);
		var r = getRandomInt(this.n);
		while(l>=r|| this.exists(l,r)){
			l = getRandomInt(this.n);
			r = getRandomInt(this.n);
		}
		this.links.push({source: l, target: r});
		this.animate();

	}
	
	   clearGraph=()=>{
			  this.nodes = [
		                {"name": "1"},
		  ]
		this.n = 1;
		this.links = [
		]
		this.animate();

	}
   
   rerun=()=>{
		this.animate();
   }
   
   render = () => {
    	return (
	        <Container className="p-3">
	        				  <svg width="800" height="600">
				      <g className="links"></g>
				          <g className="circles"></g>
				    <g className="nodes"></g>
				  </svg>
		      	<Button onClick={ this.addNode }>Add Node</Button>
		        <Button onClick={ this.addEdge }>Add Edge</Button>
		        <Button onClick={ this.clearGraph }>Clear Graph</Button>


	        </Container>
		)
   }
}
