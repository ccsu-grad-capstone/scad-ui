<template lang="pug">
    .text-center.q-pa-lg
      .q-gutter-y-lg.q-pt-lg
        img(src="//scad-assets.s3.amazonaws.com/statics/yahoo-ff.png" style="height: 150px")
        .text-h5.text-weight-bold.text-negative
          | Unable to connect to Yahoo's Fantasy Sports API.
        div
          .text-body2.text-faded
            | SCAD is dependent on the Yahoo Fantasy Sports API.  We get league, team, and player data from this API.
          .text-body2.text-faded
            | As soon as it's available SCAD will be back up and running.
        .text-h6.text-weight-bold
          | Please try again shortly.

</template>

<script>
export default {
  name: 'YahooError'
}
</script>
