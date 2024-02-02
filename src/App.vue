<template>
  <v-app>
    <data-table></data-table>
  </v-app>
</template>

<script>
import DataTable from './components/DataTable.vue';

export default {
  components: {
    DataTable,
  },
  created() {
    this.$store.dispatch('fetchData');
  },
};
</script>
