<template>
<div>
    <Filters
        v-model="activeFilters"
        :animalCategories="animalCategories"
        :habitatTypes="habitatTypes"
        :dlcs="dlcs"
    />
    <SearchBarGroup>
        <SearchBar v-model="searchInput" />
        <PageControls
            v-model:currentPage="currentPage"
            v-model:animalCount="animalCount"
            v-model:pageSize="pageSize"
        />
    </SearchBarGroup>
    <MetadataContainer
        v-model:animalCount="animalCount"
        v-model:totalVotes="totalVotes"
    />
     <ErrorMessage :message="errorMessage" />
     <ul class="animal-list" v-if="totalAnimalCount > 0">
        <AnimalItemGame
            v-for="animal in filteredAnimals"
            v-model:active-filters="activeFilters"
            :animal="animal"
            :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')})` }"
        />
    </ul>

    <PageControls
        v-model:currentPage="currentPage"
        v-model:animalCount="animalCount"
        v-model:pageSize="pageSize"
    />
</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Filters from "./Filters.vue";
import SearchBar from "./SearchBar.vue";
import PageControls from "./PageControls.vue";
import MetadataContainer from "./MetadataContainer.vue";
import AnimalItemGame from "./AnimalItemGame.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SearchBarGroup from "./SearchBarGroup.vue";
import { compareAnimals, getAnimalCategories, getHabitatTypes, getDlcs, removeAnimalsWithNoVotes, calculateTotalVotes, filterAnimalsSearch, filterAnimalsReturning, filterHabitatTypes, filterAnimalCategories, sortAnimals } from "../lib/utils.js";
import animals from "../assets/animals-in-game.json"

const searchInput = ref("");
const pageSize = ref(100);
const currentPage = ref(1);
const errorMessage = ref("")
const totalVotes = ref(0);
const animalCategories = ref([])
const dlcs = ref([]);
const animalCount = ref(0)
const totalAnimalCount = ref(0)
const habitatTypes = ref([])
const activeFilters = ref({
    sortDropdown: "VOTES-DESC",
    animalPositionDropdown: "ABS",
    habitatTypeFilters: "",
    animalCategoryFilters: "",
    returningAnimalsFilter: "ALL",
    dlcPackFilter: "",
});

onMounted(async () => {
  try {
    dlcs.value = getDlcs(animals);
    animalCategories.value = getAnimalCategories(animals);
    habitatTypes.value = getHabitatTypes(animals);
    animals.sort(compareAnimals);
    totalAnimalCount.value = animals.length;
    totalVotes.value = calculateTotalVotes(animals);
  } catch (err) {
    console.error('Failed to load animal data:', err);
    errorMessage.value = 'Failed to load animal data.';
  }
});
const calculateRelativeRank = (animals) => {
  animals.forEach((animal, index) => {
    animal.relativeRank = index + 1;
  });
  return animals
}

const filteredAnimals = computed(() => {
  let animalsFiltered = animals.filter(animal => animal.votes > 0);

  if (searchInput.value != "" && searchInput.value != undefined) {
    animalsFiltered = animals.filter(animal => animal.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.habitatType.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.animalCategory.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.dlc.toLowerCase().includes(searchInput.value.toLowerCase())
    )
  }
  if (activeFilters.value.returningAnimalsFilter != undefined)
  {
    if (activeFilters.value.returningAnimalsFilter == "RET")
    {
      animalsFiltered = animalsFiltered.filter(animal => animal.isReturning)
    }
    else if (activeFilters.value.returningAnimalsFilter == "NEW")
    {
      animalsFiltered = animalsFiltered.filter(animal => !animal.isReturning)
    }
  }

  if (activeFilters.value.habitatTypeFilters != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.habitatType.toLowerCase().includes(activeFilters.value.habitatTypeFilters.toLowerCase()))
  }
  if (activeFilters.value.animalCategoryFilters != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.animalCategory.toLowerCase().includes(activeFilters.value.animalCategoryFilters.toLowerCase()))
  }
  if (activeFilters.value.dlcPackFilter != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.dlc.toLowerCase().includes(activeFilters.value.dlcPackFilter.toLowerCase()))
  }
  if (activeFilters.value.sortDropdown != undefined)
  {
    animalsFiltered = animalsFiltered.sort((a, b) => {
      if (activeFilters.value.sortDropdown === "VOTES-DESC") return b.votes - a.votes || a.name.localeCompare(b.name)
      if (activeFilters.value.sortDropdown === "VOTES-ASC") return a.votes - b.votes || b.name.localeCompare(a.name)
      if (activeFilters.value.sortDropdown === "NAMES-DESC") return b.name.localeCompare(a.name)
      if (activeFilters.value.sortDropdown === "NAMES-ASC") return a.name.localeCompare(b.name)
      return 0
    })
  }
  animalCount.value = animalsFiltered.length;
  animalsFiltered = calculateRelativeRank(animalsFiltered)
  animalsFiltered = animalsFiltered.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value,
  );
  return animalsFiltered;
})
</script>
<style>
.animal-list {
    padding: var(--spacing-05) 0;
    list-style: none;
    display: grid;
    gap: var(--spacing-04);
}
</style>
