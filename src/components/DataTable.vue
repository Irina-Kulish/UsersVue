<template>
  <v-app>
    <v-container>
      <v-row class="mb-4">
        <v-col>
          <v-select
            v-model="paginationOptions.alphabetFilter"
            :items="alphabetOptions"
            label="Select a letter"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col>
          <v-text-field v-model="paginationOptions.search" label="Search"></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col>
          <v-btn @click="resetFilters">Reset Filters</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="filteredData"
            :loading="loading"
            :options="paginationOptions"
            @update:options="updatePaginationOptions"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td class="text-capitalize">{{ props.item.name.first }}</td>
              <td class="text-capitalize">{{ props.item.name.last }}</td>
              <td class="text-capitalize">{{ props.item.email }}</td>
              <td>
                <v-icon v-if="props.item.gender === 'male'">mdi-gender-male</v-icon>
                <v-icon v-else>mdi-gender-female</v-icon>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name.first' },
        { text: 'Surname', value: 'name.last' },
        { text: 'Email', value: 'email' },
        { text: 'Gender', value: 'gender' },
      ],
      loading: true,
      paginationOptions: {
        sortBy: 'name.first',
        descending: false,
        page: 1,
        itemsPerPage: 10,
        search: '',
        alphabetFilter: '',
      },
      alphabetOptions: ['All', ...Array(26)].map((_, index) => String.fromCharCode(65 + index)),
    };
  },
  computed: {
    data() {
      return this.$store.state.data;
    },
    filteredData() {
      let filtered = this.data;

      if (this.paginationOptions.search) {
        filtered = filtered.filter((item) => {
          return (
            item &&
            item.name &&
            item.name.first.toLowerCase().includes(this.paginationOptions.search.toLowerCase())
          );
        });
      }

      if (this.paginationOptions.alphabetFilter && this.paginationOptions.alphabetFilter !== 'All') {
        const letter = this.paginationOptions.alphabetFilter.toLowerCase();
        filtered = filtered.filter((item) => {
          return item && item.name && item.name.first.toLowerCase().startsWith(letter);
        });
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.paginationOptions.itemsPerPage);
    },
  },
  watch: {
    data() {
      this.totalItems = this.filteredData.length;
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$store.dispatch('fetchData').finally(() => {
        this.loading = false;
      });
    },
    updatePaginationOptions(newOptions) {
      this.paginationOptions = { ...this.paginationOptions, ...newOptions };
    },
    resetAlphabetFilter() {
      this.paginationOptions.alphabetFilter = '';
    },
    resetFilters() {
      this.paginationOptions.search = '';
      this.paginationOptions.alphabetFilter = '';
      this.paginationOptions.itemsPerPage = 10;
    },
    prevPage() {
      if (this.paginationOptions.page > 1) {
        this.paginationOptions.page--;
      }
    },
    nextPage() {
      if (this.paginationOptions.page < this.totalPages) {
        this.paginationOptions.page++;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.text-capitalize {
  text-transform: capitalize;
}

.mb-4 {
  margin-bottom: 1rem;
}
</style>
