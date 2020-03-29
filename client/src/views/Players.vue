<template lang="pug">
  body
    .row.q-gutter-md.q-pa-md
      .text-h4.text-weight-bolder Players
      .row.full-width.justify-right
        div(style="width: 100%")
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-3
              q-input( filled dense label="Search by Name" stack-label v-model='search')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Search' dense color='secondary' text-color='primary' size='sm' @click="saveSalaries()")
          .row.full-width.q-gutter-sm.q-pa-sm
            .col-3
              q-select( filled dense label="Team" stack-label :options="referenceData.status" v-model='team')
            .col-3
              q-select( filled dense label="Position" stack-label :options="referenceData.position" v-model='position')
            div.q-gutter-sm
              q-btn.q-pa-xs(label='Filter' dense color='primary' text-color='white' size='sm' @click="saveSalaries()")
          .q-pa-md
            q-table(title='Treats' dense :data='data' :columns='columns' row-key='name')

</template>

<script>
import referenceData from '../utilities/referenceData'
export default {
  data () {
    return {
      team: '',
      position: '',
      search: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Player Name',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          style: 'width: 200px'

        },
        { name: 'team', align: 'left', label: 'Team', field: 'team', sortable: true, style: 'width: 200px' },
        { name: 'salary', align: 'left', label: 'Salary', field: 'salary', sortable: true }
      ],
      data: [
        {
          name: 'Josh Allen',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Tom Brady',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Russel Wilson',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Peyton Manning',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Drew Brees',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Cam Newton',
          team: 'GoldDiggers',
          salary: 7
        },
        {
          name: 'Eli Manning',
          team: 'GoldDiggers',
          salary: 7
        }
      ]
    }
  },
  computed: {
    referenceData () {
      return referenceData
    }
  }
}
</script>

<style lang="stylus" scoped>
  .scad-team-settings
    text: $h2
    color: $blue-1
    background-color: $grey-5
</style>
