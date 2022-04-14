import React, { Component, setState } from 'react';
import ReactDOM from 'react-dom'
import Navigation from './navigation';
import './DSeparation.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

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
			_links.push({source:_nodes[this.links[i].source],target:_nodes[this.links[i].target],shade:this.links[i].shade})
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
		console.log(_links);
		function adjust(x){
			d3.select('.circles')
				.selectAll('circle')
				.style("stroke", "none");
			var that = x['ref'];
			that.nodes[parseInt(x.name)-1]['state']+=1;
			if(that.nodes[parseInt(x.name)-1]['state']>3)
				that.nodes[parseInt(x.name)-1]['state']=0;
			d3.select("circle:nth-child("+parseInt(x.name)+")").style("stroke", "black").style('stroke-width',"3");
			that.animate();
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
				.attr('marker-end',function(d){
					if(d.shade) return 'url(#arrow2)';
					else return 'url(#arrow)';
				})
				.style("stroke", function(d){
					if(d.shade)return '#111';
					else return '#aaa';
				});
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
				.style("stroke", function(d){return d['highlight']?"#111":"none"})
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
		    .attr("fill","#aaa");
		  d3.select('svg').append("defs").append("marker")
		    .attr("id", "arrow2")
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", 0)
		    .attr("markerWidth", 4)
		    .attr("markerHeight", 4)
		    .attr("orient", "auto")
		  .append("svg:path")
		    .attr("d", "M0,-5L10,0L0,5")
		    .attr("fill","#111");
			this.animate();
		   }
   componentDidUpdate=()=>{
		this.animate();

	}
   
   clearEdge=()=>{
		for(var i=0;i<this.links.length;i++)
			this.links[i].shade=false;
		for(var i=0;i<this.n;i++){
			this.nodes[i]['highlight']=false;
		}
	}
   
   addNode=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
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
	this.clearEdge();
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
		this.links.push({source: l, target: r, shade:false});
		this.animate();

	}
	
	   clearGraph=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
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
	this.clearEdge();
		for(var i=0;i<this.n;i++){
						if(this.nodes[i]["highlight"])this.nodes[i]['state']=1;

		}
		this.animate();
	}
	
	   setY=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
		for(var i=0;i<this.n;i++)
			if(this.nodes[i]["highlight"])this.nodes[i]['state']=2;
		this.animate();
	}
	
	   setZ=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
		for(var i=0;i<this.n;i++)
			if(this.nodes[i]["highlight"])this.nodes[i]['state']=3;
		this.animate();
	}
	
	   clearNode=()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
		for(var i=0;i<this.n;i++)
			this.nodes[i]['state']=0;
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
			this.clearEdge();
			var z_string = z.length>0?'Given '+z+', is ':'Is ';
			this.setState({error:false,attempt:true,query:z_string+x+' and '+y+' (conditoinally) independent?'});
			
		}
	}
	
	closeAlert =() =>{
		this.setState({error:false});
		this.clearEdge();
	}
	
	randomQuery = ()=>{
		if(this.state.attempt)return;
		if(this.n<2){
			this.setState({error:true,alert_title:'Invalid setting',alert:'No enough nodes!'})
			return;
		}
		
		this.setState({error:false});
		this.clearEdge();
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
			if(Math.random()<0.3&&i!=q1&&i!=q2){
				this.nodes[i]['state']=3;
			}
		this.animate();
	}
	
	answerYes = ()=>{
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
		var thelinks = []
		for(var i=0;i<this.links.length;i++){
			var t = Object.assign({}, this.links[i]);
			t['source']+=1;
			t['target']+=1;
			thelinks.push(t);
		}
		var settings = {
			'x':x,
			'y':y,
			'z':z,
			'n':this.n,
			'links':thelinks
		}
		  try {
		    fetch(
		      	'http://3.98.151.11:8081/',{
					method: 'GET',
					headers: {
					    Accept: 'application/json',
					    'Content-Type': 'application/json',
					    'content': JSON.stringify(settings),
					},
				}
		    ).then(response => { return response.json();})
		    .then(responseData => {console.log(responseData); return responseData;})
		    .then(data=>{
				if(data==null){
					this.setState({attempt:false,answer:true,answer_title:"Congratulations!",answer_content:"You are correct!"});
				}else{
					this.setState({attempt:false,answer:true,answer_title:"Sorry!",answer_content:"The answer is different! The unblocked paths are shown dark in the graph. And the colliders (if any) are also marked dark."});
					for(const [key, value] of Object.entries(data)){
						if(key[0]=='p'){
							var last = -1;
							var ar = JSON.parse('['+value+']');
							for(var i=0;i<ar.length;i++){
								var now = ar[i]-1;
								if(last!=-1){
									for(var j=0;j<this.links.length;j++){
										if(this.links[j]['source']==last&&this.links[j]['target']==now||this.links[j]['source']==now&&this.links[j]['target']==last){
											this.links[j].shade=true;
										}
									}
								}
								last = now;
							}
						}else{
							var ar = JSON.parse('['+value+']');
							for(var i=0;i<ar.length;i++){
								this.nodes[ar[i]-1]['highlight']=true;
							}
						}
					}
				}
			});
		  } catch (error) {
		  	console.error(error);
		  }
		
	}
	
	answerNo = ()=>{
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
		var thelinks = []
		for(var i=0;i<this.links.length;i++){
			var t = Object.assign({}, this.links[i]);
			t['source']+=1;
			t['target']+=1;
			thelinks.push(t);
		}
		var settings = {
			'x':x,
			'y':y,
			'z':z,
			'n':this.n,
			'links':thelinks
		}
		  try {
		    fetch(
		      	'http://3.98.151.11:8081/',{
					method: 'GET',
					headers: {
					    Accept: 'application/json',
					    'Content-Type': 'application/json',
					    'content': JSON.stringify(settings),
					},
				}
		    ).then(response => { return response.json();})
		    .then(responseData => {console.log(responseData); return responseData;})
		    .then(data=>{
				if(data!=null){
					for(const [key, value] of Object.entries(data)){
						if(key[0]=='p'){
							var last = -1;
							var ar = JSON.parse('['+value+']');
							for(var i=0;i<ar.length;i++){
								var now = ar[i]-1;
								if(last!=-1){
									for(var j=0;j<this.links.length;j++){
										if(this.links[j]['source']==last&&this.links[j]['target']==now||this.links[j]['source']==now&&this.links[j]['target']==last){
											this.links[j].shade=true;
										}
									}
								}
								last = now;
							}
						}else{
							var ar = JSON.parse('['+value+']');
							for(var i=0;i<ar.length;i++){
								this.nodes[ar[i]-1]['highlight']=true;
							}
						}
					}
					this.setState({attempt:false,answer:true,answer_title:"Congratulations!",answer_content:"You are correct! The unblocked paths are shown dark in the graph. And the colliders (if any) are also marked dark."});
				}else{
					this.setState({attempt:false,answer:true,answer_title:"Sorry!",answer_content:"The answer is different!"});
				}
			});
		  } catch (error) {
		  	console.error(error);
		  }		
	}
	
	closeAnswer = ()=>{
		this.setState({answer:false});
	}
	
	example1 = ()=>{
		if(this.state.attempt)return;
		this.setState({error:false});
		this.clearEdge();
		this.n=4;
		this.nodes=[{"name": "1","highlight":false,"state":1},
				{"name": "2","highlight":false,"state":2},
				{"name": "3","highlight":false,"state":0},
				{"name": "4","highlight":false,"state":3}];
		this.links = [{source:0,target:2},
						{source:1, target:2},
						{source:2, target:3}];
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
		var tmp=<><Button onClick={ this.setX } variant="success">Set X</Button>
		        <Button onClick={ this.setY } variant="danger">Set Y</Button>
		        <Button onClick={ this.setZ } variant="warning">Set Z</Button></>;
    	return (
	        <Container className="p-3">
	        <center>      <h3 className="header">D separation</h3>

	              <p><b>Background:</b> Given a Bayesian network, D-separation is an criterion that decides whether a set X of variables is independent of another set Y, given a third set Z.</p>
	              <p><b>Demonstration:</b> Below is a small tool to test your understanding of D-separation. You can generate a random graph by clicking the buttons and set queries by clicking on the nodes. 
	              The color of the nodes implies the query: given the <mark className="yellow">yellow</mark> nodes, are the <mark className="red">red</mark> nodes and the <mark className="green">green</mark> nodes conditionally independent? You can answer the query first and we will compare with the ground truth for you. 
	              You can also try some existing examples.</p>

	        	<svg width={this.window_w} height={this.window_h}>
				      <g className="links"></g>
				          <g className="circles"></g>
				    <g className="nodes"></g>
				  </svg>
				  <br/>
				  <ButtonGroup>
		      	<Button onClick={ this.addNode }>Add Node</Button>
		        <Button onClick={ this.addEdge }>Add Edge</Button>
		        <Button onClick={ this.clearGraph } variant="secondary">Clear Graph</Button>{'  '}
		        
		        <Button onClick={ this.clearNode } variant="secondary">Clear Node</Button>{'  '}
		        <Button onClick={ this.randomQuery } variant="info">Random Query</Button>{'  '}
		        <DropdownButton variant="info" title="Examples">
				  <Dropdown.Item onClick={this.example1}>Example1</Dropdown.Item>
				  <Dropdown.Item onClick={this.example2}>Example2</Dropdown.Item>
				  <Dropdown.Item onClick={this.example3}>Example3</Dropdown.Item>
				</DropdownButton>
			<Button onClick={ this.attemp } variant="dark">Attempt</Button>{'  '}
				</ButtonGroup>
		
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
