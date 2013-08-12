var map = $('#map'),
	minlat =  44.9400000,
	minlon = -93.0980000,
	maxlat =  44.9520000,
	maxlon = -93.0840000;

/* TODO: bounding box of map to be determined by latitude and longitude */

function latScale(value) {
	return Math.round((value - minlat) * parseInt(map.css('width')) / (maxlat - minlat));
}
function lonScale(value) {
	return Math.round((value - minlon) * parseInt(map.css('height')) / (maxlon - minlon));
}

// Create the map
function createMap(data) {
	data.find('[k="building"]').each(function(i){
		
		$this = $(this);

		var nodes = $this.siblings('nd'),
			path = [];
		nodes.each(function(i){
			var node = data.find('#' + $(this).attr('ref'));
			path[i] = [node.attr('lat'), node.attr('lon')];
		});

		var dir = '';
		for (var i = 0; i < path.length; i++) {
			var coords = lonScale(path[i][1]) + ',' + (map.height() - latScale(path[i][0])) + ' ';
			dir += i === 0 ? 'M' : '';
			dir += coords;
			dir += i === path.length - 1 ? 'Z' : '';
		}

		var fill = $this.siblings('[k="name"]').length > 0 ? 'red' : 'black';

		var building = makeSVG('path', {
			d: dir,
			fill: fill
		});
		map[0].appendChild(building);
		building.setAttribute('title', $this.siblings('[k="name"]').attr('v'));

		// If there are levels, let's create another blue one
		/* if ($this.siblings('[k="building:levels"]').length > 0) { 
			dir = '';
			for (var i = 0; i < path.length; i++) {
				var coords = lonScale(path[i][1]) + ',' + (map.height() - latScale(path[i][0]) - $this.siblings('[k="building:levels"]').attr('v') * 5) + ' ';
				dir += i === 0 ? 'M' : '';
				dir += coords;
				dir += i === path.length - 1 ? 'Z' : '';
			}
			var clone = makeSVG('path', {
				d: dir,
				fill: 'blue'
			});
			map[0].appendChild(clone);
		} */
	});
	// Highways
	data.find('[v="Saint Paul Skyway"]').each(function(i){
		
		$this = $(this);

		var nodes = $this.siblings('nd'),
			path = [];
		nodes.each(function(i){
			var node = data.find('#' + $(this).attr('ref'));
			path[i] = [node.attr('lat'), node.attr('lon')];
		});

		var dir = '';
		for (var i = 0; i < path.length; i++) {
			var coords = lonScale(path[i][1]) + ',' + (map.height() - latScale(path[i][0])) + ' ';
			dir += i === 0 ? 'M' : '';
			dir += coords;
		}

		var road = makeSVG('path', {
			d: dir,
			fill: 'transparent',
			stroke: '#aaa',
			'stroke-width': 6
		});
		map[0].appendChild(road);

	});
}

// Static dev file uses the bounds described above
$.ajax({
	url: 'http://api.openstreetmap.org/api/0.6/map?bbox=' + minlon + ',' + minlat + ',' + maxlon + ',' + maxlat,
	dataType: 'xml',
	success: function(data){
		// getBuildings($(data).find('*'));
		createMap($(data));
	}
});

function makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}