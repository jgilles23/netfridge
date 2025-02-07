// Network to display
var network_id = 'Demo';
// DOG GOES WOOF JFKD:FJDKSL:FJDKL:FJDK:L

$("input[name='radio']").click(function() {
    console.log(this);
    console.log($(this).attr('id'));

    var option = $(this).attr('id');

    //# Set url address.
    //base = 'http://127.0.0.1:5000/'
    //# Set query (i.e. http://url.com/?key=value).
    query = {}
    //# Set header.
    header = {'Content-Type':'application/json'}
    //aat = ((datetime.datetime.utcnow() - datetime.datetime.utcfromtimestamp(0)).total_seconds())
    at = $.now()
    //print at
    //# First, send the sine wave
    endpoint = 'network/Demo/object/Waves/stream/Results5'
    payload = [ {"value":option , "at":at} ]
    //# Set body (also referred to as data or payload). Body is a JSON string.
    //body = application/json.dumps(payload)


    $.ajax({
      type: "POST",
      url: '/' + endpoint,
      data: JSON.stringify(payload), //NEEDS TO BE IN PROPER FORMAT
      success: function ( data ) {
        console.log( "Success" );
        console.log( data );
      },
      error: function(e) {
        console.log( e );
      },
      contentType: 'application/json',
      dataType: 'json'
    });
    $.ajax({
      type: "POST",
      url: '/' + endpoint,
      data: JSON.stringify(payload), //NEEDS TO BE IN PROPER FORMAT
      success: function ( data ) {
        console.log( "Success" );
        console.log( data );
      },
      error: function(e) {
        console.log( e );
      },
      contentType: 'application/json',
      dataType: 'json'
    });    


    alert(option + ' try');
    //$.post('http://127.0.0.1:5000',option);
    //$.post('https://netfridge-jgiles.c9users.io',option);
    // $.post('/', option, function(msg) {
    //   if (msg) {
    //     alert("somebody");
    //   }
    // // Do something with the request
    // }, 'json');
    // //alert("Your a Dungeon Troll");
});


$(document).ready(function(){

	// Load the content containers
	loadContent();
	// Load the data that will be displayed
	// in the content containers.
	loadData();
	
	// Add functionality to nav-sidebar
	$('.nav-sidebar li').click(function(e) {
		// Prevent browser from opening link
		e.preventDefault();
		// Select current element
		var $this = $(this);
		if (!$this.hasClass('active')) {
			// Remove the class 'active' from all elements
			$('.nav-sidebar li.active').removeClass('active');
			// Add the class 'active' to current element
			$this.addClass('active');
			// Show/Hide accordingly
			$('div#content div.sub-contents').hide();
			$('div#content div#content-'+$this.text()).show();
		}
	});
	
	// Retrieve data and reload plot every 5 seconds.
	setInterval(function(){ 
		try{
			// If the "Plots" navigation is active
			if( $('#nav-Plots').hasClass('active') ){
				// Get id of selected data
				var activeIconID = $('.data-select.active').attr('id');
				var id_array = activeIconID.split('-');
				var active_object_id = id_array[1];
				var active_stream_id = id_array[2];
				// Reload plot and export
				reloadPlotAndExport( active_object_id, active_stream_id );
			}
		}catch(err){
			// Nothing
		}
	}, 5000);
	
	
});


//
//  Function for loading all page content containers
//
function loadContent(){
	// Load Overview
	var contentOverview = $(
		'<div id="content-Overview" class="col-md-12 sub-contents">'+
		'	 <div class="row">'+
		'	   <div class="col-md-12">'+
		'      <h2 class="sub-header">Overview</h2>'+
		'    </div>'+
		'	   <div class="col-md-8 content-left">'+
		'      This webpage is an example of a dashboard.</div>'+
		'	   <div class="col-md-4 content-right"></div>'+
		'  </div>'+
		'</div>');
	$('div#content').append( contentOverview );

	var contentAnalytics = $(
		'<div id="content-Analytics" class="col-md-12 sub-contents">'+
		'	 <div class="row">'+
		'	   <div class="col-md-12">'+
		'      <h2 class="sub-header">Analytics</h2>'+
		'    </div>'+
		'	   <div class="col-md-8 content-left">'+
		'      On this page you can find information regarding Emission Savings and Fridge Openings <img src="histogram.jpg" alt="Fridge Analytics"></div>'+
		'	   <div class="col-md-4 content-right"></div>'+
		'  </div>'+
		'</div>');
	$('div#content').append( contentAnalytics );
	
	// Load Reports
	var contentReports = $(
		'<div id="content-Reports" class="col-md-12 sub-contents">'+
		'	 <div class="row">'+
		'	   <div class="col-md-12">'+
		'      <h2 class="sub-header">Reports</h2>'+
		'    </div>'+
		'	   <div class="col-md-8 content-left">'+
		'      <h4>Links to Reports</h4>'+
		'      <ul>'+
		'        <li><a href="">Link 1</a></li>'+
		'        <li><a href="">Link 2</a></li>'+
		'        <li><a href="">Link 3</a></li>'+
		'      </ul>'+
		'    </div>'+
		'	   <div class="col-md-4 content-right"></div>'+
		'  </div>'+
		'</div>');
	contentReports.hide();
	$('div#content').append( contentReports );
	
	// Load Plots
	var contentPlots = $(
		'<div id="content-Plots" class="col-md-12 sub-contents">'+
		'	 <div class="row">'+
		'	   <div class="col-md-12">'+
		'      <h2 class="sub-header">Plots</h2>'+
		'    </div>'+
		'	   <div class="col-md-8 content-left">'+
		'    </div>'+
		'	   <div class="col-md-4 content-right"></div>'+
		'  </div>'+
		'</div>');
	contentPlots.hide();
	$('div#content').append( contentPlots );
	
	
	// Load Export
	var contentExport = $(
		'<div id="content-Export" class="col-md-12 sub-contents">'+
		'		<div class="row">'+
		'			<div class="col-md-12">'+
		'				<h2 class="sub-header">Export</h2>'+
		'			</div>'+
		'			<div class="col-md-6 content-left">'+
		'			<div class="table-responsive">'+
		'				<table class="table table-striped">'+
		'					<thead>'+
		'						<tr>'+
		'							<th>Time (UNIX)</th>'+
		'							<th>Time (ISO 8601)</th>'+
		'							<th>Value</th>'+
		'						</tr>'+
		'					</thead>'+
		'					<tbody>'+
		'					</tbody>'+
		'				</table>'+
		'			</div>'+
		'		</div>'+
		'		<div class="col-md-6 content-right"></div>'+
		'		</div>'+
		'</div>');
	contentExport.hide();
	$('div#content').append( contentExport );
}



//
//  Function for loading data from the DBNanoServer API
//
function loadData(){
	// Request Endpoint
	var endpoint = '/network/'+network_id;
	// Use .ajax() to make an HTTP request from JS
	$.ajax({
		type: 'GET',
		url: endpoint,
		dataType: "json",
		success: function(response_data) {
			// Called when successful
			//console.log("Network Info");
			//console.log(data);
			loadDataIntoContent( response_data );
		},
		error: function(e) {
			// Called when there is an error
			console.log(e.message);
		}
	});
}



//
//  Function for parsing the network data
//  and loading into content containers
//
function loadDataIntoContent( data ){
	$('div#dashboard-select').html('');
	// Setup the dashboard
	var active = true;
	// For each "object" in the "network"
	if ( data.hasOwnProperty("objects") ) {
		for ( var object_id in data.objects ){
			//console.log( object_id );
			if ( data.objects.hasOwnProperty(object_id) ) {
				//console.log( data.objects[object_id] );
				// For each "stream" in the "object"
				if ( data.objects[object_id].hasOwnProperty("streams") ) {
					for ( var stream_id in data.objects[object_id].streams ){
						//console.log( stream_id );
						if ( data.objects[object_id].streams.hasOwnProperty(stream_id) ) {
							//console.log( data.objects[object_id].streams[stream_id] );
							
							// Load a plot for this stream
							loadStreamPlot( object_id, stream_id, active );
							
							// Load an icon for this stream
							loadStreamIcon( object_id, stream_id, active );
							
							// Set the "first" stream as active
							if( active ){
								active = false;
							}
						}
					}
				}
			}
		}
	}
}

//
//  Function for loading a stream icon
//
function loadStreamIcon( object_id, stream_id, active ){
	// Add Icon
	var streamIcon = $(
		'<div class="col-sm-2 data-select" '+
		'id="select-'+object_id+'-'+stream_id+'">'+
		'  <span class="glyphicon glyphicon-signal" aria-hidden="true"></span>'+
		'  <h4>'+object_id+'</h4>'+
		'  <span class="text-muted">'+stream_id+'</span>'+
		'</div>'
	);
	$('div#dashboard-select').append( streamIcon );
	
	// Set initial selected
	if ( active ){
		streamIcon.addClass('active');
	}
	
	// Setup click function
	streamIcon.click(function(e) {
		console.log( "Change streams and update plot" );
		// Prevent browser from opening link
		e.preventDefault();
		// Select current element
		var $this = $(this);
		if (!$this.hasClass('active')) {
			// Remove the class 'active' from all elements
			$('.data-select.active').removeClass('active');
			// Add the class 'active' to current element
			$this.addClass('active');
			
			// Reload plot using most recent data
			var id = $this.attr('id');
			var id_array = id.split('-');
			var selected_object_id = id_array[1];
			var selected_stream_id = id_array[2];
			reloadPlotAndExport( selected_object_id, selected_stream_id );
			
			// Change which plot is shown
			$('.plot-container').hide();
			$('#plot-'+selected_object_id+'-'+selected_stream_id+'.plot-container').show();
		}
	});
}


//
//  Function for loading a plot in content div
//
function loadStreamPlot( object_id, stream_id, active ){
	// Create plot container
	var streamPlot = $(
		'<div class="plot-container" id="plot-'+object_id+'-'+stream_id+'">'+
		'</div>'
	);
	// Load Highcharts
	streamPlot.highcharts({
		chart: {
				type: 'spline'
		},
		title: {
				text: stream_id +' vs Time'
		},
		subtitle: {
				text: ""
		},
		xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: { // don't display the dummy year
						month: '%e. %b',
						year: '%b'
				},
				title: {
						text: 'Date'
				}
		},
		yAxis: {
				title: {
						text: stream_id
				}
		},
		tooltip: {
				headerFormat: '<b>{series.name}</b><br>',
				pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
		},
		plotOptions: {
				spline: {
						marker: {
								enabled: true
						}
				}
		}
	});
	
	// Add to page
	$('div#content-Plots div.content-left').append( streamPlot );
	
	// Hide plots that are not active
	if ( !active ) {
		streamPlot.hide();
	}else{
		reloadPlotAndExport( object_id, stream_id );
	}
}

//
//  Function reloading the Plot and Export displays
//  by retrieving most recent data from db server. 
//
function reloadPlotAndExport( object_id, stream_id ){
	// Select plot container for the stream
	var streamPlot = $('#plot-'+object_id+'-'+stream_id+'.plot-container');
	// The API endpoint for the stream
	var endpoint = '/network/'+network_id+'/object/'+object_id;
	endpoint += '/stream/'+stream_id;
    console.log(endpoint);
	// Load plot data
	$.ajax({
		type: 'GET',
		url: endpoint,
		data:{
			"limit": 50 // limit to last 50 points
		},
		dataType: "json",
		success: function(data) {
			// Called when successful
			// Get the points
			var points = data.objects[object_id].streams[stream_id].points;
            console.log(data);
			// Clear everything in <tbody> element
			tbody = $('#content-Export tbody').html('');
			
			// Iterate over points to place points in Highcharts format
			// and to populate the Export table.
			var datapoints = []
			for(var i=points.length-1;i>0;i--){
				datapoints.push( [ points[i].at*1000, points[i].value] )
				// Prepend a row to the Export table
				tbody.prepend(
					'<tr><td>'+points[i].at+'</td>'+
					'<td>'+(new Date(points[i].at*1000)).toISOString()+'</td>'+
					'<td>'+points[i].value+'</td></tr>'
				);
			}
			// Update Highcharts plot
			if( streamPlot.highcharts().series.length > 0 ){
				streamPlot.highcharts().series[0].setData( datapoints );
			}else{
				streamPlot.highcharts().addSeries({
					name: stream_id,
					data: datapoints
				});
			}
		},
		error: function(e) {
			// Called when there is an error
			console.log(e.message);
		}
	});
}
		