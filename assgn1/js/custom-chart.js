$(function() {    
    var w = 600;
    var h = 400;
    
    var margin = { left: 60, right: 10, top: 40, bottom: 30 };
    var figw = w - margin.left - margin.right;
    var figh = h - margin.top - margin.bottom;
    
    var x = d3.scaleLinear().range([margin.left, margin.left + figw]);
    var y = d3.scaleLinear().range([margin.top + figh, margin.top]);
    
    // Define the line
    var valueline = d3.line()
        .x(function(d, i) { return x(i + 1); })
        .y(function(d) { return y(d.rate); });
    
    //Define color schemes in different range values
    var colorScheme = d3.scaleQuantize()
        .domain([60, 200])
        .range(["green", "yellow", "orange", "red", "darkred"]);
       
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
   
    function renderChart(dataCategory){

        //Read data    
        d3.json(dataCategory,function(error, data) {
            if (error) {
                throw error;
            }       

        //Get SVG element reference
        var svg = d3.select("svg").attr("width", w).attr("height", h);

        x.domain([1, data.length]);
        y.domain([1, 200]);
        
        //Line graph path
        svg.append("path").datum(data)
        .attr("d", valueline)
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("stroke-width", "2");

        //Create circles on the line graph path
        var circle = svg.selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
        .attr("r",5)
        .attr("cx",function(d,i) {         
            return x(i+1); 
        })
        .attr("cy",function(d) {       
            return y(d.rate); })
        .attr("fill", function(d){       
            return colorScheme(d.rate).toString();      
        })
        //Handle mouse over event and show the data in a tooltip
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html('Time:' + d.time + "<br/>"  + "Rate:" + d.rate)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	

            d3.select(this).attr("r", 10);
            
            })					
        //Clear mouse over data
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(50)		
                .style("opacity", 0);	

            d3.select(this).attr("r", 5);
        });;
    
        //Draw x axis
        var xAxis = d3.axisBottom(x);
        svg.append("g")
            .attr("transform", function(d) {
            return "translate(" + 0 + "," + (margin.top + figh) + ")";
            })
            .call(xAxis);
        
        svg.append("text")             
                .attr("transform",
                    "translate(" + 200 + " ," + 
                                    (margin.top + figh + 30) + ")")
                .style("text-anchor", "middle")
                .text("Running Time (Min)");
        
        //Draw y axis
        var yAxis = d3.axisLeft(y);
        svg.append("g")
            .attr("transform", function(d) {
            return "translate(" + margin.left + "," + 0 + ")";
            })
        .call(yAxis);
            
        // text label for the y axis
        svg.append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", 90)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Heart Rate (Per Min)");

        //Legend
        var ordinal = d3.scaleOrdinal()
            .domain(["Warm Up", "Fat Burning", "Endurance Training", "Hardcore Training", "Max Effort"])
            .range([ "green", "yellow", "orange", "red", "darkred"]);
        
        svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(480,20)");

        var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolTriangle).size(150)())
        .shapePadding(10)
        .scale(ordinal);

        svg.select(".legendOrdinal")
        .call(legendOrdinal);

        }); 
            
    }
    
    renderChart("data/johns-heartbeat-data.json");

    $("#jdata").click(function() {
        d3.selectAll("svg > *").remove();
        renderChart("data/johns-heartbeat-data.json");
      });

    $("#kdata").click(function() {
        d3.selectAll("svg > *").remove();
        renderChart("data/kevins-heartbeat-data.json");
    });
});

