$(document).ready(function() {
	$(document).scroll(function(evt) {
		var first = Math.abs($('#container-1').position().top - $(window).height() / 2);
		var third = Math.abs($('#container-4').position().top - $(window).height() / 2);
		var second = Math.abs($('#container-3').position().top - $(window).height() / 2);
		var current = $(this).scrollTop();
		if (current > third) {
			document.getElementById("match_up_tab").classList.remove("active");
			document.getElementById("overview_tab").classList.remove("active");
			document.getElementById("grab_rate_tab").classList.remove("active");
			document.getElementById("comparison_tab").classList.add("active");

		} else if (current > second) {
			document.getElementById("overview_tab").classList.remove("active");
			document.getElementById("match_up_tab").classList.remove("active");
			document.getElementById("grab_rate_tab").classList.add("active");
			document.getElementById("comparison_tab").classList.remove("active");
		} else if (current > first) {
			document.getElementById("overview_tab").classList.remove("active");
			document.getElementById("match_up_tab").classList.add("active");
			document.getElementById("grab_rate_tab").classList.remove("active");
			document.getElementById("comparison_tab").classList.remove("active");
		} else {
			document.getElementById("overview_tab").classList.add("active");
			document.getElementById("match_up_tab").classList.remove("active");
			document.getElementById("grab_rate_tab").classList.remove("active");
			document.getElementById("comparison_tab").classList.remove("active");

		}
	});
});

var treeData = {
	name: "Pokemon",
	children: []
}

var typelist = [
	"Grass",
	"Fire",
	"Water",
	"Bug",
	"Normal",
	"Poison",
	"Electric",
	"Ground",
	"Fairy",
	"Fighting",
	"Psychic",
	"Rock",
	"Ghost",
	"Ice",
	"Dragon",
	"Dark",
	"Steel",
	"Flying"
]

var counter = {};
typelist.forEach(function(d, i) {
	counter[d] = [0, 0, 0, 0, 0, 0];
});

var legendData = [
	{Gen: "1",enable: true},
	{Gen: "2",enable: true},
	{Gen: "3",enable: true},
	{Gen: "4",enable: true},
	{Gen: "5",enable: true},
	{Gen: "6",enable: true}
];

var radarData = [
	[],
	[]
]

var border_color_lookup = {
	Grass: "lightgreen",
	Fire: "darkred",
	Water: "#00ffff",
	Bug: "brown",
	Normal: "#cccc00",
	Poison: "purple",
	Electric: "white",
	Ground: "#ffbe33",
	Fairy: "#ffffcc",
	Fighting: "pink",
	Psychic: "#ffccff",
	Rock: "#A58979",
	Ghost: "lightgrey",
	Ice: "#ccffff",
	Dragon: "#FF4516",
	Dark: "darkgreen",
	Steel: "grey",
	Flying: "#3366ff"
}

var data;

var maxHP = 0,
	maxAttack = 0,
	maxDefense = 0,
	maxSPAttack = 0,
	maxSPDefense = 0,
	maxSpeed = 0;

var unitHP = 0,
	unitAttack = 0,
	unitDefense = 0,
	unitSpeed = 0,
	unitSPAttack = 0,
	unitSPDefense = 0;

var pokemon_left = [];
var pokemon_right = [];

d3.csv('pokemon.csv').then(function(d) {
	data = d;
	d.forEach(function(datum, i) {
		counter[datum.Type_1][parseInt(datum.Generation) - 1] += 1;

		maxHP = Math.max(maxHP, datum.HP);
		maxAttack = Math.max(maxAttack, datum.Attack);
		maxDefense = Math.max(maxDefense, datum.Defense);
		maxSPAttack = Math.max(maxSPAttack, datum.Sp_Atk);
		maxSPDefense = Math.max(maxSPDefense, datum.Sp_Def);
		maxSpeed = Math.max(maxSpeed, datum.Speed);

		var div = document.createElement('div');
		div.classList.add("icon-wrapper");
		var img = document.createElement('img');
		img.classList.add("icon");
		img.style.borderColor = border_color_lookup[datum.Type_1];
		img.src = "./icons/" + datum.Number + ".png"
		div.appendChild(img);
		var name = document.createElement('span');
		name.innerHTML = datum.Name;
		div.appendChild(name);
		div.setAttribute("name", datum.Name);
		div.setAttribute("pokemon_type", datum.Type_1);
		div.setAttribute("pokemon_id", datum.Number);
		div.setAttribute("pokemon_gen", datum.Generation);
		img.setAttribute("name", datum.Name);
		img.setAttribute("pokemon_type", datum.Type_1);
		img.setAttribute("pokemon_id", datum.Number);
		img.addEventListener("click", function() {
			pick1(this);
		});

		d3.select('#gallery1').node().append(div);
		pokemon_left.push(div);

		var div2 = document.createElement('div');
		div2.classList.add("icon-wrapper");
		var img2 = document.createElement('img');
		img2.classList.add("icon");
		img2.style.borderColor = border_color_lookup[datum.Type_1];
		img2.src = "./icons/" + datum.Number + ".png"
		div2.appendChild(img2);
		var name2 = document.createElement('span');
		name2.innerHTML = datum.Name;
		div2.appendChild(name2);
		div2.setAttribute("name", datum.Name);
		div2.setAttribute("pokemon_type", datum.Type_1);
		div2.setAttribute("pokemon_id", datum.Number);
		div2.setAttribute("pokemon_gen", datum.Generation);
		img2.setAttribute("name", datum.Name);
		img2.setAttribute("pokemon_type", datum.Type_1);
		img2.setAttribute("pokemon_id", datum.Number);
		img2.addEventListener("click", function() {
			pick2(this);
		});

		d3.select('#gallery2').node().append(div2);
		pokemon_right.push(div2);

	});

	typelist.forEach(function(d, i) {
		var tmp = {
			name: d,
			children: []
		}
		for (var j = 0; j < 6; j++) {
			var tmp1 = {
				name: d + " Gen_" + (j + 1),
				value: counter[d][j]
			}
			tmp.children.push(tmp1);
		}
		treeData.children.push(tmp);
	});

	loadTreeMap();

	unitHP = maxHP / 5;
	unitAttack = maxAttack / 5;
	unitDefense = maxDefense / 5;
	unitSpeed = maxSpeed / 5;
	unitSPAttack = maxSPAttack / 5;
	unitSPDefense = maxSPDefense / 5;

	pick1(pokemon_left[100].children[0]);
	pick2(pokemon_left[200].children[0]);
});

function loadTreeMap() {
	var width = document.getElementById("treemap-chart").clientWidth;
	var height = document.getElementById("treemap-chart").clientHeight - document.getElementById("treemap-title1").clientHeight - document.getElementById("treemap-title2").clientHeight;

	var treemap = dt => d3.treemap()
		.size([width, height])
		.padding(1.5)
		(d3.hierarchy(dt)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value))

	var root = treemap(treeData);

	var svg = d3.select("#treemap-chart")
		.append('svg')
		.attr("width", width)
		.attr("height", height)
		.style("font", "12px sans-serif");


	var leaf = svg.selectAll("g")
		.data(root.leaves())
		.join("g")
		.attr("transform", d => `translate(${d.x0},${d.y0})`);

	leaf.append("title")
		.text(d => {
			var t = d.data.name.split(" ");
			var type_name = t[0].toLowerCase();
			var gen = t[1][t[1].length - 1]
			var n;
			if (gen == '1') {
				n = 'st';
			} else if (gen == '2') {
				n = 'nd';
			} else if (gen == '3') {
				n = 'rd';
			} else {
				n = 'th';
			}
			return "Click to start a battle between Pokemons in " + type_name + " type and " + gen + n + " generation!";
		});


	leaf.append("rect")
		.attr("fill", d => {
			while (d.depth > 1) d = d.parent;
			return border_color_lookup[d.data.name];
		})
		.attr("fill-opacity", 1)
		.attr("width", d => d.x1 - d.x0)
		.attr("height", d => d.y1 - d.y0)
		.on('click', function(d) {
			var t = d.data.name.split(" ");
			var type_name = t[0];
			var gen = t[1][t[1].length - 1]
			document.getElementById('input1').value = type_name + " " + gen;
			inputChange(0);
			document.getElementById('input2').value = type_name + " " + gen;
			inputChange(1);

			window.scrollTo({
				top: 1100,
				behavior: "smooth"
			});
		});

	leaf.append("text")
		.selectAll("tspan")
		.data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(d.value))
		.join("tspan")
		.attr("x", 3)
		.attr("y", (d, i, nodes) => {
			return `${(i === nodes.length - 1) * 0.3 + 1.2 + i * 0.9}em`
		})
		.attr("fill-opacity", "1")
		.text(d => d)
		.style("font-weight", "bolder")
		.attr('fill', (d) => {
			return 'black';
		});

}

function clearfunc(i) {
	var eleSet;
	if (i == 0) {
		eleSet = pokemon_left;
	} else {
		eleSet = pokemon_right;
	}

	if (i == 0) {
		document.getElementById('input1').value = "";
	} else {
		document.getElementById('input2').value = "";
	}
	eleSet.forEach(function(d, i) {
		d.style.display = "block";
	});
}

function random_pick(i) {
	var eleSet;
	if (i == 0) {
		eleSet = pokemon_left;
	} else {
		eleSet = pokemon_right;
	}
	clearfunc(i);
	var r = Math.floor(Math.random() * data.length);
	eleSet[r].scrollIntoView(true);

	window.scrollTo({
		top: 1100,
		behavior: "smooth"
	});

	if (i == 0) {
		pick1(eleSet[r].children[0]);
	} else {
		pick2(eleSet[r].children[0]);
	}
}

function inputChange(i) {
	var str;
	var eleSet;
	var input;
	if (i == 0) {
		input = document.getElementById('input1');
		str = input.value.toLowerCase().split(" ");
		eleSet = pokemon_left;
	} else {
		input = document.getElementById('input2');
		str = input.value.toLowerCase().split(" ");
		eleSet = pokemon_right;
	}
	if (str.length >= 3) {
		alert("Only one or two key words allowed!")
		input.value = "";
		clearfunc(i);
	}
	eleSet.forEach(function(d, j) {
		var name = d.getAttribute("name").toLowerCase();
		var type = d.getAttribute("pokemon_type").toLowerCase();
		var gen = d.getAttribute("pokemon_gen").toLowerCase();
		if (str.length == 1) {
			if (name.includes(str[0])) {
				d.style.display = "block";
				return;
			} else if (type.includes(str[0])) {
				d.style.display = "block";
				return;
			} else if (gen.includes(str[0])) {
				d.style.display = "block";
				return
			} else {
				d.style.display = "none";
			}
		} else if (str.length == 2) {
			if (type.includes(str[0]) && gen.includes(str[1])) {
				d.style.display = "block";
			} else {
				d.style.display = "none";
			}
		}
	});
}

var previous_pick1 = null;
var previous_pick2 = null;
var current_left_datum;
var current_right_datum;

function pick1(element) {
	if (previous_pick1 != null) {
		previous_pick1.style.borderStyle = "solid";
	}
	previous_pick1 = element;
	element.style.borderStyle = "dashed";
	current_left_datum = data[parseInt(element.getAttribute("pokemon_id")) - 1];

	d3.select("#pick1").node().src = "./icons/" + element.getAttribute("pokemon_id") + ".png";
	d3.select("#pick1name").node().innerHTML = element.getAttribute("name");
	d3.select("#pick1type").node().innerHTML = element.getAttribute("pokemon_type") + " Gen. " + current_left_datum.Generation;
	d3.selectAll(".left").style("visibility", "visible");

	d3.select("#type_picker").node().value = current_left_datum.Type_1;

	for (var i = 0; i < legendData.length; i++) {
		legendData[i].enable = false;
	}

	legendData[parseInt(current_left_datum['Generation']) - 1].enable = true;

	radarData[0] = [{
			axis: "HP",
			value: current_left_datum.HP / unitHP
		},
		{
			axis: "ATK",
			value: current_left_datum.Attack / unitAttack
		},
		{
			axis: "DEF",
			value: current_left_datum.Defense / unitDefense
		},
		{
			axis: "SP. ATK",
			value: current_left_datum.Sp_Atk / unitSPAttack
		},
		{
			axis: "SP. DEF",
			value: current_left_datum.Sp_Def / unitDefense
		},
		{
			axis: "SPEED",
			value: current_left_datum.Speed / unitSpeed
		}
	];
	draw_radar();
}

function pick2(element) {
	if (previous_pick2 != null) {
		previous_pick2.style.borderStyle = "solid";
	}
	previous_pick2 = element;
	element.style.borderStyle = "dashed";

	current_right_datum = data[parseInt(element.getAttribute("pokemon_id")) - 1];

	d3.select("#pick2").node().src = "./icons/" + element.getAttribute("pokemon_id") + ".png";
	d3.select("#pick2name").node().innerHTML = element.getAttribute("name");
	d3.select("#pick2type").node().innerHTML = element.getAttribute("pokemon_type") + " Gen. " + current_right_datum.Generation;
	d3.selectAll(".right").style("visibility", "visible");

	radarData[1] = [{
			axis: "HP",
			value: current_right_datum.HP / unitHP
		},
		{
			axis: "ATK",
			value: current_right_datum.Attack / unitAttack
		},
		{
			axis: "DEF",
			value: current_right_datum.Defense / unitDefense
		},
		{
			axis: "SP. ATK",
			value: current_right_datum.Sp_Atk / unitSPAttack
		},
		{
			axis: "SP. DEF",
			value: current_right_datum.Sp_Def / unitDefense
		},
		{
			axis: "SPEED",
			value: current_right_datum.Speed / unitSpeed
		}
	];

	draw_radar();
}

var RadarChart = {
	draw: function(id, d) {
		console.log(radarData);
		var cfg = {
			radius: 5,
			w: document.getElementById("chart").clientWidth * .66,
			h: document.getElementById("chart").clientHeight * .55,
			factor: 1,
			factorLegend: .85,
			levels: 5,
			maxValue: 5,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: document.getElementById("chart").clientWidth * .33 / 2,
			TranslateY: 50,
			ExtraWidthX: document.getElementById("chart").clientWidth * .33,
			ExtraWidthY: document.getElementById("chart").clientHeight * .45,
			color: function(i) {
				return i == 0 ? "red" : "blue";
			}
		};

		var allAxis = ["HP", "ATK", "DEF", "SP. ATK", "SP. DEF", "SPEED"]
		var total = allAxis.length;
		var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);

		d3.select(id).select("svg").remove();

		var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w + cfg.ExtraWidthX)
			.attr("height", cfg.h + cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

		for (var j = 0; j < cfg.levels; j++) {
			var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
			g.selectAll(".levels")
				.data(allAxis)
				.enter()
				.append("svg:line")
				.attr("x1", function(d, i) {
					return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
				})
				.attr("y1", function(d, i) {
					return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
				})
				.attr("x2", function(d, i) {
					return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
				})
				.attr("y2", function(d, i) {
					return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
				})
				.attr("class", "line")
				.style("stroke", "#25A391")
				.style("stroke-opacity", "1")
				.style("stroke-width", "3px")
				.attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
		}

		for (var j = 0; j < cfg.levels; j++) {
			var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
			g.selectAll(".levels")
				.data([1])
				.enter()
				.append("svg:text")
				.attr("x", function(d) {
					return levelFactor * (1 - cfg.factor * Math.sin(0));
				})
				.attr("y", function(d) {
					return levelFactor * (1 - cfg.factor * Math.cos(0));
				})
				.attr("class", "legend")
				.style("font-family", "sans-serif")
				.style("font-size", "14px")
				.attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
				.attr("fill", "gold")
				.text((j + 1) + "★");
		}

		var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

		axis.append("line")
			.attr("x1", cfg.w / 2)
			.attr("y1", cfg.h / 2)
			.attr("x2", function(d, i) {
				return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
			})
			.attr("y2", function(d, i) {
				return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
			})
			.attr("class", "line")
			.style("stroke", "tomato")
			.style("stroke-width", "2px");

		axis.append("text")
			.attr("class", "legend")
			.text(d => d)
			.style("font-family", "sans-serif")
			.style("font-style", "italic")
			.style("font-weight", "bolder")
			.style("font-size", "16px")
			.attr("fill", "white")
			.attr("text-anchor", "middle")
			.attr("dy", "1.5em")
			.attr("transform", "translate(0, -20)")
			.attr("x", function(d, i) {
				return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
			})
			.attr("y", function(d, i) {
				return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
			});

		d.forEach(function(y, x) {
			if (y.length == 0) return;
			dataValues = [];
			g.selectAll(".nodes")
				.data(y, function(j, i) {
					dataValues.push([
						cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
						cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
					]);
				});
			dataValues.push(dataValues[0]);
			g.selectAll(".area")
				.data([dataValues])
				.enter()
				.append("polygon")
				.attr("class", "radar-chart-serie")
				.style("stroke-width", "2px")
				.style("stroke", cfg.color(x))
				.attr("points", function(d) {
					var str = "";
					for (var pti = 0; pti < d.length; pti++) {
						str = str + d[pti][0] + "," + d[pti][1] + " ";
					}
					return str;
				})
				.style("fill", function(j, i) {
					return cfg.color(x)
				})
				.style("fill-opacity", cfg.opacityArea);
		});

		var tooltip = d3.select("#chart")
			.append('div')
			.attr('class', 'tooltip');

		d.forEach(function(y, x) {
			if (y.length == 0) return;
			g.selectAll(".nodes")
				.data(y)
				.enter()
				.append("svg:circle")
				.attr("class", "radar-chart-serie" + x)
				.attr('r', cfg.radius)
				.attr("cx", function(j, i) {
					return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
				})
				.attr("cy", function(j, i) {
					return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
				})
				.style("fill", "white")
				.style("stroke-width", "2px")
				.style("stroke", cfg.color(x))
				.style("fill-opacity", .7)
				.on('mouseover', function(j, i) {
					var v = 0;
					if (j.axis == "HP") {
						v = Math.round(j.value * unitHP);
					} else if (j.axis == "ATK") {
						v = Math.round(j.value * unitAttack);
					} else if (j.axis == "DEF") {
						v = Math.round(j.value * unitDefense);
					} else if (j.axis == "SP. ATK") {
						v = Math.round(j.value * unitSPAttack);
					} else if (j.axis == "SP. DEF") {
						v = Math.round(j.value * unitSPDefense);
					} else if (j.axis == "SPEED") {
						v = Math.round(j.value * unitSpeed);
					}

					tooltip.html(v);
					tooltip.style('display', 'block');
					tooltip.style('opacity', 1);

					var x = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
					var y = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));

					tooltip.style('top', (y + cfg.TranslateY + 10 + 28) + 'px')
						.style('left', (x + cfg.TranslateX + 10) + 'px');
				})
				.on('mouseout', function() {
					tooltip.style('display', 'none');
					tooltip.style('opacity', 0);
				})
		});
	}
};

function draw_radar() {
	RadarChart.draw("#chart", radarData);
}

function cancelfunc(i) {
	if (i == 0) {
		d3.selectAll(".left").style("visibility", "hidden");
		radarData[0] = [];
		previous_pick1.style.borderStyle = "solid";
		previous_pick1 = null;
		current_left_datum = null;
	} else {
		d3.selectAll(".right").style("visibility", "hidden");
		radarData[1] = [];
		previous_pick2.style.borderStyle = "solid";
		previous_pick2 = null;
		current_right_datum = null;
	}
	draw_radar();
}

function render_third_wrapper() {
	if (current_left_datum != null) {
		render_third(0);
	}
	if (current_right_datum != null) {
		render_third(1);
	}
}

function render_third(i) {
	var datum, target;
	if (i == 0) {
		datum = current_left_datum;
		target = d3.select("#canvas1");
	} else {
		datum = current_right_datum;
		target = d3.select("#canvas2");
	}
	target.select('svg').remove();
	var svg = target.append("svg")
		.attr("width", target.node().clientWidth)
		.attr("height", target.node().clientHeight);

	var maxRadius = target.node().clientWidth / 2 - 50;
	var n = parseInt(datum.Catch_Rate);
	var p_data = Array(Math.floor(n * 8)).fill(1);

	color = function(number) {
		return d3.interpolateInferno(number / 2040)
	}

	var pie = d3.pie()
		.value(d => d)
		.sort(null)
		.startAngle(0)
		.endAngle(n / 255 * 1.5 * Math.PI);

	var drawData = pie(p_data);

	var arc = d3.arc()
		.innerRadius(maxRadius - 20)
		.outerRadius(maxRadius);


	var restparent = svg.append("g");

	var pie2 = d3.pie()
		.value(d => d)
		.startAngle(0)
		.endAngle(1.5 * Math.PI);

	var drawData2 = pie2([1]);

	restparent.selectAll("path")
		.data(drawData2)
		.enter()
		.append("path")
		.attr("fill", "rgb(100,100,100)")
		.attr("d", d => arc(d));

	restparent.attr("transform", `translate(${target.node().clientWidth/2},${target.node().clientWidth/2})`);

	var pathParent = svg.append("g");

	pathParent.attr("transform", `translate(${target.node().clientWidth/2},${target.node().clientWidth/2})`);

	function tweenPie(b) {
		b.endAngle += .01;
		b.startAngle -= .01;
		var i = d3.interpolate({
			startAngle: 0,
			endAngle: 0
		}, b);
		return function(t) {
			return arc(i(t));
		};
	}

	pathParent.selectAll("path")
		.data(drawData)
		.enter()
		.append("path")
		.attr("fill", d => color(d.index))
		.transition()
		.delay(function(d, i) {
			return 100 + i;
		})
		.duration(1)
		.attrTween("d", tweenPie);

	svg.append("text")
		.attr("x", (target.node().clientWidth / 2))
		.attr("y", (target.node().clientHeight * .9))
		.attr("text-anchor", "middle")
		.style("font-family", "Arial, Courier, monospace")
		.style("font-weight", "bolder")
		.style("font-size", "48px")
		.attr("fill", "black")
		.text(datum.Name);

	svg.append('g')
		.selectAll("image")
		.data([1])
		.enter()
		.append("svg:image")
		.attr("xlink:href", "./icons/" + datum.Number + ".png")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", (target.node().clientWidth / 2))
		.attr("height", (target.node().clientWidth / 2))
		.style("display", "block");

	svg.append("text")
		.attr("x", (target.node().clientWidth / 2))
		.attr("y", (target.node().clientWidth / 2))
		.attr("text-anchor", "middle")
		.style("font-size", "48px")
		.style("font-family", 'Arial, Helvetica, sans-serif')
		.transition()
		.delay(100)
		.duration(n * 2 * 4)
		.tween("text", function() {
			var k = d3.select(this);
			i = d3.interpolateNumber(0, parseInt(n));
			return function(t) {
				k.text(Math.floor(i(t)));
				k.attr('fill', color(i(t) * 8));
			};
		});
}

var should_render = true;

$(document).ready(function() {
	$(document).scroll(function(evt) {
		var v2 = Math.abs($('.box3').position().top - $(window).height() / 2);
		var v1 = $(this).scrollTop();
		if (should_render && v1 > v2) {
			should_render = false
			render_third_wrapper();
			load_fourth();

		}
	});
});

$(document).ready(function() {
	$(document).scroll(function(evt) {
		var v2 = Math.abs($('.box3').position().top - $(window).height() / 2);
		var v1 = $(this).scrollTop();
		if (!should_render && v1 < v2) {
			should_render = true;
			d3.select("#canvas1").select('svg').remove();
			d3.select("#canvas2").select('svg').remove();

		}
	});
});

function load_fourth() {
	d3.select('#container-4-box').select('svg').remove();

	var type_picker = d3.select('#type_picker');
	type_picker.on("change", load_fourth);

	var data4 = [];
	var value_picker = d3.select("#value_picker");
	var value_type = d3.select("#value_picker").node().value;
	value_picker.on("change", load_fourth);

	if (value_type == 'Sp. Attack') {
		value_type = "Sp_Atk";
	} else if (value_type == 'Sp. Defense') {
		value_type = 'Sp_Def';
	}

	data.forEach(function(d, i) {
		if (d.Type_1 == type_picker.node().value && legendData[parseInt(d.Generation) - 1].enable) {
			data4.push(d);
		}
	});

	var y_max;
	var y_min;


	data4.sort(function(a, b) {
		return parseInt(b[value_type]) - parseInt(a[value_type]);
	});

	if (data4.length == 0) {
		y_max = 700;
		y_min = 0;
	} else {
		y_max = parseInt(data4[0][value_type]);
		y_min = parseInt(data4[data4.length - 1][value_type]);
	}
	if (current_right_datum != null) {
		y_max = Math.max(y_max, parseInt(current_right_datum[value_type]));
		y_min = Math.min(y_min, parseInt(current_right_datum[value_type]));
	}
	d3.select("#tooltip").remove();

	var tooltip = d3.select("#container-4-box")
		.append('div')
		.attr('class', 'tooltip');

	tooltip.append('div')
		.attr('class', 'imgholder');
	tooltip.append('div')
		.attr('class', 'name');
	tooltip.append('div')
		.attr('class', 'Gen');
	tooltip.append('div')
		.attr('class', 'HP');
	tooltip.append('div')
		.attr('class', 'Attack');
	tooltip.append('div')
		.attr('class', 'Defense');
	tooltip.append('div')
		.attr('class', 'Sp_Atk');
	tooltip.append('div')
		.attr('class', 'Sp_Def');
	tooltip.append('div')
		.attr('class', 'Speed');

	svg = d3.select('#container-4-box')
		.append('svg')
		.attr('id', "svg4")
		.attr("width", d3.select('#container-4-box').node().clientWidth)
		.attr("height", d3.select('#container-4-box').node().clientHeight);

	var width = d3.select('#container-4-box').node().clientWidth;
	var height = d3.select('#container-4-box').node().clientHeight;

	svg.append("text")
		.attr("x", (width / 2))
		.attr('y', "60")
		.style("text-anchor", "middle")
		.style('font-size', '48px')
		.style('font-weight', 'bolder')
		.style('font-style', 'italic')
		.text("What if ?");

	svg.append("text")
		.attr("x", (width / 2))
		.attr('y', "90")
		.style("text-anchor", "middle")
		.style('font-size', '24px')
		.text("Click the Pokemon Ball to Pick Another Pokemon for You");



	xScale = d3.scaleBand()
		.domain(data4.map(function(d) {
			return d.Name;
		}))
		.range([50, width - 100]); // value -> display

	yScale = d3.scaleLinear()
		.domain([y_max + 40, y_min - 40])
		.range([60, height - 60]); // value -> display


	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (height - 60) + ")")
		.call(d3.axisBottom(xScale))
		.selectAll('text')
		.attr("y", 9)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(50,0)")
		.call(d3.axisLeft(yScale).ticks(10));

	if (current_right_datum != null) {
		svg.append("g")
			.attr("transform", "translate(50, " + yScale(current_right_datum[value_type]) + ")")
			.append("line")
			.attr("x2", width - 150)
			.style("stroke", "#4491C3")
			.style("stroke-width", "3px");

		svg.append('text')
			.attr('x', width - 100)
			.attr('y', yScale(current_right_datum[value_type]) - 6)
			.style("text-anchor", "end")
			.text(function() {
				if (value_type == "Sp_Atk") {
					return 'Opponent Sp. Atk: ' + current_right_datum[value_type];
				} else if (value_type == "Sp_Def") {
					return 'Opponent Sp. Def: ' + current_right_datum[value_type];
				} else {
					return 'Opponent ' + value_type + ': ' + current_right_datum[value_type];
				}
			});
	}
	svg.append('g')
		.attr('class', 'dots')
		.selectAll('img')
		.data(data4)
		.enter()
		.append("svg:image")
		.attr("class", "pimage")
		.attr("xlink:href", "./resources/ball.png")
		.attr("x", function(d) {
			return xScale(d.Name);
		})
		.attr("y", function(d, i) {
			return yScale(d[value_type]);
		})
		.attr("width", function(d) {
			if (d.Name == current_left_datum.Name) {
				return "30";
			} else {
				return "20";
			}
		})
		.attr("height", function(d) {
			if (d.Name == current_left_datum.Name) {
				return "30";
			} else {
				return "20";
			}
		})
		.attr("transform", function(d) {
			if (d.Name == current_left_datum.Name) {
				return "translate(" + (xScale.bandwidth() / 2 - 15) + "-15)";
			} else {
				return "translate(" + (xScale.bandwidth() / 2 - 10) + ",-10)";
			}
		})
		.style("display", 'block')
		.on('mouseover', (d) => {
			tooltip.style('color', 'black');
			tooltip.select('.imgholder').html("<img src=./icons/" + d.Number + '.png>')
			tooltip.select('.name').html(d.Name);
			tooltip.select('.Gen').html("Gen. " + d.Generation);
			tooltip.select('.HP').html("HP: " + d.HP);
			tooltip.select(".Attack").html("Attack: " + d.Attack);
			tooltip.select('.Defense').html("Defense: " + d.Defense);
			tooltip.select(".Sp_Atk").html("Sp. Atk: " + d.Sp_Atk);
			tooltip.select('.Sp_Def').html("Sp. Def: " + d.Sp_Def);
			tooltip.select(".Speed").html("Speed: " + d.Speed);
			tooltip.style('display', 'block');
			tooltip.style('opacity', 1);
		})
		.on('mousemove', function(d) {
			var x = xScale(d.Name) + xScale.bandwidth() / 2;
			var y = yScale(d[value_type])

			tooltip.style('top', y + 'px')
				.style('left', x + 'px');
		})
		.on('mouseout', function() {
			tooltip.style('display', 'none');
			tooltip.style('opacity', 0);
		})
		.on('click', function(d) {
			pick1(pokemon_left[parseInt(d.Number) - 1].children[0])

			clearfunc(0);
			pokemon_left[parseInt(d.Number) - 1].scrollIntoView(true);
			window.scrollTo({
				top: 1100,
				behavior: "smooth"
			});
		});

	if (data4.includes(current_left_datum)) {
		svg.append('text')
			.attr('x', xScale(current_left_datum['Name']))
			.attr('y', yScale(current_left_datum[value_type]))
			.attr("transform", "translate(" + (xScale.bandwidth() / 2) + "-25)")
			.text("YOU")
			.style("font-weight", "bolder")
			.attr("text-anchor", "middle")
			.attr('fill', "red");
	}
	var legendRectSize = 18;
	var legendSpacing = 8;
	var legend = svg.selectAll('.legend')
		.data(legendData)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', function(d, i) {
			var legend_height = legendRectSize + legendSpacing;
			var offset = 16;
			var horz = width - 100;
			var vert = i * legend_height + offset;
			return 'translate(' + horz + ',' + vert + ')';
		});

	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', (entry, i) => {
			if (entry.enable) {
				return "orange";
			} else {
				return "transparent";
			}
		})
		.attr("stroke-width", 2)
		.style('stroke', "orange")
		.on('click', function(entry, i) {
			var rect = d3.select(this);
			entry.enable = !(entry.enable);

			if (entry.enable) {
				rect.style('fill', color(i));
			} else {
				rect.style('fill', "transparent");
			}

			load_fourth();
		});

	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing + 4)
		.text(function(d) {
			return "Gen. " + d.Gen;
		});

	svg.append("text")
		//.attr("transform", "rotate(-90)")
		.attr("y", height - 20)
		.attr("x", width / 2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Pokemons");

	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 5)
		.attr("x", -height / 2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(function() {
			if (value_type == "Sp_Atk") {
				return 'Sp. Atk';
			} else if (value_type == "Sp_Def") {
				return 'Sp. Def';
			} else {
				return value_type;
			}
		});
}

function scrollToTab(k) {
	if (k == 4) {
		window.scrollTo({
			top: 350,
			behavior: "smooth"
		});
	} else if (k == 0) {
		window.scrollTo({
			top: 1100,
			behavior: "smooth"
		});
	} else if (k == 1) {
		document.getElementById('container-3').scrollIntoView();
	} else {
		document.getElementById('container-4').scrollIntoView();
	}
}
