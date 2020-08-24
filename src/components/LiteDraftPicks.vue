<template lang="pug">
  .q-pa-md(style="width: 50%")
    .text-h6.text-weight-bolder Draft Picks
    q-table(
      :data='draftPicks',
      :columns='columns',
      row-key='key',
      :pagination.sync="pagination",
      hide-bottom,
      dense,
      flat,
      square
      )
      template(v-slot:body-cell-year='props')
        q-td(:props='props')
          q-list(separator dense)
            q-item(v-for="(pick, i) in props.row.draftPicks")
              q-item-section
                q-item-label
                  | {{pick.year}}
      template(v-slot:body-cell-round='props')
        q-td(:props='props')
          q-list(separator dense)
            q-item(v-for="(pick, i) in props.row.draftPicks")
              q-item-section
                q-item-label
                  | {{pick.round}}
      template(v-slot:body-cell-original_owner='props')
        q-td(:props='props')
          q-list(separator dense)
            q-item(v-for="(pick, i) in props.row.draftPicks")
              q-item-section
                q-item-label
                  | {{pick.original_owner}}

</template>

<script>

export default {
  name: 'LiteDraftPicks',
  data () {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      },
      columns: [
        {
          name: 'key',
          required: true,
          label: 'TeamId',
          align: 'right',
          field: row => row.team_key,
          format: val => `${val}`,
          sortable: false,
          // classes: 'bg-secondary ellipsis',
          // style: 'max-width: 10px',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'year',
          required: true,
          label: 'Year:',
          align: 'left',
          // field: row => row.draftPicks,
          // format: val => `${val}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          // style: 'max-width: 200px',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'round',
          required: true,
          label: 'Round:',
          align: 'left',
          // field: row => row.draftPicks,
          // format: val => `${val}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          // style: 'max-width: 200px',
          headerClasses: 'bg-grey-4'
        },
        {
          name: 'original_owner',
          required: true,
          label: 'Original Owner:',
          align: 'left',
          // field: row => row.draftPicks,
          // format: val => `${val}`,
          sortable: false,
          // classes: 'bg-grey-2 ellipsis',
          // style: 'max-width: 200px',
          headerClasses: 'bg-grey-4'
        }
      ]
    }
  },
  computed: {
    draftPicks () {
      return this.$store.state.draftPicks.teams
    }
  },
  methods: {
  }

}
</script>

<style lang="stylus" scoped>
  .scad-team-settings
    text: $h2
    color: $blue-1
    background-color: $grey-5
</style>
