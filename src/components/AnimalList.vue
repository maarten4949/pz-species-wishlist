<template>
    <div>
        <Filters
            v-model="activeFilters"
            :animalCategories="animalCategories"
            :habitatTypes="habitatTypes"
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
        <ul class="animal-list" v-if="animalsWithVotes.length > 0">
            <AnimalItem
                v-for="animal in filteredAnimals"
                v-model:active-filters="activeFilters"
                :animal="animal"
                :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')})` }"
            />
        </ul>
        <Message text="Voting is not yet open, check back on October 13, when Planet Zoo 2 launches" v-else />

        <PageControls
            v-model:currentPage="currentPage"
            v-model:animalCount="animalCount"
            v-model:pageSize="pageSize"
        />
    </div>
</template>
<script setup>
// imports
  import { ref, computed, onMounted } from "vue";
  import Filters from "./Filters.vue";
  import SearchBar from "./SearchBar.vue";
  import PageControls from "./PageControls.vue";
  import MetadataContainer from "./MetadataContainer.vue";
  import AnimalItem from "./AnimalItem.vue";
  import Message from "./Message.vue";
  import ErrorMessage from "./ErrorMessage.vue";
  import SearchBarGroup from "./SearchBarGroup.vue";
  import { compareAnimals, getAnimalCategories, getHabitatTypes, removeAnimalsWithNoVotes, calculateTotalVotes, calculateRelativeRank, filterAnimalsSearch, filterAnimalsReturning, filterHabitatTypes, filterAnimalCategories, sortAnimals } from "../lib/utils.js";
  import animals from "../assets/animals.json";
  import prevanimals from "../assets/prev-animals.json";


// variable definition
  const searchInput = ref("");
  const animalsWithVotes = ref(animals);
  const currentPage = ref(1);
  const errorMessage = ref("");
  const totalVotes = ref(0);
  const pageSize = ref(100);
  const animalCategories = ref([]);
  const animalCount = ref(0);
  const totalAnimalCount = ref(0);
  const habitatTypes = ref([]);
  const activeFilters = ref({
      sortDropdown: "VOTES-DESC",
      animalPositionDropdown: "ABS",
      habitatTypeFilters: "",
      animalCategoryFilters: "",
      returningAnimalsFilter: "ALL",
  });

onMounted(async () => {
    try {
        animalsWithVotes.value = removeAnimalsWithNoVotes(animals);
        animalCategories.value = getAnimalCategories(animals);
        habitatTypes.value = getHabitatTypes(animals);

        prevanimals.sort(compareAnimals);
        prevanimals.forEach((animal, index) => {
            animal.rank = index + 1;
        });

        animals.sort(compareAnimals);
        animals.forEach((animal, index) => {
            animal.rank = index + 1;
            animal.rankDifference =
                prevanimals.find(
                    (prevAnimal) => prevAnimal.name === animal.name,
                )?.rank - animal.rank;
        });

        totalAnimalCount.value = animals.length;
        totalVotes.value = calculateTotalVotes(animals);
    } catch (err) {
        console.error("Failed to load animal data:", err);
        errorMessage.value = "Failed to load animal data.";
    }
});

const filteredAnimals = computed(() => {
    let animalsFiltered = removeAnimalsWithNoVotes(animals);
    let prevAnimalsFiltered = prevanimals;

    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalsSearch(searchInput.value, animalsFiltered, prevAnimalsFiltered));
    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalsReturning(activeFilters.value.returningAnimalsFilter, animalsFiltered, prevAnimalsFiltered));
    ({ animalsFiltered, prevAnimalsFiltered } = filterHabitatTypes(activeFilters.value.habitatTypeFilters, animalsFiltered, prevAnimalsFiltered));
    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalCategories(activeFilters.value.animalCategoryFilters, animalsFiltered, prevAnimalsFiltered));
    animalsFiltered = sortAnimals(activeFilters.value.sortDropdown, animalsFiltered, prevAnimalsFiltered);


    animalCount.value = animalsFiltered.length;
    animalsFiltered = calculateRelativeRank(
        animalsFiltered,
        prevAnimalsFiltered,
    );
    animalsFiltered = animalsFiltered.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value,
    );
    return animalsFiltered;
});
</script>
<style>

.animal-list {
    padding: var(--spacing-05) 0;
    list-style: none;
    display: grid;
    gap: var(--spacing-04);
}
</style>
