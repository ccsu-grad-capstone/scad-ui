<template lang="pug">
  q-page.flex.flex-center
    q-card.q-pa-md.q-ma-md(style='width: 75%')
      q-card-section
        .text-h6 Create New League
      q-form(@submit='onSubmit')
        q-separator.q-my-lg(color='secondary' inset)
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | League Name:
          .col-7.q-pl-lg
            q-input( rounded outlined dense v-model='$v.league.name.$model' lazy-rules :error='$v.league.name.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | League Capacity:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.capacity' :options='referenceData.capacity' :error='$v.league.capacity.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Divisions:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.divisions' :options='referenceData.divisions' :error='$v.league.divisions.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Draft Type:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.draftType' :options='referenceData.draftType' :error='$v.league.draftType.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Scoring Type:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.scoringType' :options='referenceData.scoringType' :error='$v.league.scoringType.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Waiver Type:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.waiverType' :options='referenceData.waiverType' :error='$v.league.waiverType.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Weekly Waiver:
          .col-4.q-pl-lg
            q-select( rounded outlined dense v-model='league.weeklyWaivers' :options='referenceData.weeklyWaivers' :error='$v.league.waiverType.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Waiver Time:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.waiverTime' :options='referenceData.waiverTime' :error='$v.league.waiverTime.$error' error-message='Required Field')
          .col-3.text-subtitle2.q-pt-md.q-pl-sm
            | days
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Playoff Teams:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.playoffTeams' :options='referenceData.playoffTeams' :error='$v.league.playoffTeams.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Playoff:
          .col-4.q-pl-lg
            q-select( rounded outlined dense v-model='league.playoffs' :options='referenceData.playoffs' :error='$v.league.playoffs.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Playoff Reseeding:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.playoffReseeding' :options='referenceData.booleans' :error='$v.league.playoffReseeding.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Playoff TieBreaker:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.playoffTieBreaker' :options='referenceData.playoffTieBreaker' :error='$v.league.playoffReseeding.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Lock Eliminated Teams:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.lockEliminatedTeams' :options='referenceData.booleans' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Max Acquisitions Per Season:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.maxAcqPerSeason' :options='referenceData.booleans' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Max Axquisitions Per Week:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.maxAcqPerWeek' :options='referenceData.booleans' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Max Trades Per Season:
          .col-3.q-pl-lg
            q-select( rounded outlined dense v-model='league.maxTradesPerSeason' :options='referenceData.booleans' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Trade Deadline Date:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.tradeDeadlineDate' :error='$v.league.tradeDeadlineDate.$error' error-message='Required Field')
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Trade Review Time:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.tradeReviewTime' :options='referenceData.tradeReviewTime' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
          .col-3.text-subtitle2.q-pt-md.q-pl-sm
            | days
        q-separator.q-my-md(color='secondary' inset)
        .row.text-h6.justify-center
          | SCAD Settings
        .row.q-pt-md
          .col-3.text-subtitle2.text-right.q-pt-md
            | Rookie Draft Rounds:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.rookieDraftRds' :options='referenceData.rookieDraftRds' :error='$v.league.lockEliminatedTeams.$error' error-message='Required Field')
        .row.q-py-md
          .col-3.text-subtitle2.text-right.q-pt
            | Team Salary Cap: ${{ league.teamCap }}
          .col-7.q-pl-lg
            q-slider(v-model='league.teamCap' :min='100' :max='1000' :step='100' label dense :label-value='`$${league.teamCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity        .row.q-pt-md
        .row.q-py-md
          .col-3.text-subtitle2.text-right
            | League Salary Cap: ${{ league.leagueCap }}
          .col-7.q-pl-lg
            q-slider(:value='calcLeagueCap' label dense :min='1600' :max='16000' readonly :label-value='`$${league.leagueCap}`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Injured Reserved:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.ir' :options='referenceData.positionCounts' :error='$v.league.ir.$error' error-message='Required Field')
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | IR Cap Relief: {{ league.irReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.irReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.irReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        .row
          .col-3.text-subtitle2.text-right.q-pt-md
            | Franchise Tags:
          .col-2.q-pl-lg
            q-select( rounded outlined dense v-model='league.franchiseTagSpots' :options='referenceData.positionCounts' :error='$v.league.franchiseTagSpots.$error' error-message='Required Field')
        .row.q-pb-md
          .col-3.text-subtitle2.text-right
            | Franchise Tag Relief: {{ league.tagReliefPerc }}%
          .col-7.q-pl-lg
            q-slider(v-model='league.tagReliefPerc' :min='0' :max='100' :step='5' label dense :label-value='`${league.tagReliefPerc}%`' color='primary')
          .col-2.q-px-sm
            q-btn(rounded dense color='info' size='xs' label="What's This?")
              q-tooltip
                | Team Salary Cap x Capacity
        q-separator.q-mt-md(color='secondary' inset)
        .row.q-py-md
          .col-3
            .text-subtitle1.text-center
              | Roster Positions:
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | QB:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.qb' :options='referenceData.positionCounts' :error='$v.league.roster.qb.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs
                | RB:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.rb' :options='referenceData.positionCounts' :error='$v.league.roster.rb.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | WR:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.wr' :options='referenceData.positionCounts' :error='$v.league.roster.wr.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | TE:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.te' :options='referenceData.positionCounts' :error='$v.league.roster.te.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | RB/WR:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.rb_wr' :options='referenceData.positionCounts' :error='$v.league.roster.rb_wr.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | RB/WR/TE:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.rb_wr_te' :options='referenceData.positionCounts' :error='$v.league.roster.rb_wr_te.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | QB/RB/WR/TE:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.qb_rb_wr_te' :options='referenceData.positionCounts' :error='$v.league.roster.qb_rb_wr_te.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | K:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.k' :options='referenceData.positionCounts' :error='$v.league.roster.k.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | DEF:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.def' :options='referenceData.positionCounts' :error='$v.league.roster.def.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Bench:
              .col-4.q-pa-xs
                q-select( rounded outlined dense v-model='league.roster.bn' :options='referenceData.benchCounts' :error='$v.league.roster.bn.$error' error-message='Required Field')
            .row
              .col-6.text-subtitle2.text-right.q-pa-xs.q-pt-xs
                | Total Roster Slots:
              .col-4.q-pa-xs
                q-select( rounded outlined disable dense :value='calcRosterLimit')
          .col-4
            .text-subtitle1.text-center
              | Offsensive Stat Categories:
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Passing Yards:
                |
                q-btn(rounded dense color='info' size='xs' label=" ? ")
                  q-tooltip
                    | Points per single yard
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.passYards' :error='$v.league.stats.passYards.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Passing TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.passingTD' :error='$v.league.stats.passingTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Passing INT:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.int' :error='$v.league.stats.int.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Sack:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.sack' :error='$v.league.stats.sack.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Rushing Attempts:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.rushingAttempts' :error='$v.league.stats.rushingAttempts.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Rushing Yards:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.rushingYards' :error='$v.league.stats.rushingYards.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Rushing TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.rushingTD' :error='$v.league.stats.rushingTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Reception:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.rec' :error='$v.league.stats.rec.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Receiving Yards:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.recYards' :error='$v.league.stats.recYards.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Receiving TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.receivingTD' :error='$v.league.stats.receivingTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Return Yards:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.returnYards' :error='$v.league.stats.returnYards.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Return TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.returnTD' :error='$v.league.stats.returnTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | 2-PT Conversion:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.twoPtConv' :error='$v.league.stats.twoPtConv.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Fumble Lost:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.fumbleLost' :error='$v.league.stats.fumbleLost.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Off. Fumble Return TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.offFumbleReturnTD' :error='$v.league.stats.offFumbleReturnTD.$error' error-message='Invalid Input')
            div(v-if="league.roster.k !== 0")
              .text-subtitle1.text-center
                | Kicker Categories:
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | FG 0-19 Yards:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.fg0_19' :error='$v.league.stats.fg0_19.$error' error-message='Invalid Input')
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | FG 20-29 Yards:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.fg0_19' :error='$v.league.stats.fg0_19.$error' error-message='Invalid Input')
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | FG 30-39 Yards:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.fg30_39' :error='$v.league.stats.fg30_39.$error' error-message='Invalid Input')
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | FG 40-49 Yards:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.fg40_49' :error='$v.league.stats.fg40_49.$error' error-message='Invalid Input')
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | FG 50+ Yards:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.fg50plus' :error='$v.league.stats.fg50plus.$error' error-message='Invalid Input')
              .row
                .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                  | PAT:
                .col-4.q-pa-xs
                  q-input( rounded outlined dense v-model='league.stats.pat' :error='$v.league.stats.pat.$error' error-message='Invalid Input')
          .col-4
            .text-subtitle1.text-center
              | Defensive Stat Categories:
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Sack:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defSack' :error='$v.league.stats.defSack.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Interception:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defInt' :error='$v.league.stats.defInt.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Fumble Recovery:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defFumbleRec' :error='$v.league.stats.defFumbleRec.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Defensive TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defTD' :error='$v.league.stats.defTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Safety:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defSafety' :error='$v.league.stats.defSafety.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Blocked Kick:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.blockKick' :error='$v.league.stats.blockKick.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Return TD:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.specialTeamReturnTD' :error='$v.league.stats.specialTeamReturnTD.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 0:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_0' :error='$v.league.stats.defPtsAllowed_0.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 1-6:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_1_6' :error='$v.league.stats.defPtsAllowed_1_6.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 7-13:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_7_13' :error='$v.league.stats.defPtsAllowed_7_13.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 14-20:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_14_20' :error='$v.league.stats.defPtsAllowed_14_20.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 21-27:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_21_27' :error='$v.league.stats.defPtsAllowed_21_27.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 28-34:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_28_34' :error='$v.league.stats.defPtsAllowed_28_34.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Points Allowed: 35+:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defPtsAllowed_35' :error='$v.league.stats.defPtsAllowed_35.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: Negative:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_Neg' :error='$v.league.stats.defYardsAllowed_Neg.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 0-99:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_0_99' :error='$v.league.stats.defYardsAllowed_0_99.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 100-199:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_100_199' :error='$v.league.stats.defYardsAllowed_100_199.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 200-299:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_200_299' :error='$v.league.stats.defYardsAllowed_200_299.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 300-399:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_300_399' :error='$v.league.stats.defYardsAllowed_300_399.$error' error-message='Invalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 400-499:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_400_499' :error='$v.league.stats.defYardsAllowed_400_499.$error' error-message='RInvalid Input')
            .row
              .col-8.text-subtitle2.text-right.q-pa-xs.q-pt-sm
                | Yards Allowed: 500+:
              .col-4.q-pa-xs
                q-input( rounded outlined dense v-model='league.stats.defYardsAllowed_500' :error='$v.league.stats.defYardsAllowed_500.$error' error-message='Invalid Input')
      .row.justify-center.q-pt-md
        .text-caption *default roster positions and scoring set across the board, be sure to adjust accordingly*
      .row.justify-center
        .col-6
          q-btn-group(spread)
            q-btn(label='Submit' type='submit' dense no-caps color='primary' size='md' @click="onSubmit")

</template>

<script>
import { required, decimal } from 'vuelidate/lib/validators'
import referenceData from '../utilities/referenceData'
export default {
  name: 'CreateLeague',

  data () {
    return {
      league: {
        name: '',
        capacity: 12,
        divisions: 1,
        draftType: 'Auction',
        scoringType: 'Head-to-Head',
        waiverType: 'FAAB',
        waiverTime: 2,
        weeklyWaivers: 'Game Time - Tuesday',
        irReliefPerc: 50,
        tagReliefPerc: 50,
        rookieDraftRds: 3,
        leagueCap: this.calcLeagueCap,
        teamCap: 250,
        tradeDeadlineDate: null,
        tradeReviewTime: 2,
        maxAcqPerSeason: 'No Maximum',
        maxAcqPerWeek: 'No Maximum',
        maxTradesPerSeason: 'No Maximum',
        playoffs: 'Weeks 14-16 (6 teams)',
        playoffReseeding: true,
        playoffTieBreaker: 'Points For',
        playoffTeams: 6,
        lockEliminatedTeams: true,
        roster: {
          qb: 1,
          rb: 2,
          wr: 3,
          te: 1,
          rb_wr: 0,
          rb_wr_te: 1,
          qb_rb_wr_te: 0,
          k: 1,
          def: 1,
          bn: 15
        },
        rosterLimit: null,
        ir: 1,
        franchiseTagSpots: 1,
        stats: {
          passYards: 0.04,
          passingTD: 6.0,
          int: -2.0,
          sack: -0.5,
          rushingAttempts: 0.25,
          rushingYards: 0.1,
          rushingTD: 6.0,
          rec: 0.5,
          recYards: 0.1,
          receivingTD: 6.0,
          returnYards: 0.033,
          returnTD: 6.0,
          twoPtConv: 2.0,
          fumbleLost: -2.0,
          offFumbleReturnTD: 6.0,
          fg0_19: 3.0,
          fg20_29: 3.0,
          fg30_39: 3.0,
          fg40_49: 4.0,
          fg50plus: 5.0,
          pat: 1.0,
          defSack: 1.0,
          defInt: 2.0,
          defFumbleRec: 2.0,
          defTD: 6.0,
          defSafety: 2.0,
          blockKick: 2.0,
          specialTeamReturnTD: 6.0,
          defPtsAllowed_0: 7.0,
          defPtsAllowed_1_6: 5.0,
          defPtsAllowed_7_13: 3.0,
          defPtsAllowed_14_20: 1.0,
          defPtsAllowed_21_27: 0.0,
          defPtsAllowed_28_34: -1.0,
          defPtsAllowed_35: -3.0,
          defYardsAllowed_Neg: 7.0,
          defYardsAllowed_0_99: 5.0,
          defYardsAllowed_100_199: 3.0,
          defYardsAllowed_200_299: 1.0,
          defYardsAllowed_300_399: 0.0,
          defYardsAllowed_400_499: -1.0,
          defYardsAllowed_500: -3.0,
          extraPointsReturned: 2.0
        }
      }
    }
  },
  validations: {
    league: {
      name: { required },
      capacity: { required },
      divisions: { required },
      draftType: { required },
      scoringType: { required },
      waiverType: { required },
      waiverTime: { required },
      tradeDeadlineDate: { required },
      playoffs: { required },
      playoffReseeding: { required },
      playoffTeams: { required },
      lockEliminatedTeams: { required },
      roster: {
        qb: { required },
        rb: { required },
        wr: { required },
        te: { required },
        rb_wr: { required },
        rb_wr_te: { required },
        qb_rb_wr_te: { required },
        k: { required },
        def: { required },
        bn: { required }
      },
      ir: { required },
      franchiseTagSpots: { required },
      stats: {
        passYards: { required, decimal },
        passingTD: { required, decimal },
        int: { required, decimal },
        sack: { required, decimal },
        rushingAttempts: { required, decimal },
        rushingYards: { required, decimal },
        rushingTD: { required, decimal },
        rec: { required, decimal },
        recYards: { required, decimal },
        receivingTD: { required, decimal },
        returnYards: { required, decimal },
        returnTD: { required, decimal },
        twoPtConv: { required, decimal },
        fumbleLost: { required, decimal },
        offFumbleReturnTD: { required, decimal },
        fg0_19: { required, decimal },
        fg20_29: { required, decimal },
        fg30_39: { required, decimal },
        fg40_49: { required, decimal },
        fg50plus: { required, decimal },
        pat: { required, decimal },
        defSack: { required, decimal },
        defInt: { required, decimal },
        defFumbleRec: { required, decimal },
        defTD: { required, decimal },
        defSafety: { required, decimal },
        blockKick: { required, decimal },
        specialTeamReturnTD: { required, decimal },
        defPtsAllowed_0: { required, decimal },
        defPtsAllowed_1_6: { required, decimal },
        defPtsAllowed_7_13: { required, decimal },
        defPtsAllowed_14_20: { required, decimal },
        defPtsAllowed_21_27: { required, decimal },
        defPtsAllowed_28_34: { required, decimal },
        defPtsAllowed_35: { required, decimal },
        defYardsAllowed_Neg: { required, decimal },
        defYardsAllowed_0_99: { required, decimal },
        defYardsAllowed_100_199: { required, decimal },
        defYardsAllowed_200_299: { required, decimal },
        defYardsAllowed_300_399: { required, decimal },
        defYardsAllowed_400_499: { required, decimal },
        defYardsAllowed_500: { required, decimal },
        extraPointsReturned: { required, decimal }
      }
    }
  },
  created () {},
  destroyed () {
    this.reset()
  },
  computed: {
    referenceData () {
      return referenceData
    },
    calcLeagueCap () {
      this.setLeagueCap()
      return this.league.leagueCap
    },
    calcRosterLimit () {
      this.setRosterLimit()
      return this.league.rosterLimit
    }
  },
  methods: {
    onSubmit () {
      console.log('[CREATELEAGUE - Methods] - onSubmit()')
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('CreateLeague Validation failed')
      } else {
        console.log('CreateLeague Validation Successful', this.league)
        this.$store.dispatch('league/creatLeague', this.league)
        this.$router.push({
          path: 'dashboard'
        })
      }
    },
    setLeagueCap () {
      this.league.leagueCap = this.league.teamCap * this.league.capacity
    },
    setRosterLimit () {
      let counts = Object.values(this.league.roster)
      const sumArray = arr => arr.reduce((a, b) => a + b, 0)
      this.league.rosterLimit = sumArray(counts)
    },
    resetValidation () {
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
