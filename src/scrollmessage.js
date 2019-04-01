const queue = require('async/queue');
const randomHexColor = require('random-hex-color');

const CHAR_MATRICES = require('./characters').CHAR_MATRICES;

function screenUpdate(displayBuffer, node){
	var aux1, aux2, randomColor = randomHexColor();
	var msg = {
		payload: ""
	};

	function setColor(state){
		if(state){ //on
			if(!node.randomColor){
				msg.payload += node.colorHex;
			}else{
				msg.payload += randomColor;
			}
		}else{ //off
			msg.payload += node.backHex;
		}
	}

	if(node.flip == 0){ //normal
		for(let i = 0; i < 8; i++){
			for(let j = 7 ; j >= 0; j--){
				var temp = j != 0 ? (displayBuffer[i] >> j) & 0b1 : displayBuffer[i] & 0b1;
				
				aux1 = 7 - j; //column
				msg.payload += `${aux1},${i},`;
				
				setColor(temp);
				
				if(j - 1 >= 0){
					msg.payload += ",";
				}
			}
			if(i + 1 < displayBuffer.length){
				msg.payload += ",";
			}
		}
	}else if(node.flip == 1){ //horizontally
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				var temp = j != 0 ? (displayBuffer[i] >> j) & 0b1 : displayBuffer[i] & 0b1;

				msg.payload += `${j},${i},`;

				setColor(temp);

				if(j + 1 < displayBuffer.length){
					msg.payload += ",";
				}
			}
			if(i + 1 < displayBuffer.length){
				msg.payload += ",";
			}
		}
	} else{ //vertically
		for(let i = 7; i >= 0; i--){
			for(let j = 7 ; j >= 0; j--){
				var temp = j != 0 ? (displayBuffer[i] >> j) & 0b1 : displayBuffer[i] & 0b1;
				
				aux1 = 7 - j; //column
				aux2 = 7 - i; //line
				msg.payload += `${aux1},${aux2},`;
				
				setColor(temp);
				
				if(j - 1 >= 0){
					msg.payload += ",";
				}
			}
			if(i - 1 >= 0){
				msg.payload += ",";
			}
		}
	}

	if(node.rotation){ //inserts rotation
		msg.payload += `\nR${node.rotation}`;
	}

	node.send(msg);
}

function scrollMessage(message, node, nextMessage){

	let index, temp;
	let displayBuffer = [0b0,0b0,0b0,0b0,0b0,0b0,0b0,0b0];

	let q = queue(function(task, callback) {
		screenUpdate(task.buffer, task.node);
		setTimeout(callback, task.node.delay);
	});

	q.drain = function(){
		nextMessage();
	};

	for(let k = 0; k < message.length; k++){ //loops through the characters
		for(let scroll = 0; scroll < (8/node.shiftAmount); scroll++){ //shifts display
			for(let line = 0; line < 8; line++){ //loops through the lines
				index = message.charCodeAt(k); //gets the ASCII integer code
				temp = CHAR_MATRICES[index-32][line];
				displayBuffer[line] = (displayBuffer[line] << node.shiftAmount)
												| (temp >> ((8 - node.shiftAmount) - scroll * node.shiftAmount));
			}
			
			q.push({buffer: displayBuffer.slice(0), node});
		}
	}
}

module.exports = function(RED) {
	
    function scrollMessageNode(config) {
        RED.nodes.createNode(this,config);
		
		this.colorHex = config.colorHex || "#ffffff";
		this.backHex = config.backHex || "#000000";
		this.shiftAmount = config.shiftAmount || 1;
		this.delay = config.delay || 200;
		this.rotation = config.rotation || 0;
		this.flip = config.flip || 0;
		this.randomColor = config.randomColor || false;
		
        let node = this;
		
		let q = queue(function(task, callback) {
			scrollMessage(task, node, callback);
		});

		node.on('input', function(msg){
			q.push(msg.payload + ' ');
		});

        node.on('close', q.kill);
    }
    RED.nodes.registerType("scrollMessage", scrollMessageNode);
}