<template lang="pug">
  q-dialog(v-model='visible' @hide="visible=false" persistent)
    q-card(style="width: 800px; max-width: 80vw;")
      loading(v-if="!loaded" :message="'Fetching Player History...'")
      .div(v-else)
        q-card-section.row.items-center
          .row.full-width.text-h4.text-weight-bold League Emails
          .row.full-width.text-body1 Used to notify managers on illegal lineups, if desired.
        q-card-section.row.items-center
          q-list.full-width(separator dense)
            q-item.row.full-width(v-for="(email, index) in emails" :key="index")
              .column.col-6.justify-center
                .text-weight-bold {{getTeam(email.guid).name}} #[span.text-caption ({{getTeam(email.guid).manager}})]
              .col
                q-input.q-my-xs(flat square filled dense v-model="email.email")
          .row.full-width.justify-center.q-pt-sm
            .col-5
              q-btn-group(spread)
                q-btn(label="Save" color="primary" size="md" @click="save()")
                q-btn(label="Cancel" color="primary" outline size="md" @click="cancel()")

</template>

<script>
import Loading from '../../components/Loading'
import { getTeamGuid } from '../../utilities/functions'

export default {
  name: 'EditEmailsDialog',
  components: {
    'loading': Loading
  },
  props: {
  },
  data () {
    return {
      loaded: true,
      visible: true,
      emails: []
    }
  },
  mounted () {
    if (this.settings.emails) {
      this.emails = JSON.parse(JSON.stringify(this.settings.emails))
    } else {
      for (const team of this.yahooTeams) {
        this.emails.push({ guid: getTeamGuid(team), email: '' })
      }
    }
  },
  computed: {
    settings () { return this.$store.state.league.scadSettings },
    yahooTeams () { return this.$store.state.league.yahooTeams },
    getTeamGuid () { return getTeamGuid }
  },
  methods: {
    getTeam (guid) {
      for (const team of this.yahooTeams) {
        let teamGuid = this.getTeamGuid(team)
        if (teamGuid === guid) return { name: team.name, manager: team.managers[0].nickname }
      }
    },
    async save () {
      this.loaded = false
      let scadSettings = JSON.parse(JSON.stringify(this.settings))
      scadSettings.emails = this.emails
      await this.$store.dispatch('league/saveLeagueSettings', { settings: scadSettings })
      this.$emit('close')
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
