// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// function buildGraph(data) {
//   function linkArc(d) {
//     const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
//     return `
//       M${d.source.x},${d.source.y}
//       A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
//     `;
//   }
//   drag = simulation => {

//     function dragstarted(event, d) {
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     }

//     function dragged(event, d) {
//       d.fx = event.x;
//       d.fy = event.y;
//     }

//     function dragended(event, d) {
//       if (!event.active) simulation.alphaTarget(0);
//       d.fx = null;
//       d.fy = null;
//     }

//     return d3.drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended);
//   }
//   const width = 900;
//   const height = 600;
//   const types = Array.from(new Set(data.map((d) => d.type)));
//   const nodes = Array.from(
//     new Set(data.flatMap((l) => [l.source, l.target])),
//     (id) => ({ id })
//   );
//   const links = data.map((d) => Object.create(d));

//   const color = d3.scaleOrdinal(types, d3.schemeCategory10);

//   const simulation = d3
//     .forceSimulation(nodes)
//     .force(
//       "link",
//       d3.forceLink(links).id((d) => d.id)
//     )
//     .force("charge", d3.forceManyBody().strength(-600))
//     .force("x", d3.forceX())
//     .force("y", d3.forceY());

//   const svg = d3
//     .create("svg")
//     .attr("viewBox", [-width / 2, -height / 2, width, height])
//     .attr('style', "width: 100%; height:'auto'")
//     .style("font", "12px sans-serif");

//   // Per-type markers, as they don't inherit styles.
//   svg
//     .append("defs")
//     .selectAll("marker")
//     .data(types)
//     .join("marker")
//     .attr("id", (d) => `arrow-${d}`)
//     .attr("refX", 15)
//     .attr("refY", -0.5)
//     .attr("markerWidth", 6)
//     .attr("markerHeight", 6)
//     .attr("orient", "auto")
//     .append("path")
//     .attr("fill", color)
//     .attr("d", "M0,-5L10,0L0,5");

//   const link = svg
//     .append("g")
//     .attr("fill", "none")
//     .attr("stroke-width", 1.5)
//     .selectAll("path")
//     .data(links)
//     .join("path")
//     .attr("stroke", (d) => color(d.type))
//     .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);

//   const node = svg
//     .append("g")
//     .attr("fill", "currentColor")
//     .attr("stroke-linecap", "round")
//     .attr("stroke-linejoin", "round")
//     .selectAll("g")
//     .data(nodes)
//     .join("g")
//     .call(drag(simulation));

//   node
//     .append("circle")
//     .attr("stroke", (d) => color(d.type))
//     .attr("stroke-width", 1.5)
//     .attr("r", 4);

//   node
//     .append("text")
//     .attr("x", 8)
//     .attr("y", "0.31em")
//     .text((d) => d.id)
//     .clone(true)
//     .lower()
//     .attr("text-anchor", "middle")
//     .attr("fill", "none")
//     .attr("stroke", "white")
//     .attr("stroke-width", 3);

//   simulation.on("tick", () => {
//     link.attr("d", linkArc);
//     node.attr("transform", (d) => `translate(${d.x},${d.y})`);
//   });

//   // Append the SVG element.
//   let div = document.getElementById("d3_div");
//   div.appendChild(svg.node());
// }

function buildGraph(data) {
  const backgroundColors = [
    "#0074E4", // Bright Blue
    "#00A454", // Bright Green
    "#8A56AC", // Deep Purple
    "#FF6B4A", // Vibrant Orange
    "#333333", // Dark Gray
    "#FF5454", // Bright Red
    "#00C1D4", // Cyan
    "#FFA400", // Bright Yellow
    "#FFCF00", // Yellow
    "#AB74FF", // Light Purple
  ];
  let nodes = data.map((d) => ({
    data: { id: d.sourceUrl, type: d.type, href: d.sourceUrl, name: d.source, bg: backgroundColors[convertTypetoColor(d.type)] },
  }));
  nodes = nodes.concat(
    data.map((d) => ({
      data: {
        id: d.targetUrl,
        type: d.type,
        href: d.targetUrl,
        name: d.target,
        bg: backgroundColors[convertTypetoColor(d.type)],
      },
    }))
  );
  console.log(nodes);
  const edges = data.map((d) => ({
    data: { source: d.sourceUrl, target: d.targetUrl },
  }));
  //use 20 colors, random group by type
  const types = Array.from(new Set(data.map((d) => d.type)));


  const cy = cytoscape({
    container: document.getElementById("cy"),
    elements: {
      nodes: nodes,
      edges: edges,
    },
    style: cytoscape
      .stylesheet()
      .selector("node")
      .css({
        'content': "data(name)",
        "text-valign": "bottom",
        "text-halign": "center",
        'color': "black",
        "background-color": "data(bg)",
      })
      .selector(":selected")
      .css({
        "background-color": "black",
        "line-color": "black",
        "target-arrow-color": "black",
        "source-arrow-color": "black",
        "text-outline-color": "black",
      })
      .selector("edge")
      .css({
        "curve-style": "bezier",
        "target-arrow-shape": "triangle",
      }),
  });
  cy.on("tap", "node", function () {
    try {
      // your browser may block popups
      window.open(this.data("href"));
    } catch (e) {
      // fall back on url change
      window.location.href = this.data("href");
    }
  });
}

function convertTypetoColor(type) {
  const hashCode = type
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numberBetween0And9 = hashCode % 10;
  return numberBetween0And9;
}

chrome.runtime.sendMessage({ message: "GET" }, function (response) {
  console.log(response.data);
  buildGraph(response.data);
});

document.addEventListener("DOMContentLoaded", function () {
  const data = buildGraphData();
  buildGraph(data);
});
