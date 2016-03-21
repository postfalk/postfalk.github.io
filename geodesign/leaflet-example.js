var create_map = function() {
  var mymap = L.map('map').setView([37.80, -122.27], 14);
  L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}@2x.png')
    .addTo(mymap);
  L.marker([37.80, -122.27]).addTo(mymap);
};

var create_3d = function() {

  // mostly adapted from http://bost.ocks.org/mike/map/
  var width = 1200,
      height = 300;

  var svg = d3.select('#d3').append('svg')
      .attr('width', width)
      .attr('height', height);

  var source = 'https://gist.githubusercontent.com/postfalk/e56de3bb77c87c43c4a5/raw/80efde4e961f339239d3edc7d4fe250a97df990c/ca_counties.json';

  d3.json(source, function(error, data) {
    if (error) return console.error(error);

    var counties = topojson.feature(data, data.objects.ca_counties);

    var projection = d3.geo.mercator()
      .scale(1500)
      .center([-119.5, 37.15])
      .translate([width/4, height/2]);

    var path = d3.geo.path().projection(projection);

    var div = d3.select("body").append("div")
       .attr("class", "tooltip")
       .style("opacity", 0);

    var colorscale = d3.scale.linear()
      .range(['darkred', 'white', 'darkgreen'])
      .domain([-0.025, 0, 0.025]);

    svg.selectAll('.counties')
       .data(counties.features)
      .enter().append('path')
        .attr('d', path)
        .attr('stroke', 'white')
        .attr('stroke-width', .3)
        .attr('fill', function(d, i) {
          change = (d.properties.POP2012 - d.properties.POP2010)/d.properties.POP2010
          return colorscale(change)
        })
        .on('mouseover', function(d){
          div.html('test')
            .style("left", function() { return (d3.event.pageX) + "px"; } )
            .style("top", function() { return  (d3.event.pageY - 28) + "px"; } )
        })

    var legend_entries = [
      [0, -.025, '2.5% loss'],
      [1, -.01, '1% loss'],
      [2, 0, 'no change'],
      [3, .01, '1% gain'],
      [4, .025, '2.5% gain']
    ];

    svg.selectAll('rect')
      .data(legend_entries)
    .enter().append('rect')
      .attr('x', 400)
      .attr('y', function(d, i) {return 30 + i * 15})
      .attr('fill', function(d, i) {return colorscale(d[1])})
      .attr('stroke-width', .2)
      .attr('stroke', 'black')
      .attr('height', 10)
      .attr('width', 20);

    svg.selectAll('text')
      .data(legend_entries)
    .enter().append('text')
        .attr('x', 425)
        .attr('font-size', 9)
        .attr('y', function(d, i) {return 40 + i * 15})
        .text(function(d) {return d[2]});

  });

 }
