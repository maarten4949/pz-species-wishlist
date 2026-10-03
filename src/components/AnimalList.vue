<template>
<div>
    <Filters v-model="activeFilters" :animalCategories="animalCategories" :habitatTypes="habitatTypes" />
    <div class="group">
        <SearchBar v-model="searchInput"/>
        <PageControls v-model:currentPage="currentPage" v-model:animalCount="animalCount" v-model:pageSize="pageSize" />
    </div>
    <MetadataContainer v-model:animalCount="animalCount" v-model:totalVotes="totalVotes" />
    <div class="error-message">{{errorMessage}}</div>
    <ul class= "animal-list" v-if="animalsWithVotes.length > 0">
        <AnimalItem v-for="animal in filteredAnimals" v-model:active-filters="activeFilters" :animal="animal" :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')})` }" />
    </ul>
    <div class="no-votes-message" v-else>
    <h2>Voting is not yet open,<br/> check back on October 13, when Planet Zoo 2 launches
        <!-- <a href="link">the offical discord thread</a> -->
    </h2>
    </div>
     <PageControls v-model:currentPage="currentPage" v-model:animalCount="animalCount" v-model:pageSize="pageSize" />
</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Filters from './Filters.vue';
import SearchBar from './SearchBar.vue';
import PageControls from './PageControls.vue';
import MetadataContainer from './MetadataContainer.vue';
import AnimalItem from './AnimalItem.vue';

import animals from "../assets/animals.json"
import prevanimals from "../assets/prev-animals.json"

const animalsWithVotes = ref(animals);
const currentPage = ref(1);
const errorMessage = ref("")
const totalVotes = ref(0);
const pageSize = ref(100);
const animalCategories = ref([])
const animalCount = ref(0)
const totalAnimalCount = ref(0)
const habitatTypes = ref([])
const activeFilters = ref({
  sortDropdown: "VOTES-DESC",
  animalPositionDropdown: "ABS",
  habitatTypeFilters: "",
  animalCategoryFilters: "",
  returningAnimalsFilter: "ALL",
});
const searchInput = ref("")

onMounted(async () => {
  try {
    animalsWithVotes.value = animals.filter(animal => animal.votes > 0);
    animalCategories.value = [...new Set(animals.map(animal => animal.animalCategory))]
    habitatTypes.value = [...new Set(animals.map(animal => animal.habitatType))]
    const compareAnimals = (a, b) => b.votes - a.votes || a.name.localeCompare(b.name);
    prevanimals.sort(compareAnimals);
    prevanimals.forEach((animal, index) => {
      animal.rank = index + 1;
    });
    animals.sort(compareAnimals);
    animals.forEach((animal, index) => {
      animal.rank = index + 1;
      animal.rankDifference = prevanimals.find(prevAnimal => prevAnimal.name === animal.name)?.rank - animal.rank;
    });
    totalAnimalCount.value = animals.length;

    totalVotes.value = animals.reduce((acc, animal) => acc + animal.votes, 0);
  } catch (err) {
    console.error('Failed to load animal data:', err);
    errorMessage.value = 'Failed to load animal data.';
  }
});
const calculateRelativeRank = (animals, prevAnimals) => {
  prevAnimals.forEach((animal, index) => {
    animal.relativeRank = index + 1;
  });
  animals.forEach((animal, index) => {
    animal.relativeRank = index + 1;
    animal.relativeRankDifference = prevAnimals.find(prevAnimal => prevAnimal.name === animal.name)?.relativeRank - animal.relativeRank;
  });
  return animals
}

const filteredAnimals = computed(() => {
  let animalsFiltered = animals.filter(animal => animal.votes > 0);
  let prevAnimalsFiltered = prevanimals;
  if (searchInput.value != "" && searchInput.value != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.habitatType.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.animalCategory.toLowerCase().includes(searchInput.value.toLowerCase()))

    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.habitatType.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.animalCategory.toLowerCase().includes(searchInput.value.toLowerCase()))
  }
  if (activeFilters.value.returningAnimalsFilter != undefined)
  {
    if (activeFilters.value.returningAnimalsFilter == "RET")
    {
      animalsFiltered = animalsFiltered.filter(animal => animal.isReturning)
      prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.isReturning)
    }
    else if (activeFilters.value.returningAnimalsFilter == "NEW")
    {
      animalsFiltered = animalsFiltered.filter(animal => !animal.isReturning)
      prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => !animal.isReturning)
    }
  }
  if (activeFilters.value.habitatTypeFilters != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.habitatType.toLowerCase().includes(activeFilters.value.habitatTypeFilters.toLowerCase()))
    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.habitatType.toLowerCase().includes(activeFilters.value.habitatTypeFilters.toLowerCase()))
  }
  if (activeFilters.value.animalCategoryFilters != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.animalCategory.toLowerCase().includes(activeFilters.value.animalCategoryFilters.toLowerCase()))
    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.animalCategory.toLowerCase().includes(activeFilters.value.animalCategoryFilters.toLowerCase()))
  }

  if (activeFilters.value.sortDropdown != undefined)
  {
    const newAnimals = animalsFiltered.filter(animal => isNaN(animal.rankDifference))
    if (activeFilters.value.sortDropdown === "GAIN-DESC" || activeFilters.value.sortDropdown === "GAIN-ASC")
    {
      animalsFiltered = animalsFiltered.filter(animal  => !isNaN(animal.rankDifference))
    }
    animalsFiltered = animalsFiltered.sort((a, b) => {
      if (activeFilters.value.sortDropdown === "VOTES-DESC") return b.votes - a.votes || a.name.localeCompare(b.name)
      if (activeFilters.value.sortDropdown === "VOTES-ASC") return a.votes - b.votes || b.name.localeCompare(a.name)
      if (activeFilters.value.sortDropdown === "NAMES-DESC") return b.name.localeCompare(a.name)
      if (activeFilters.value.sortDropdown === "NAMES-ASC") return a.name.localeCompare(b.name)
      if (activeFilters.value.sortDropdown === "GAIN-DESC") return b.rankDifference - a.rankDifference || a.name.localeCompare(b.name)
      if (activeFilters.value.sortDropdown === "GAIN-ASC") return a.rankDifference - b.rankDifference || b.name.localeCompare(a.name)
      return 0
    })
    if (activeFilters.value.sortDropdown === "GAIN-DESC" || activeFilters.value.sortDropdown === "GAIN-ASC")
    {
      animalsFiltered = [...animalsFiltered, ...newAnimals]
    }
  }
  animalCount.value = animalsFiltered.length;
  animalsFiltered = calculateRelativeRank(animalsFiltered, prevAnimalsFiltered)
  animalsFiltered = animalsFiltered.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
  return animalsFiltered;
})

</script>
<style>
.group
{
    margin-top: var(--spacing-04);
    margin-bottom: var(--spacing-02);
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: var(--spacing-05);
    & .page-controls {
        width: fit-content;
    }
    & .big {
        font-size: var(--type-04);
        padding: var(--spacing-04) var(--spacing-05);
    }
}
.animal-list {
    padding: var(--spacing-05) 0;
    list-style: none;
    display:grid;
    gap: var(--spacing-04);
}
.no-votes-message {
    text-align: center;
    height: 100%;
    vertical-align: middle;
    margin-block: var(--spacing-10);
}
</style>
