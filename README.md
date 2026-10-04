# Planet Zoo 2 Species Wishlist

This is a website where you can see what animal species are most requested by the community (all data sourced from the official Frontier Unlocked discord server.)




## Data structure
### Types:

- string: this is regular text, this has to be between double quotes (like this: "name": "this is a name")
-  boolean: this has only 2 possible values: true or false, without any quotes (eg. "isReturning": true)
- number: this is a regular number, do not use any quotes (eg. "votes": 15)

``animals.json ``
```
 {
    "name": "Variable bushy feather star",
    "votes": 0,
    "habitatType": "Exhibit",
    "animalCategory": "Invertebrates",
    "isReturning": false
  },

```
**name**: This is the name of the animal (string)

**votes**: This is the amount of votes this animal currently has

**habitatType**: This is the habitat type the animal has in game (string: Terrestrial | Aquarium | Aviary | Exhibit)

**animalCategory**: This is the category of the animal (string: Mammals | Fish | Birds | Reptiles | Amphibians | Invertebrates)

**isReturning**: This is a true/false field whether the animals was in PZ1 or not, true if it was in PZ1, false if it is new to the Planet Zoo series (boolean: true/false)


``animals-in-game.json``
```
  {
    "name": "",
    "votes": 0,
    "habitatType": "",
    "animalCategory": "",
    "isReturning": true,
    "lastRank": 0,
    "dlc": ""
  }
```
**name**: This is the name of the animal (string)

**votes**: this is the amount of votes the animal had before being added to Planet Zoo 2 (number)

**habitatType**: This is the habitat type the animal has in game (string: Terrestrial | Aquarium | Aviary | Exhibit)

**animalCategory**: This is the category of the animal (string: Mammals | Fish | Birds | Reptiles | Amphibians | Invertebrates)

**isReturning**: This is a true/false field whether the animals was in PZ1 or not, true if it was in PZ1, false if it is new to the Planet Zoo series (boolean: true/false)

**lastRank**: This is the last rank it had before it was added to the game (number)

**dlc**: This is the name of the DLC the animal was added in. (string)



## How to add a new animal
The easiest way to add a new animal is to copy an existing animal (so everything between {}  that is the animal object), you can then paste it after or before any other animal, the order doesn't matter. What does matter is that every animal needs to be between the [] (the [ is in the beginning of the file and the ] us at the end) and between every animal object there is a **,**

After you have copy and pasted the animal object you can change the values (eg give it a correct name, animalCategory, habitatType etc.). Then the only thing remaining is to find a good image of that animal and give it the same name as you did in the  ``name`` field of the animal object.

## Animal Naming conventions
There is only 1 hard rule for the animal names, the name has to be the same as the image of that animal (because the code gets the image by using the name). The consequence that has is that you can only use characters that are valid in filenames in the animal names, eg. no / & etc.
