import React, { Component, setState } from 'react';
import ReactDOM from 'react-dom'
import Navigation from './navigation';
import './DSeparation.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

import anime from 'animejs';

import * as d3 from 'd3'

export default class DSeparation extends Component {
	state = {
    	error:false,
    	alert_title:'',
    	alert:'',
    	attempt:false,
    	query:'',
    	answer:false,
    	answer_title:'',
    	answer_content:''
  	};
	constructor(props) {
	  super(props);
	  this.nodes = [
		     {"name": "1","highlight":false,"state":0},
		  ]
		this.n = 1;
		this.links = [
		]
		this.window_w = 800;
		this.window_h = 400;
	}
	
	copy = () => {
		var _nodes = structuredClone(this.nodes);
		for(var i=0;i<_nodes.length;i++){
			_nodes[i]['hasLink'] = false;
			_nodes[i]['ref']=this;
		}
		var _links = []
		for(var i=0;i<this.links.length;i++){
			_links.push({source:_nodes[this.links[i].source],target:_nodes[this.links[i].target]})
			_nodes[this.links[i].source]['hasLink'] = true;
			_nodes[this.links[i].target]['hasLink'] = true;
		}
		return [_nodes, _links]
	}
	
	animate= () => {
		d3.selectAll("line").remove();
		d3.selectAll("circle").remove();
		d3.selectAll("text").remove();
		var ar = this.copy();
		var _nodes = ar[0]; 
		var _links = ar[1];
		function adjust(x){
			d3.select('.circles')
				.selectAll('circle')
				.style("stroke", "none");
			d3.select("circle:nth-child("+parseInt(x.name)+")").style("stroke", "black").style('stroke-width',"3");
			var that = x['ref'];
			for(var i=0;i<that.n;i++){
				that.nodes[i]['highlight']=false;
			}
			that.nodes[parseInt(x.name)-1]['highlight']=true;
		}
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
					})
					.on('click', function(d,i){ adjust(i);});
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
				})
				.style('stroke-width',"3")
				.style("stroke", function(d){return d['highlight']?"black":"none"})
				.style("fill", function(d){
					switch (d['state']) {
					  case 0:
					  	return "cadetblue";
					  case 1:
					  	return "green";
					  case 2:
					  	return "red";
					  case 3:
					  	return "#F1C40F";
					  default:
					}
				})
				.on('click', function(d,i){ adjust(i);});
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
		if(this.state.attempt)return;
	this.setState({error:false});
		if(this.n>=10)return;
		this.n++;
		this.nodes.push({"name":this.n.toString(),"highlight":false,"state":0});
		this.animate();
   }
   
   		exists=(l,r)=>{
			for(var i=0;i<this.links.length;i++)
				if(l==this.links[i].source&&r==this.links[i].target)return true;
			return false;
		}	
   
   addEdge=()=>{
	if(this.state.attempt)return;
	this.setState({error:false});
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
		if(this.state.attempt)return;
		this.setState({error:false});
			  this.nodes = [
		                {"name": "1","highlight":false,"state":0},
		  ]
		this.n = 1;
		this.links = [
		]
		this.animate();

	}
  
   
   
   setX=()=>{
	if(this.state.attempt)return;
	this.setState({error:false});
		for(var i=0;i<this.n;i++){
			console.log(this.nodes[i]["highlight"]);
						if(this.nodes[i]["highlight"])this.nodes[i]['state']=1;

		}
		this.animate();
	}
	
	   setY=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		for(var i=0;i<this.n;i++)
			if(this.nodes[i]["highlight"])this.nodes[i]['state']=2;
		this.animate();
	}
	
	   setZ=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		for(var i=0;i<this.n;i++)
			if(this.nodes[i]["highlight"])this.nodes[i]['state']=3;
		this.animate();
	}
	
	   clearNode=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		for(var i=0;i<this.n;i++)
			if(this.nodes[i]["highlight"])this.nodes[i]['state']=0;
		this.animate();
	}
	
	attemp=()=>{
		if(this.state.attempt)return;
		var x=[],y=[],z=[];
		for(var i=0;i<this.n;i++){
			switch (this.nodes[i]['state']) {
			  case 1:
			  	x.push(i+1);
			  	break;
			  case 2:
			  	y.push(i+1);
			  	break;
			  case 3:
			  	z.push(i+1);
			  	break;
			  default:
			}
		}
		if(x.length==0){
			this.setState({error:true,alert_title:'Invalid setting',alert:'Empty X!'});
		}
		else if(y.length==0){
			this.setState({error:true,alert_title:'Invalid setting',alert:'Empty y!'});
		}
		else{
			var z_string = z.length>0?'Given '+z+', is ':'Is ';
			this.setState({error:false,attempt:true,query:z_string+x+' and '+y+' (conditoinally) independent?'});
			
		}
	}
	
	closeAlert =() =>{
		this.setState({error:false});
	}
	
	randomQuery = ()=>{
		if(this.state.attempt)return;
		if(this.n<2){
			this.setState({error:true,alert_title:'Invalid setting',alert:'No enough nodes!'})
			return;
		}
		
		this.setState({error:false});
		function getRandomInt(max) {
		  return Math.floor(Math.random() * max);
		}

		for(var i=0;i<this.n;i++){
			this.nodes[i]['state']=0;
		}
		var q1=getRandomInt(this.n);
		var q2=getRandomInt(this.n);
		while(q1==q2)q2=getRandomInt(this.n);
		this.nodes[q1]['state']=1;
		this.nodes[q2]['state']=2;
		for(var i=0;i<this.n;i++)
			if(Math.random()<0.5&&i!=q1&&i!=q2){
				this.nodes[i]['state']=getRandomInt(4);
			}
		this.animate();
	}
	
	answerYes = ()=>{
		this.setState({attempt:false,answer:true,answer_title:"Congratulations!",answer_content:"You are correct!"});
		
	}
	
	answerNo = ()=>{
		this.setState({attempt:false,answer:true,answer_title:"Congratulations!",answer_content:"You are correct!"});
		
	}
	
	closeAnswer = ()=>{
		this.setState({answer:false});
	}
   
   render = () => {
	var alert;
		if(this.state.error){
			alert = <Alert variant="danger"  onClose={this.closeAlert} dismissible>
			        <Alert.Heading>{this.state.alert_title}</Alert.Heading>
			        <p>
			          {this.state.alert}
			        </p>
			      </Alert>;
		}
		else alert=null;
		var attempt;
		if(this.state.attempt){
			attempt = <Modal.Dialog>
				  <Modal.Header>
				    <Modal.Title>Attempt</Modal.Title>
				  </Modal.Header>
				
				  <Modal.Body>
				    <p>{this.state.query}</p>
				  </Modal.Body>
				
				  <Modal.Footer>
				    <Button variant="primary" onClick={ this.answerYes }>YES</Button>
				    <Button variant="secondary" onClick={ this.answerNo }>NO</Button>
				  </Modal.Footer>
				</Modal.Dialog>;
		}
		else attempt = null;
    	return (
	        <Container className="p-3">
	        <center>
	        	<svg width={this.window_w} height={this.window_h}>
				      <g className="links"></g>
				          <g className="circles"></g>
				    <g className="nodes"></g>
				  </svg>
				  <br/>
		      	<Button onClick={ this.addNode }>Add Node</Button>
		        <Button onClick={ this.addEdge }>Add Edge</Button>
		        <Button onClick={ this.clearGraph }>Clear Graph</Button>{'  '}
		        <Button onClick={ this.setX } variant="success">Set X</Button>
		        <Button onClick={ this.setY } variant="danger">Set Y</Button>
		        <Button onClick={ this.setZ } variant="warning">Set Z</Button>
		        <Button onClick={ this.clearNode } variant="secondary">Clear Node</Button>{'  '}
		        <Button onClick={ this.randomQuery } variant="info">Random Query</Button>{'  '}
		        <Button onClick={ this.attemp } variant="dark">Attempt</Button>{'  '}
				{alert}
				{attempt}
				 <Modal show={this.state.answer} onHide={this.closeAnswer}>
			        <Modal.Header closeButton>
			          <Modal.Title>{this.state.answer_title}</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>{this.state.answer_content}</Modal.Body>
			        <Modal.Footer>
			          <Button variant="secondary" onClick={this.closeAnswer}>
			            Close
			          </Button>
			        </Modal.Footer>
			      </Modal>
				</center>
	        </Container>
		)
   }
}
