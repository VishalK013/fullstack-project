import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/system'
import i1 from "../assets/ds1.png"
import i2 from "../assets/ds2.png"
import i3 from "../assets/ds3.png"
import i4 from "../assets/ds4.png"


function DressStyle() {
  return (
    <Box sx={{ width: "90%", backgroundColor: "#f5f5f5", textAlign: 'center', margin: "auto", borderRadius: 5 }}>
      <Typography variant="h3" color="initial" sx={{ textTransform: "uppercase", fontWeight: "700", py: 10 }}>browse by dress style</Typography>
      <Grid container spacing={2} justifyContent="center" pb={10}>
        <Grid  >
          <Box component="img" src={i1} borderRadius={5} />
        </Grid>
        <Grid >
          <Box component="img" src={i2} borderRadius={5} />
        </Grid>
        <Grid >
          <Box component="img" src={i3} borderRadius={5} sx={{ width: 710, height: 310 }} />
        </Grid>
        <Grid >
          <Box component="img" src={i4} borderRadius={5} sx={{ height: 310 }} />
        </Grid>
      </Grid>

    </Box>
  )
}

export default DressStyle