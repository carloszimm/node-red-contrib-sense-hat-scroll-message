# node-red-contrib-sense-hat-scroll-message

node-red-contrib-sense-hat-scroll-message is a Node-RED node to send scrolling message to the [node-red-node-pi-sense-hat-simulator](https://www.npmjs.com/package/node-red-node-pi-sense-hat-simulator) node. It works like an intermediate node, scrolling all messages contained in `msg.payload` in the LED display of the sense-hat simulator output node.

> Note: This isn't a replacement to the still unimplemented displaying message feature of the node-red-node-pi-sense-hat-simulator. This is meant to be a helper node to support such feature while it is not available.

## Installation

To install the package, just run the following command in your Node-RED user
directory (usually `~/.node-red`):

    npm install node-red-contrib-sense-hat-scroll-message

## Edit Dialog Options

 - Color
	 - Type: HTML input color
	 - Default value: `#ffffff`
	 - Values: any hexadecimal color
	 - Definition: the message's color
	 - Optional: If the checkbox "Random Colors" is checked, the color option will be disabled
 - Background
	 - Type: HTML input color
	 - Default value: `#000000` (equivalent to `off`)
	 - Values: any hexadecimal color
	 - Definition: the background of the LED display
 - Shift Amount
	 - Type: HTML drop-down list
	 - Default value: 1
	 - Values: 1, 2, 4, or 8
	 - Description: The shift amount by which the message will be scrolled
 - Delay
	 - Type: HTML input
	 - Default value: 200
	 - Description: delay in milliseconds
 - Rotation
	 - Type: HTML drop-down list
	 - Default value: 0
	 - Values: 0, 90, 180, 270
	 - Description: rotation in degrees
 - Flip
	 - Type: HTML drop-down list
	 - Default value: no
	 - Values: no, horizontally, vertically
	 - Description: flips the message

## Acknowledgment

The scrolling algorithm was based on the solution present in:

McRoberts, M. (2013). _Beginning Arduino_. Apress.

## License

node-red-contrib-sense-hat-scroll-message is available under the MIT license. See the [LICENSE file](https://github.com/carloszimm/node-red-contrib-sense-hat-scroll-message/blob/master/LICENSE) for more info.