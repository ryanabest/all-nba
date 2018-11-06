let parseTime = d3.timeParse('%y-%m-%d');

allNBA = d3.csv("https://gist.githubusercontent.com/anonymous/0ac179f7d78d5c9c9380226008d12953/raw/89152f39199836e07dbe7baad3c2a0624e8b0ae5/the_whole_nba.csv").then(
  function(allNBA) {
    // format columns types
    allNBA.forEach(function(d) {
      d.home_pt = +d.home_pt
      ,d.away_pt = +d.away_pt
      ,d.margin = +d.margin
      ,d.date = parseTime(d.date)
    })
    let width = 750;
    let height = 750;
    let margin = {top: 40, right: 40, bottom: 40, left: 40};
    let maxPts = Math.max(d3.max(allNBA, d => d.away_pt),d3.max(allNBA, d => d.home_pt));

    // create function to map home team score to x-axis
    let x = d3.scaleLinear()
              .domain([0,maxPts+1])
              .range([margin.left,width-margin.right])

    // create function to map home team score to x-axis
    let y = d3.scaleLinear()
              .domain([0,maxPts+1])
              .range([height-margin.bottom,margin.top])

    // create svg element
    let svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

    svg.append("rect")
       .attr("width", width-margin.left-margin.right)
       .attr("height", height-margin.top-margin.bottom)
       .attr("x",margin.left)
       .attr("y",margin.top)
       .attr("fill", "#7d7d7d")
       .attr("opacity",0.9);

    // create axes
    let xAxis = svg.append("g")
                   .call(d3.axisBottom(x).tickValues([d3.min(allNBA,d=>d.home_pt),d3.quantile(allNBA,0.25,d=>d.home_pt),d3.median(allNBA,d=>d.home_pt),d3.quantile(allNBA,0.75,d=>d.home_pt),d3.max(allNBA,d=>d.home_pt)]))
                   .attr("transform",`translate(0,${height-margin.bottom})`)
                   .attr("fill","white")
                   .select('.domain').remove()
                    // .attr('stroke','none');
    let yAxis = svg.append("g")
                   .call(d3.axisLeft(y).tickValues([d3.min(allNBA,d=>d.away_pt),d3.quantile(allNBA,0.25,d=>d.away_pt),d3.median(allNBA,d=>d.away_pt),d3.quantile(allNBA,0.75,d=>d.away_pt),d3.max(allNBA,d=>d.away_pt)]))
                   .attr("transform",`translate(${margin.left},0)`)
                   .attr("fill","white")
                   .select('.domain').remove()
                    // .attr('stroke','none');

    // plot point for each score
    svg.selectAll(".score")
       .data(allNBA)
       .enter().append("circle")
               .attr("class","score")
               .attr("r",2.5)
               .attr("stroke-width","2")
               .attr("cx",d=>x(d.home_pt))
               .attr("cy",d=>y(d.away_pt))
               .attr("opacity",0.4)
               .attr("fill",function(d) {if(d.home_pt > d.away_pt) {return "#FFF"} else {return "#000"}})

    // create scoring margin lines every 10 pts up to 50
    for (let i=0;i<=50;i+=10) {
      svg.append("line")
         .attr("x1",x(i))
         .attr("y1",y(0))
         .attr("x2",x(maxPts))
         .attr("y2",y(maxPts-i))
         .attr("stroke","#646464")
         .attr("stroke-width",1)
         .attr("opacity",0.5);
      svg.append("line")
         .attr("x1",x(0))
         .attr("y1",y(i))
         .attr("x2",x(maxPts-i))
         .attr("y2",y(maxPts))
         .attr("stroke","#c8c8c8")
         .attr("stroke-width",1)
         .attr("opacity",0.5);
     }
  }
);
