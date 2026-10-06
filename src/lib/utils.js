const compareAnimals = (a, b) =>
  b.votes - a.votes || a.name.localeCompare(b.name);
const getAnimalCategories = (animals) => {
  return [...new Set(animals.map((animal) => animal.animalCategory))].sort();
};
const getHabitatTypes = (animals) => {
  return [...new Set(animals.map((animal) => animal.habitatType))].sort();
};
const getDlcs = (animals) => {
  return [...new Set(animals.map((animal) => animal.dlc))];
};
const removeAnimalsWithNoVotes = (animals) => {
  return animals.filter((animal) => animal.votes > 0);
};
const calculateTotalVotes = (animals) => {
  return animals.reduce((acc, animal) => acc + animal.votes, 0);
};
const calculateRelativeRank = (animals, prevAnimals) => {
  prevAnimals.forEach((animal, index) => {
    animal.relativeRank = index + 1;
  });
  animals.forEach((animal, index) => {
    animal.relativeRank = index + 1;
    const prevAnimal = prevAnimals.find(
      (prevAnimal) => prevAnimal.name === animal.name,
    );
    if (prevAnimal.votes == 0) {
      animal.relativeRankDifference = undefined;
    } else {
      animal.relativeRankDifference =
        prevAnimal?.relativeRank - animal.relativeRank;
    }
  });
  return animals;
};
const filterAnimalsSearch = (
  searchValue,
  animalsFiltered,
  prevAnimalsFiltered,
) => {
  if (searchValue != "" && searchValue != undefined) {
    animalsFiltered = animalsFiltered.filter(
      (animal) =>
        animal.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        animal.habitatType.toLowerCase().includes(searchValue.toLowerCase()) ||
        animal.animalCategory.toLowerCase().includes(searchValue.toLowerCase()),
    );

    prevAnimalsFiltered = prevAnimalsFiltered.filter(
      (animal) =>
        animal.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        animal.habitatType.toLowerCase().includes(searchValue.toLowerCase()) ||
        animal.animalCategory.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  return { animalsFiltered, prevAnimalsFiltered };
};
const filterAnimalsReturning = (
  returningFilter,
  animalsFiltered,
  prevAnimalsFiltered,
) => {
  if (returningFilter != undefined) {
    if (returningFilter == "RET") {
      animalsFiltered = animalsFiltered.filter((animal) => animal.isReturning);
      prevAnimalsFiltered = prevAnimalsFiltered.filter(
        (animal) => animal.isReturning,
      );
    } else if (returningFilter == "NEW") {
      animalsFiltered = animalsFiltered.filter((animal) => !animal.isReturning);
      prevAnimalsFiltered = prevAnimalsFiltered.filter(
        (animal) => !animal.isReturning,
      );
    }
  }
  return { animalsFiltered, prevAnimalsFiltered };
};
const filterHabitatTypes = (
  habitatTypeFilter,
  animalsFiltered,
  prevAnimalsFiltered,
) => {
  if (habitatTypeFilter != undefined) {
    animalsFiltered = animalsFiltered.filter((animal) =>
      animal.habitatType
        .toLowerCase()
        .includes(habitatTypeFilter.toLowerCase()),
    );
    prevAnimalsFiltered = prevAnimalsFiltered.filter((animal) =>
      animal.habitatType
        .toLowerCase()
        .includes(habitatTypeFilter.toLowerCase()),
    );
  }
  return { animalsFiltered, prevAnimalsFiltered };
};
const filterAnimalCategories = (
  animalCategoryFilter,
  animalsFiltered,
  prevAnimalsFiltered,
) => {
  if (animalCategoryFilter != undefined) {
    animalsFiltered = animalsFiltered.filter((animal) =>
      animal.animalCategory
        .toLowerCase()
        .includes(animalCategoryFilter.toLowerCase()),
    );
    prevAnimalsFiltered = prevAnimalsFiltered.filter((animal) =>
      animal.animalCategory
        .toLowerCase()
        .includes(animalCategoryFilter.toLowerCase()),
    );
  }
  return { animalsFiltered, prevAnimalsFiltered };
};
const sortAnimals = (sortValue, animalsFiltered) => {
  if (sortValue != undefined) {
    const newAnimals = animalsFiltered.filter((animal) =>
      isNaN(animal.rankDifference),
    );
    if (sortValue === "GAIN-DESC" || sortValue === "GAIN-ASC") {
      animalsFiltered = animalsFiltered.filter(
        (animal) => !isNaN(animal.rankDifference),
      );
    }
    animalsFiltered = animalsFiltered.sort((a, b) => {
      if (sortValue === "VOTES-DESC")
        return b.votes - a.votes || a.name.localeCompare(b.name);
      if (sortValue === "VOTES-ASC")
        return a.votes - b.votes || b.name.localeCompare(a.name);
      if (sortValue === "NAMES-DESC") return b.name.localeCompare(a.name);
      if (sortValue === "NAMES-ASC") return a.name.localeCompare(b.name);
      if (sortValue === "GAIN-DESC")
        return (
          b.rankDifference - a.rankDifference || a.name.localeCompare(b.name)
        );
      if (sortValue === "GAIN-ASC")
        return (
          a.rankDifference - b.rankDifference || b.name.localeCompare(a.name)
        );
      return 0;
    });
    if (sortValue === "GAIN-DESC" || sortValue === "GAIN-ASC") {
      animalsFiltered = [...animalsFiltered, ...newAnimals];
    }
  }
  return animalsFiltered;
};

export {
  compareAnimals,
  getAnimalCategories,
  getHabitatTypes,
  getDlcs,
  removeAnimalsWithNoVotes,
  calculateTotalVotes,
  calculateRelativeRank,
  filterAnimalsSearch,
  filterAnimalsReturning,
  filterHabitatTypes,
  filterAnimalCategories,
  sortAnimals,
};
