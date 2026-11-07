<template>
    <div>
        <Filters
            v-model="activeFilters"
            :animalCategories="animalCategories"
            :habitatTypes="habitatTypes"
        />
        <SearchBarGroup>
            <SearchBar v-model="searchInput" v-on:search="resetCurrentPage" />
            <PageControls
                v-model:currentPage="currentPage"
                v-model:animalCount="animalCount"
                v-model:pageSize="pageSize"
            />
        </SearchBarGroup>
        <MetadataContainer
            v-model:animalCount="animalCount"
            v-model:totalVotes="totalVotes"
            :totalPeople="totalPeople"
        />
        <ErrorMessage :message="errorMessage" />
        <ul class="animal-list" v-if="animalsWithVotes.length > 0">
            <AnimalItem
                v-for="animal in filteredAnimals"
                :key="animal.name"
                v-model:activeFilters="activeFilters"
                :animal="animal"
                :totalPeople="totalPeople"
                :prevTotalPeople="prevTotalPeople"
                :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')})` }"
            />
        </ul>
        <Message
            title="Voting is now open!"
            text="You can submit your own wishlist in the PZ2 Metawishlist thread on the "
            link="https://discord.com/channels/1233371459993469028/1559232288410042551"
            linkText="Frontier Unlocked Discord server"
            v-else
        />
        <PageControls
            v-model:currentPage="currentPage"
            v-model:animalCount="animalCount"
            v-model:pageSize="pageSize"
        />
    </div>
</template>
<script setup>
// imports
import { ref, computed } from "vue";
import Filters from "./Filters.vue";
import SearchBar from "./SearchBar.vue";
import PageControls from "./PageControls.vue";
import MetadataContainer from "./MetadataContainer.vue";
import AnimalItem from "./AnimalItem.vue";
import Message from "./Message.vue";
import ErrorMessage from "./ErrorMessage.vue";
import SearchBarGroup from "./SearchBarGroup.vue";
import {
    compareAnimals,
    getAnimalCategories,
    getHabitatTypes,
    removeAnimalsWithNoVotes,
    calculateTotalVotes,
    calculateRelativeRank,
    filterAnimalsSearch,
    filterAnimalsReturning,
    filterHabitatTypes,
    filterAnimalCategories,
    sortAnimals,
} from "../lib/utils.js";
import animalsJson from "../assets/animals.json";
import prevAnimalsJson from "../assets/prev-animals.json";
import prevPrevAnimalsJson from "../assets/prev-prev-animals.json";
// variable definition
const totalPeople = 190;
const prevTotalPeople = 174;
const prevPrevTotalPeople = 132;
const animals = ref(structuredClone(animalsJson));
const prevanimals = ref(structuredClone(prevAnimalsJson));
const prevPrevAnimals = ref(structuredClone(prevPrevAnimalsJson));
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
    isPercentage: "NUM",
});

try {
    animalsWithVotes.value = removeAnimalsWithNoVotes(animals.value);
    animalCategories.value = getAnimalCategories(animals.value);
    habitatTypes.value = getHabitatTypes(animals.value);
    prevPrevAnimals.value.sort(compareAnimals);
    prevPrevAnimals.value.forEach((animal, index) => {
        animal.rank = index + 1;
    });

    prevanimals.value.sort(compareAnimals);
    prevanimals.value.forEach((animal, index) => {
      animal.rank = index + 1;
      const prevPrevAnimalLookup = prevPrevAnimals.value.find(
          (prevPrevAnimal) => prevPrevAnimal.name === animal.name,
      );
      if (prevPrevAnimalLookup?.votes == 0) {
          animal.rankDifference = undefined;
          animal.voteDifference = undefined;
          animal.prevVotes = undefined;
      } else {
          animal.rankDifference = prevPrevAnimalLookup?.rank - animal.rank;
          animal.voteDifference = animal.votes - prevPrevAnimalLookup?.votes;
          animal.prevVotes = prevPrevAnimalLookup?.votes;
          animal.percentageVoteDifference =
              (animal.votes / prevTotalPeople) * 100 -
              (animal.prevVotes / prevPrevTotalPeople) * 100;
      }
    });

    animals.value.sort(compareAnimals);
    animals.value.forEach((animal, index) => {
        animal.rank = index + 1;
        const prevAnimalLookup = prevanimals.value.find(
            (prevAnimal) => prevAnimal.name === animal.name,
        );
        if (prevAnimalLookup?.votes == 0) {
            animal.rankDifference = undefined;
            animal.voteDifference = undefined;
            animal.prevVotes = undefined;
        } else {
            animal.rankDifference = prevAnimalLookup?.rank - animal.rank;
            animal.voteDifference = animal.votes - prevAnimalLookup?.votes;
            animal.prevVotes = prevAnimalLookup?.votes;
            animal.percentageVoteDifference =
                (animal.votes / totalPeople) * 100 -
                (animal.prevVotes / prevTotalPeople) * 100;
        }
    });

    totalAnimalCount.value = animals.value.length;
    totalVotes.value = calculateTotalVotes(animals.value);
} catch (err) {
    console.error("Failed to load animal data:", err);
    errorMessage.value = "Failed to load animal data.";
}
const resetCurrentPage = () => {
    currentPage.value = 1;
};
const filteredAnimals = computed(() => {
    let animalsFiltered = removeAnimalsWithNoVotes(animals.value);
  let prevAnimalsFiltered = removeAnimalsWithNoVotes(prevanimals.value);
  let prevPrevAnimalsFiltered = removeAnimalsWithNoVotes(prevPrevAnimals.value);

    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalsSearch(
        searchInput.value,
        animalsFiltered,
        prevAnimalsFiltered,
    ));
    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalsReturning(
        activeFilters.value.returningAnimalsFilter,
        animalsFiltered,
        prevAnimalsFiltered,
    ));
    ({ animalsFiltered, prevAnimalsFiltered } = filterHabitatTypes(
        activeFilters.value.habitatTypeFilters,
        animalsFiltered,
        prevAnimalsFiltered,
    ));
    ({ animalsFiltered, prevAnimalsFiltered } = filterAnimalCategories(
        activeFilters.value.animalCategoryFilters,
        animalsFiltered,
        prevAnimalsFiltered,
    ));
    const isPercentage =
        activeFilters.value.isPercentage == "PER" ? true : false;
    // console.log("animalsFiltered before sort: ", animalsFiltered)
    // console.log("prevanimalsFiltered before sort: ", prevAnimalsFiltered)
    animalsFiltered = sortAnimals(
        activeFilters.value.sortDropdown,
        animalsFiltered,
        isPercentage,
    );
    prevAnimalsFiltered = sortAnimals(
        activeFilters.value.sortDropdown,
        prevAnimalsFiltered,
        isPercentage,
    );

    animalCount.value = animalsFiltered.length;
    console.log("animalsFiltered before relative rank: ", animalsFiltered)
    console.log("prevanimalsFiltered before relative rank: ", prevAnimalsFiltered)
    animalsFiltered = calculateRelativeRank(
        animalsFiltered,
        prevAnimalsFiltered,
    );
    // console.log("animalsFiltered after relative rank: ", animalsFiltered)
    // console.log("prevanimalsFiltered after relative rank: ", prevAnimalsFiltered)

    animalsFiltered = animalsFiltered.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value,
    );
    console.log(animalsFiltered);
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
