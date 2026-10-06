<script setup>
import InputGroup from './InputGroup.vue';

const props = defineProps({
  animalCategories: Array,
  habitatTypes: Array,
  dlcs: Array
})
const filters = defineModel({
  default: () => ({ sortDropdown: '', animalPositionDropdown: '', habitatTypeFilters: '', animalCategoryFilters: '', returningAnimalsFilter: '', dlcPackFilter: '' })
})
</script>

<template>
    <details class="filter-container">
        <summary class="filter-container-button">
            Filters
            <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down preview-icon"><path d="m6 9 6 6 6-6"/></svg></span>
        </summary>
        <div class="header">
            <InputGroup>
                <label for="sort">Sort By:</label>
                <select name="sort" id="sort" v-model="filters.sortDropdown">
                    <option value="VOTES-DESC">Votes Descending</option>
                    <option value="VOTES-ASC">Votes Ascending</option>
                    <option value="NAMES-DESC">Names Descending</option>
                    <option value="NAMES-ASC">Names Ascending</option>
                    <option value="GAIN-DESC">Position Gain Descending</option>
                    <option value="GAIN-ASC">Position Gain Ascending</option>
                </select>
            </InputGroup>
            <InputGroup>
                <label for="habitatType">Habitat Type:</label>
                    <select name="habitatType" id="habitatType" v-model="filters.habitatTypeFilters">
                        <option value="">Any Habitat Type</option>
                        <option v-for="habitatType in habitatTypes" :value="habitatType">{{habitatType}}</option>
                    </select>
            </InputGroup>
            <InputGroup>
                <label for="animalCategory">Animal Category:</label>
                <select name="animalCategory" id="animalCategory" v-model="filters.animalCategoryFilters">
                    <option value="">Any Animal Category</option>
                    <option v-for="category in animalCategories" :value="category">{{category}}</option>
                </select>
            </InputGroup>
            <InputGroup>
                <label for="animalPosition">Absolute/Relative position:</label>
                <select name="animalPosition" id="animalPosition" v-model="filters.animalPositionDropdown">
                    <option value="ABS">Absolute positioning</option>
                    <option value="REL">Relative postitioning</option>
                </select>
            </InputGroup>
            <InputGroup>
                <label for="returningAnimalsFilter">Returning animals:</label>
                <select name="returningAnimalsFilter" id="returningAnimalsFilter" v-model="filters.returningAnimalsFilter">
                    <option value="ALL">All animals</option>
                    <option value="RET">Only Returning Animals</option>
                    <option value="NEW">Only New Animals</option>
                </select>
            </InputGroup>
            <InputGroup v-if="dlcs && dlcs.length > 0">
                <label for="dlcPackFilter">DLC Pack:</label>
                <select name="dlcPackFilter" id="dlcPackFilter" v-model="filters.dlcPackFilter">
                    <option value="">All DLC's</option>
                    <option v-for="dlc in dlcs" :value="dlc">{{dlc}}</option>
                </select>
            </InputGroup>
        </div>
    </details>
</template>

<style>
select {
    padding: var(--spacing-03) var(--spacing-04);
    border-radius: var(--radii-m);
    background-color: var(--bg-2);
    border: none;
    outline: solid transparent 2px;
    transition: 0.2s outline ease-in-out;
    font-size: var(--type-03);
    flex-grow:1;
    line-height: 15px;
}
.filter-container {
    user-select: none;
    margin-top: var(--spacing-07);
    background-color: var(--text-soft);
    border-radius: var(--radii-m);
    color: var(--text-white);

}
.filter-container>.filter-container-button span.icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease-in-out;
  margin-left: auto;
}
.filter-container[open] .filter-container-button span.icon {
  transform: rotate(180deg);
}

.filter-container-button {
  display: flex;
  cursor: pointer;
  padding: var(--spacing-04) var(--spacing-05);
}

.filter-container-button::-webkit-details-marker {
  display: none;
}
.filter-container-button {
    background-color: var(--text-soft);
    border-radius: var(--radii-m);
    color: var(--text-white);
}
.header {
    display: flex;
    padding: var(--spacing-04) var(--spacing-05);
    gap: var(--spacing-04);
    align-items: stretch;
    flex-wrap: wrap;
}
</style>
