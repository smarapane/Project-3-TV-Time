class WordCloud {
constructor(_config, _data, title) {
    this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 500,
        margin: _config.margin || { top: 60, bottom: 50, right: 20, left: 70 },
        maxFontSize: _config.maxFontSize || 30,
        minFontSize: _config.minFontSize || 15,
        font: _config.font || "Arial",
    };

    this.data = _data;
    this.title = title;

    this.initVis();
}

initVis() {
    console.log(this.title);
    let vis = this;

    // Adjust width and height to handle margins
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Create the container
    vis.svg = d3
        .select(vis.config.parentElement)
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight)
        .append("g")
        .attr(
            "transform",
            "translate(" + vis.config.containerWidth/2 + "," + vis.config.containerHeight/2 + ")"
        );

    vis.countScale = d3.scaleLinear()
        .domain(d3.extent(vis.data, d => d.count))
        .range([vis.config.minFontSize, vis.config.maxFontSize]);
    
    Math.seedrandom(4);
    // Set up the word cloud layout
    vis.layout = d3.layout
        .cloud()
        .size([vis.width, vis.height])
        .words(vis.data)
        .padding(3)
        .rotate(() => Math.floor(Math.random() * 2) * 90)
        .fontSize((d) => vis.countScale(d.count))
        .font(vis.config.font)
        .on("end", (words) => {
            vis.renderVis(words, vis.title);
    });

    // Generate the word cloud
    vis.layout.start();
}

renderVis(words, curr_character) {
    let vis = this;
    
    // Create the word cloud elements
    vis.words = vis.svg.selectAll("text").data(words);
    vis.words
        .join("text")
        .style("font-size", (d) => d.size + "px")
        .style("font-family", vis.config.font)
        .style("fill", "#000000")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
        .text((d) => d.text);
    vis.words.exit().remove();

    vis.svg
        .append("text")
        //.attr("transform", "translate(0,-70)")
        .attr("x", vis.width/15)
        .attr("y", -vis.height/2)
        .attr("font-size", "35px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text(curr_character);
}

updateVis(data, curr_character) {
    let vis = this;

    vis.countScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.count))
        .range([vis.config.minFontSize, vis.config.maxFontSize]);

    // Update the word cloud layout and re-render
    vis.layout
        .words(data)
        .fontSize((d) => vis.countScale(d.count))
    .on("end", (words) => {
        console.log(words);
        vis.renderVis(words, curr_character);
    })
    .start();
}
}
