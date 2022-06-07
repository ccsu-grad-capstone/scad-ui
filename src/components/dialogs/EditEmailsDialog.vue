<template lang="pug">
  q-dialog(v-model='visible' @hide="visible=false" persistent)
    q-card(style="width: 800px; max-width: 80vw;")
      loading(v-if="!loaded" :message="'Update League Emails...'")
      .div(v-else)
        q-card-section.row.items-center
          .row.full-width.text-h4.text-weight-bold League Emails
          .row.full-width.text-body1 Used to notify managers on illegal lineups, if desired.
        q-card-section.row.items-center
          q-list.full-width(separator dense)
            q-item(v-for="(team, index) in yahooTeams" :key="index")
              .row.full-width
                .column.col-6.justify-center
                  .text-weight-bold {{team.name}} #[span.text-caption ({{getManager(team)}})]
                .col
                  .column(v-if="!checkManager(team)")
                    q-btn.q-my-xs(square filled label="not found: add manager for team" size="md" color="primary" @click='addEmail(team)')
                  q-input.q-my-xs(v-else flat square filled dense :value='getEmail(team)' @change="(e) => updateEmail(e, team)")
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
      emails: [],
      email: ''
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
    async save () {
      this.loaded = false
      let scadSettings = JSON.parse(JSON.stringify(this.settings))
      scadSettings.emails = this.emails
      await this.$store.dispatch('league/saveLeagueSettings', { settings: scadSettings })
      this.$emit('close')
    },
    getManager (team) {
      return team.managers[0].nickname
    },
    checkManager (team) {
      return this.emails.find(e => e.guid === this.getTeamGuid(team)) || false
    },
    getEmail (team) {
      return this.emails.find(e => e.guid === this.getTeamGuid(team)).email
    },
    getIndex (team) {
      // if (this.getTeamGuid(team) === '2OMLCT3C2A42Z3FCGWJZCIDYLU') return -1
      const i = this.emails.findIndex(e => {
        return e.guid === this.getTeamGuid(team)
      })
      return i
    },
    updateEmail (e, team) {
      this.emails[this.getIndex(team)].email = e.target.value
    },
    async addEmail (team) {
      this.emails.push({ guid: getTeamGuid(team), email: '' })
      await this.save()
    },
    cancel () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped></style>
