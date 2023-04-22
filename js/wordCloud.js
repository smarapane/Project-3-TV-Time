class WordCloud {
constructor(_config, _data) {
    this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 500,
        containerHeight: _config.containerHeight || 500,
        margin: _config.margin || { top: 60, bottom: 50, right: 20, left: 70 },
        maxFontSize: _config.maxFontSize || 30,
        minFontSize: _config.minFontSize || 5,
        font: _config.font || "Arial",
    };

    this.data = _data;

    this.initVis();
}

initVis() {
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
            "translate(" + 185 + "," + 195 + ")"
        );

    
    // Set up the word cloud layout
    vis.layout = d3.layout
        .cloud()
        .size([vis.width, vis.height])
        .words(vis.data)
        .padding(2)
        .rotate(() => Math.floor(Math.random() * 2) * 90)
        .fontSize((d) =>
            Math.max(
                vis.config.minFontSize,
                Math.min(vis.config.maxFontSize, d.count)
            )
        )
        .font(vis.config.font)
        .on("end", (words) => {
            vis.renderVis(words);
    });

    // Generate the word cloud
    vis.layout.start();
}

renderVis(words) {
    let vis = this;
    
    // Define a color scale
    const colorScale = d3.scaleOrdinal()
        .domain(vis.data.map(d => d.text))
        .range(d3.schemeCategory10);

    // Create the word cloud elements
    vis.words = vis.svg.selectAll("text").data(words);
    vis.words
        .enter()
        .append("text")
        .style("font-size", (d) => d.size + "px")
        .style("font-family", vis.config.font)
        .style("fill", (d) => colorScale(d.text))
        .attr("text-anchor", "middle")
        .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
        .text((d) => d.text);
    vis.words.exit().remove();
}

updateVis() {
    let vis = this;

    // Update the word cloud layout and re-render
    vis.layout
        .words(vis.data)
        .fontSize((d) =>
            Math.max(
            vis.config.minFontSize,
            Math.min(vis.config.maxFontSize, d.count)
            )
        )
    .on("end", (words) => {
        vis.renderVis(words);
    })
    .start();
}
}
