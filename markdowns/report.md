# Pokemon Battle Planner 

#### Jacob Lin

### Introduction

​	My system is a Pokemon battle planner. Here you can pick your opponent Pokemon, and try to figure out which Pokémon you would like to use in the battle and evaluate their potential performance. Rather than focusing on each of Pokemon in the dataset, my system focuses on a one-to-one match-up among Pokemons. Although all the views are built around a pair of Pokemons (your Pokemon and your opponent's Pokemon), they will also work if you just pick your Pokemon and leave your opponent's Pokemon blank. 

   	1. The first view is an overview of Pokemon types and generations. Viewers can see tiles representing each type and each generation. Since the data is sorted, viewers can get a sense of the ratio between different types and generation. Clicking a tile will bring the window to the second view to start a battle within that type and generation. Here each type is assigned a color related to its meaning, for example, tiles of poison type is in purple color. These colors will be the border color in the second view in the Pokemon picking widget.
   	2. The second view is an overview allows you to pick a Pokemon for you and your opponent, and evaluate their six core properties -- HP, Attack, Defense, Sp. Attack, Sp. Defense and Speed. In the search bar, viewers can type name, type or generation of the pokemon. Pokemons' properties are simplified from actual values to a rank system in the radar chart where, for example, Pokemons with highest HP have a rank of 5★ and those with lowest HP have a rank of 1★, and same for other Pokemon properties. Through the polygon area in the radar chart, viewers can compare the overall abilities compared to their opponents. If viewers want to see the actual ability numbers, they can move their mouse over small white dots and a tooltip will show up indicating the actual numbers.
   	3. The third view is a linked view showing the grab rate of your Pokemon and your opponent's Pokemon. A strong Pokemon against your opponent does not mean you have it. Therefore, viewers have to make a balance decision between a Pokemon's ability and its grab rate. The grab rate is shown via a pie(arc) chart with gradient colors.  The length of the arc showing a gauge of its grab rate, and a dark grey arc at the background showing the maximum grab rate among Pokemons in this dataset.
   	4. The fourth view is a detailed view to see if there are any alternatives. Viewers are able to pick which type and which property of Pokemons they would like to see. The default type is the type of your Pokemon so that where your Pokemon stands in his type class. I use the Pokemon ball image for the points in the scatter plot to match up with the topic. Hovering mouse over the Pokemon balls, viewers can see detailed information about that Pokemon. If the user wants to pick that Pokemon for himself, he can just click the Pokemon ball and the view window will return to the second view. It also serves as a tool to see how many Pokemons are in each type and in each generation by the numbers of Pokemon balls in the graph

### Insights

1. In the first view, we can see the Pokemon distribution between different types and generations.
2. In the fourth view, viewers can see how all Pokemons of a particular type or a specific generation perform against another Pokemon on each of the property listed, and where a Pokemon stands among the same type of Pokemons in fighting against the other Pokemon. The data in this view is sorted from high to low so it's easy to see which Pokemon has the highest score in that property and which one has the lowest.
3. In the second view via the radar chart, viewers can get a sense of the overall abilities by the area of the polygon.

### Student Evaluation

1. The picking glossary is too small that only 10 Pokemons can be shown in it.
2. The third view stands alone outside the system and lacks interaction.
3. The search bar is very useful in searching a Pokemon among over seven hundred of them.

### Extra Credit

1. I programmed a crawler to download all pictures of Pokemons rather then pure text data.
2. There is a search bar in the second view allows viewers to search Pokemons by their name, type and generation, or a combination of type and generation. Pokemons with different type have borders in different color. 
3. Random Pokemon Picker.
4. A navigation bar always sticks on the top of the window if viewers would like to skip to the view.
5. An extra view for the grab rate using gradient color with animation. The animation does not start until the visualization is scrolled into view. 
6. Clicking Pokemon Balls in the fourth view brings the system back to the second view, so that the whole system is iterative.
7. The whole system can be used to analyze either a single Pokemon or a battle between two Pokemons.

