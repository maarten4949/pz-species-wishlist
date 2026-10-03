<template>
<div>
    <header>
        <div class="input-group grow">
            <label for="search">Search:</label>
            <input id="search" name="search" type="text" v-model="searchInput" placeholder="Search an animal" class="input-field">
        </div>
        <div class="input-group">
            <label for="sort">Sort By:</label>
            <select name="sort" id="sort" v-model="sortDropdown">
                <option value="VOTES-DESC" selected>Votes Descending</option>
                <option value="VOTES-ASC">Votes Ascending</option>
                <option value="NAMES-DESC">Names Descending</option>
                <option value="NAMES-ASC">Names Ascending</option>
                <option value="GAIN-DESC">Position Gain Descending</option>
                <option value="GAIN-ASC">Position Gain Ascending</option>
            </select>
        </div>
        <div class="input-group">
            <label for="habitatType">Habitat Type:</label>
            <div>
                <select name="habitatType" id="habitatType" v-model="habitatTypeFilters">
                    <option value="" selected>Any Habitat Type</option>
                    <option v-for="habitatType in habitatTypes" :value="habitatType">{{habitatType}}</option>
                </select>
            </div>
        </div >
        <div class="input-group">
            <label for="animalCategory">Animal Category:</label>
            <select name="animalCategory" id="animalCategory" v-model="animalCategoryFilters">
                <option value="" selected>Any Animal Category</option>
                <option v-for="category in animalCategories" :value="category">{{category}}</option>
            </select>
        </div>
        <div class="input-group">
            <label for="animalPosition">Absolute/Relative position:</label>
            <select name="animalPosition" id="animalPosition" v-model="animalPositionDropdown">
                <option value="ABS" selected>Absolute positioning</option>
                <option value="REL" selected>Relative postitioning</option>
            </select>
        </div>
    </header>
    <div class="metadata-container">
        <span class="animal-count">{{animalCount}} animals</span>
        <span class="total-votes">{{totalVotes}} votes</span>
    </div>
    <div class="page-controls">
        <button :disabled="isBackButtonDisabled" :class = "`page-control ${getDisabledClassBackButton()}`" @click="GoPageBack"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left preview-icon"><path d="m15 18-6-6 6-6"/></svg></button>
        <span class="page-number">{{currentPage}}</span>
        <button :disabled="isForwardButtonDisabled" :class = "`page-control ${getDisabledClassForwardButton()}`" @click="GoPageForward"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right preview-icon"><path d="m9 18 6-6-6-6"/></svg></button>
    </div>
    <div class="error-message">{{errorMessage}}</div>
    <ul class= "animal-list">
        <li v-for="animal in filteredAnimals" class="animal" :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')})` }">
            <img class="animal-picture" :style="{ clipPath: `url(#${animal.name.replace(/\s/g, '')}-shape)` }" :src="`/images/${encodeURIComponent(animal.name)}.webp`" :alt="`${ animal.name } picture`">
            <svg viewBox="0 0 131 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-clip-path">
                <defs>
                <clipPath :id="`${animal.name.replace(/\s/g, '')}-shape`" transform="scale(0.007634, 0.026667)" clipPathUnits="objectBoundingBox">
                    <path d="M0.000815244 0.684026L32.9195 0.220812L40.1796 1.07268L83.7406 0L88.9951 1.06768L130.177 0.684026L129.161 7.57126L131 22.7487L130.177 29.818L128.791 33.2602V34.9367L130.177 37.1015L131 51.7053L130.177 58.9519L96.4505 57.6944L81.3609 58.9519L64.4764 58.0318L31.2458 60L0.000815244 58.9519L1.58989 51.9844L5.5546e-05 41.2032L0.000815244 30.1075L0.443453 22.6338V15.2175L1.12848 10.5826L2.54244 9.5774L1.12848 8.46052V3.73237L0.000815244 0.684026Z" fill="#E6DAC7"/>
                </clipPath>
                </defs>
            </svg>
            <svg viewBox="0 0 1208 152" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-clip-path">
                <defs>
                <clipPath :id="`${animal.name.replace(/\s/g, '')}`" transform="scale(0.000829, 0.00657)" clipPathUnits="objectBoundingBox">
                    <path d="M0.00700545 2.06403L133.914 6.67735L303.562 0.89314L370.51 3.04644L470.933 2.36858L484.18 0L496.039 2.19911L521.145 2.02965L571.356 1.69071L619.56 3.0338L671.779 1.01285L772.202 0.334983L820.655 3.0338L1003.09 0.334983L1056.57 1.18023L1078.82 2.54892L1105.47 2.30647L1200.41 2.06403L1191.04 19.4732L1208 57.8381L1200.41 75.7074L1187.62 84.4086V88.6463L1200.41 94.1182L1208 131.033L1200.41 149.351L1056.57 146.172L985.51 150.675L889.405 146.172L750.257 149.351L682.744 149.512L594.559 147.025L441.344 149.512L288.128 152L144.068 150.675L0.00700545 149.351L14.6604 131.739L0 104.486L0.00700545 76.4393L4.08873 57.5475V38.801L10.4056 27.0852L23.4443 24.5443L10.4056 21.7211V9.76948L0.00700545 2.06403Z" fill="#E6DAC7"/>
                </clipPath>
                </defs>
            </svg>
            <div class="animal-content">
                <div class="animal-info">
                    <div class="rank-container">
                        <span :class="`prev-rank ${getAnimalRankDifference(animal)}`"><span class="arrow-sign" v-html="getAnimalRankDifferenceArrow(animal)"></span><span :class="getAnimalRankDifferenceTextClass(animal)">{{getAnimalRankDifferenceValue(animal)}}</span></span>
                        <span class="rank">{{getRank(animal)}}</span>
                    </div>
                    <div class = "title-container">
                        <h2 class= "animal-name">{{animal.name}}</h2>
                        <div class= "subtitle">
                            <span class="animal-habitat">{{animal.habitatType}}</span>
                            <span class="animal-category">{{animal.animalCategory}} {{animal.animalSubCategory ? " - " + animal.animalSubCategory : ""}}</span>
                        </div>
                </div>
            </div>
            <span class="votes">{{animal.votes}}</span>
            </div>
        </li>
    </ul>
    <div class="page-controls" v-if="animalCount > 0">
        <button :disabled="isBackButtonDisabled" :class="`page-control ${getDisabledClassBackButton()}`" @click="GoPageBack"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left preview-icon"><path d="m15 18-6-6 6-6"/></svg></button>
        <span class="page-number">{{currentPage}}</span>
        <button :disabled="isForwardButtonDisabled" :class = "`page-control ${getDisabledClassForwardButton()}`" @click="GoPageForward"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right preview-icon"><path d="m9 18 6-6-6-6"/></svg></button>
    </div>
</div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import animals from "../assets/animals.json"
import prevanimals from "../assets/prev-animals.json"
const pageSize = 100;
const currentPage = ref(1);
const errorMessage = ref("")
const totalVotes = ref(0);
const animalCategories = ref([])
const animalCount = ref(0)
const totalAnimalCount = ref(0)
const habitatTypes = ref([])
const searchInput = defineModel("searchInput", { default: "" });
const sortDropdown = defineModel("sortDropdown", { default: "VOTES-DESC" });
const animalPositionDropdown = defineModel("animalPositionDropdown", { default: "ABS" });
const habitatTypeFilters = defineModel("habitatTypeFilters", { default: "" });
const animalCategoryFilters = defineModel("animalCategoryFilters", { default: "" });
onMounted(async () => {
  try {
    animalCategories.value = [...new Set(animals.map(animal => animal.animalCategory != "" && animal.animalCategory))]
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
const getAnimalRankDifference = (animal) => {
  const rankDiff = animalPositionDropdown.value === "ABS" ? animal.rankDifference : animal.relativeRankDifference;
  if (rankDiff > 0)
  {
    return "positive";
  }
  else if (rankDiff < 0)
  {
    return "negative";
  }
  else {
    return "neutral";
  }
}
const getAnimalRankDifferenceArrow = (animal) => {
  const rankDiff = animalPositionDropdown.value == "ABS" ? animal.rankDifference : animal.relativeRankDifference;
  if (rankDiff === undefined || isNaN(rankDiff))
  {
    return "";
  }
  else if (rankDiff > 0)
  {
    return '&#9650;';
  }
  else if (rankDiff === 0)
  {
      return ""
  }
  else {
    return '&#9660;';
  }
}
const getAnimalRankDifferenceTextClass = (animal) => {
  const rankDiff = animalPositionDropdown.value == "ABS" ? animal.rankDifference : animal.relativeRankDifference;
  if (rankDiff == 0)
  {
    return "regular-text";
  }
    return "";
}
const getAnimalRankDifferenceValue = (animal) => {
  const rankDiff = animalPositionDropdown.value == "ABS" ? animal.rankDifference : animal.relativeRankDifference;
  if (rankDiff == undefined || isNaN(rankDiff))
  {
    return "NEW";
  }
  else if (rankDiff == 0)
  {
      return '~'
  }
  return Math.abs(rankDiff);
}
const getRank = (animal) => {
  const rank = animalPositionDropdown.value == "ABS" ? animal.rank : animal.relativeRank;
  return rank;
}
const filteredAnimals = computed(() => {
  let animalsFiltered = animals;
  let prevAnimalsFiltered = prevanimals;
  if (searchInput.value != "" && searchInput.value != undefined)
  {
    animalsFiltered = animals.filter(animal => animal.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.habitatType.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.animalCategory.toLowerCase().includes(searchInput.value.toLowerCase()))

    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.habitatType.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      animal.animalCategory.toLowerCase().includes(searchInput.value.toLowerCase()))
  }
  if (habitatTypeFilters.value != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.habitatType.toLowerCase().includes(habitatTypeFilters.value.toLowerCase()))
    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.habitatType.toLowerCase().includes(habitatTypeFilters.value.toLowerCase()))
  }
  if (animalCategoryFilters.value != undefined)
  {
    animalsFiltered = animalsFiltered.filter(animal => animal.animalCategory.toLowerCase().includes(animalCategoryFilters.value.toLowerCase()))
    prevAnimalsFiltered = prevAnimalsFiltered.filter(animal => animal.animalCategory.toLowerCase().includes(animalCategoryFilters.value.toLowerCase()))
  }

  if (sortDropdown.value != undefined)
  {
    const newAnimals = animalsFiltered.filter(animal => isNaN(animal.rankDifference))
    if (sortDropdown.value === "GAIN-DESC" || sortDropdown.value === "GAIN-ASC")
    {
      animalsFiltered = animalsFiltered.filter(animal  => !isNaN(animal.rankDifference))
    }
    animalsFiltered = animalsFiltered.sort((a, b) => {
      if (sortDropdown.value === "VOTES-DESC") return b.votes - a.votes || a.name.localeCompare(b.name)
      if (sortDropdown.value === "VOTES-ASC") return a.votes - b.votes || b.name.localeCompare(a.name)
      if (sortDropdown.value === "NAMES-DESC") return b.name.localeCompare(a.name)
      if (sortDropdown.value === "NAMES-ASC") return a.name.localeCompare(b.name)
      if (sortDropdown.value === "GAIN-DESC") return b.rankDifference - a.rankDifference || a.name.localeCompare(b.name)
      if (sortDropdown.value === "GAIN-ASC") return a.rankDifference - b.rankDifference || b.name.localeCompare(a.name)
      return 0
    })
    if (sortDropdown.value === "GAIN-DESC" || sortDropdown.value === "GAIN-ASC")
    {
      animalsFiltered = [...animalsFiltered, ...newAnimals]
    }
  }
  animalCount.value = animalsFiltered.length;
  animalsFiltered = calculateRelativeRank(animalsFiltered, prevAnimalsFiltered)
  animalsFiltered = animalsFiltered.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
  return animalsFiltered;
})
function GoPageBack() {
  currentPage.value = Math.max(1, currentPage.value - 1)
  window.scrollTo({ top: 0, behavior: 'smooth' })

}
function GoPageForward() {
  currentPage.value = Math.ceil(Math.min(animalCount.value / pageSize, currentPage.value + 1))
  window.scrollTo({ top: 0, behavior: 'smooth' })
  console.log("changed currentPage to: ", currentPage.value)
}
const getDisabledClassBackButton = () => {
  return currentPage.value === 1 ? 'disabled' : ''
}
const getDisabledClassForwardButton = () => {
  return Math.ceil(animalCount.value / pageSize) == currentPage.value ? 'disabled' : ''
}
const isBackButtonDisabled = computed(() => {
  return currentPage.value === 1
})
const isForwardButtonDisabled = computed(() => {
  return Math.ceil(animalCount.value / pageSize) == currentPage.value
})
</script>
<style>
header {
    display: flex;
    gap: var(--spacing-04);
    align-items: stretch;
    flex-wrap: wrap;
}
.input-field {
    color: var(--text-dark);
    flex-grow: 1;
    outline: solid transparent 2px;
    border: none;
    border-radius: var(--radii-m);
    padding: var(--spacing-03) var(--spacing-04);
    background-color: var(--bg-2);
    font-size: var(--type-03);
    transition: 0.2s outline ease-in-out;
}
.input-field::placeholder {
    color: var(--text-soft-inverted);
}
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

.input-group {
    display: flex;
    flex-direction: column;

    & label {
        font-size: var(--type-02);
        line-height: var(--spacing-06);
    }
}
.grow {
    flex-grow: 1;
}
.animal-list {
    padding: var(--spacing-05) 0;
    list-style: none;
    display:grid;
    gap: var(--spacing-04);
}
.animal-count, .total-votes {
    font-size: var(--type-01);
    color: var(--text-soft);
    line-height: var(--spacing-05);
}
.metadata-container{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-03);
}
.page-controls {
    display:flex;
    align-items: center;
    margin-left: auto;
    width: 100%;
    justify-content: flex-end;
    gap: var(--spacing-04);
    & .page-control {
        background-color: var(--bg-2);
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-04);
        border-radius: var(--radii-m);
        &.disabled {
            opacity: 50%;
        }
        & svg {
            stroke-width: 3px;
            color: var(--text-normal);
        }
    }
    & .page-number {
        min-width: var(--spacing-06);
        text-align:center;
        font-family: var(--font-eagle-bold);
        font-size: var(--type-08);
        color: var(--text-soft)
    }
}
.animal {
    overflow:hidden;
    align-items:stretch;
    display: flex;
    padding: var(--spacing-02);
    min-height: var(--spacing-13);
    background-color: var(--bg-2);
    position:relative;
    & .animal-content {
        display: flex;
        justify-content:space-between;
        align-items:center;
        flex-grow:1;
        max-height: var(--spacing-13);
    }
    & .svg-clip-path {
        width: 0;
        height: 0;
        opacity:0;
    }
    & .animal-content::before {
        content: "";
        position: absolute;
        bottom: -25%;
        left: calc(var(--spacing-14) / 2 * -1);
        width: var(--spacing-15);
        height: 150%;
        z-index: 1;
        background-image: radial-gradient(closest-side,#000, transparent);
    }
    & .animal-picture {
        bottom: .08rem;
        left: -0.1rem;
        position: absolute;
        height: 100%;
        object-fit:cover;
        width: var(--spacing-15);
    }
    & .animal-picture::before
    {
        position: absolute;
        top: 50%;
    }
    & .animal-info {
        padding: var(--spacing-04) var(--spacing-04);
        display:flex;
        gap: calc(var(--spacing-14) + var(--spacing-02));
        align-items: center;
    }
    & .rank-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-04);
    }
    & .prev-rank {
        text-align: right;
        &.positive {
            color: var(--green);
        }
        &.negative {
            color: var(--red);
        }
        &.neutral {
            color: var(--text-soft-inverted);
        }
        min-width: 2.5rem;
        font-family: var(--font-eagle-bold);
        font-size: var(--type-03);
        line-height: var(--spacing-07);
        z-index: 2;
        color: var(--text-white);
        & .arrow-sign {
            font-size: var(--type-01);
            vertical-align: middle;
            line-height: var(--spacing-07);
        }
    }
    & .rank{
        min-width: 3rem;
        font-family: var(--font-eagle-bold);
        font-size: var(--type-06);
        line-height: var(--spacing-07);
        z-index: 2;
        color: var(--text-white);
    }
    & .votes{
        padding: var(--spacing-04) var(--spacing-08);
        font-family: var(--font-eagle-bold);
        font-size: var(--type-08);
        line-height: var(--spacing-08);
    }
    & .title-container {
        & .animal-name {
            line-height: var(--spacing-07);
        }
        & .subtitle {
            flex-wrap: wrap;
            display:flex;
            gap: var(--spacing-03);
            color: var(--text-soft);
        }
    }
    & .regular-text {
        font-family: var(--font-noto-sans);
        font-size: var(--type-06);
        vertical-align: middle;
    }
}
@media (width < 800px)
{
    .animal {
        & .animal-picture {
        width: var(--spacing-14);
        }
        & .animal-info {
            gap: calc(var(--spacing-13) + var(--spacing-02));
            & .animal-name {
                font-size: var(--type-06);
                line-height: var(--spacing-06);
            }
            & .title-container {
                gap: var(--spacing-01);
                display: flex;
                flex-direction: column;
            }
            & .subtitle {
                flex-direction: column;
                gap: 0;
                font-size: var(--type-02);
            }
        }
        & .votes {
            padding: var(--spacing-04) var(--spacing-06);
            padding-left: 0;
        }
    }
}
@media (width < 550px)
{
    .animal {
        & .animal-content::before {
            content: "";
            position: absolute;
            bottom: 0%;
            left: calc(var(--spacing-14) / 2 * -1);
            width: var(--spacing-14);
            height: 100%;

        }
        & .rank-container {
            flex-direction:column-reverse;
            align-items: start;
            gap: var(--spacing-01);
        }
        & .prev-rank {
            line-height: var(--spacing-04);
            text-align:left;
                & .arrow-sign {
                    line-height: var(--spacing-04);
                }
        }
        & .rank{
            line-height: var(--spacing-06);
        }
        & .animal-picture {
          width: var(--spacing-13);
        }
        & .animal-info {
            padding: var(--spacing-04) var(--spacing-04);
            gap: calc(var(--spacing-12) + var(--spacing-02));

        }
        & .votes {
            padding: var(--spacing-04) var(--spacing-05);
            padding-left: 0;
        }
    }
}
@media (width < 450px)
{
    .animal {
        & .animal-content::before {
            content: "";
            position: absolute;
            bottom: 0%;
            left: calc(var(--spacing-14) / 2 * -1);
            width: 14rem;
            height: 100%;

        }
        & .animal-picture {
          width: calc(var(--spacing-12) + var(--spacing-02));
        }
        & .animal-info {
            padding: var(--spacing-04) var(--spacing-03);
            gap: calc(var(--spacing-09));
            & .rank-container {
                gap: var(--spacing-02);
            }
            & .animal-name {
                font-size: var(--type-03);
                line-height: var(--spacing-06);
            }
            & .title-container {
                gap: var(--spacing-01);
                display: flex;
                flex-direction: column;
            }
            & .subtitle {
                flex-direction: column;
                gap: 0;
                font-size: var(--type-02);
            }
        }
        & .votes {
            padding: var(--spacing-04) var(--spacing-04);
            padding-left: 0;
        }
    }
}
@media (width < 350px)
{
    .animal {
        & .animal-content::before {
            content: "";
            position: absolute;
            bottom: 0%;
            left: calc(var(--spacing-14) / 1.7 * -1);
            width: 14rem;
            height: 100%;

        }
        & .animal-picture {
          width: calc(var(--spacing-11));
        }
        & .animal-info {
            gap: calc(var(--spacing-06));

            & .animal-name {
                font-size: var(--type-02);
                line-height: var(--spacing-06);
            }
            & .title-container {
                gap: var(--spacing-01);
                display: flex;
                flex-direction: column;
            }
            & .subtitle {
                flex-direction: column;
                gap: 0;
                font-size: var(--type-01);
            }
        }
        & .votes {
            font-size: var(--type-07)
        }

    }
}
</style>
