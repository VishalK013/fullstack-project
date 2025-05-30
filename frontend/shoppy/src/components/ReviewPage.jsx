import React from 'react'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/system'
import { Rating } from '@mui/material'

function ReviewPage() {
    return (
        <div style={{ width: "90%", margin: "auto" }}>
            <Typography variant="h3" color="initial" textTransform={"uppercase"} mt={10} mb={5} fontWeight={700}>our happy customers</Typography>
            <Box display={"flex"} justifyContent={"center"} gap={5}>
                <Box width={400} border={"1px solid rgb(228, 228, 228)"} boxShadow borderRadius={5} padding={3}>
                    <Rating
                        value={5}
                        readOnly
                    />
                    <Box display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight={700} mr={1}>
                            Sarah
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>

                    <Typography variant="body1" color="primary" fontSize={15}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam consectetur et ipsam ex quo deserunt facilis atque aspernatur facere ut. Molestiae, adipisci. Laboriosam, facilis.
                    </Typography>
                </Box>
                <Box width={400} border={"1px solid rgb(228, 228, 228)"} boxShadow borderRadius={5} padding={3}>
                    <Rating
                        value={5}
                        readOnly
                    />
                    <Box display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight={700} mr={1}>
                            Alex K
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>

                    <Typography variant="body1" color="primary" fontSize={15}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam consectetur et ipsam ex quo deserunt facilis atque aspernatur facere ut. Molestiae, adipisci. Laboriosam, facilis.
                    </Typography>
                </Box>
                <Box width={400} border={"1px solid rgb(228, 228, 228)"} boxShadow borderRadius={5} padding={3}>
                    <Rating
                        value={5}
                        readOnly
                    />
                    <Box display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight={700} mr={1}>
                            James L
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>

                    <Typography variant="body1" color="primary" fontSize={15}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam consectetur et ipsam ex quo deserunt facilis atque aspernatur facere ut. Molestiae, adipisci. Laboriosam, facilis.
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default ReviewPage