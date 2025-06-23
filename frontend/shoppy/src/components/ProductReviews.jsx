import React from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Rating,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ProductReviews = ({ open, handletoggle, reviewCounts, totalReviews, selectedStar, setSelectedStar, filteredReviews, xyzURL }) => {
  return (
    <Box display="flex" flexDirection="column" mt={3}>
      <Button
        variant="text"
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        onClick={handletoggle}
        color="primary"
        sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
      >
        {open ? "Hide Reviews" : "View Reviews"}
      </Button>

      <Collapse in={open}>
        <Box
          mt={2}
          ml={4}
          width="500px"
          sx={{
            borderRadius: "12px",
            padding: 3,
            bgcolor: "linear-gradient(135deg, #ffffff, #fafafa)",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" fontWeight={900} fontFamily="Poppins" color="#333" gutterBottom>
            Reviews ({totalReviews})
          </Typography>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewCounts[star];
            const percentage = totalReviews ? (count / totalReviews) * 100 : 0;

            return (
              <Box
                key={star}
                display="flex"
                alignItems="center"
                gap={1.5}
                mt={1.5}
                onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                sx={{
                  cursor: "pointer",
                  opacity: selectedStar && selectedStar !== star ? 0.5 : 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.03)",
                    opacity: 1,
                  },
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {star} <span style={{ color: "#f9a825" }}>★</span>
                </Typography>
                <Box flex={1}>
                  <Box
                    sx={{
                      bgcolor: "#f1f1f1",
                      borderRadius: "8px",
                      height: "10px",
                      position: "relative",
                      border: "1px solid #ddd",
                      overflow: "hidden",
                      maxWidth: "350px",
                      boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box
                      sx={{
                        background: "linear-gradient(90deg, #FFD700, #FFC107)",
                        height: "100%",
                        width: `${percentage}%`,
                        borderRadius: "8px",
                        boxShadow: "0px 0px 5px rgba(255,215,0,0.5)",
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {count}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {selectedStar && filteredReviews?.length > 0 && (
          <Box px={4} display="flex" flexDirection="column" gap={3} mt={2}>
            {filteredReviews.slice(0, 5).map((rev) => (
              <Box
                key={rev._id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  p: 3,
                  borderRadius: "12px",
                  bgcolor: "linear-gradient(135deg, #fafafa, #f5f5f5)",
                  boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
                  gap: 3,
                  maxWidth: "550px",
                  position: "relative",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {rev.user?.image ? (
                  <Avatar
                    src={`${xyzURL}${rev.user.image}`}
                    alt={rev.user.username}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid #1976d2",
                      boxShadow: "0px 3px 8px rgba(25, 118, 210, 0.3)",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#fff",
                      background: "linear-gradient(135deg, #2196F3 30%, #21CBF3 90%)",
                      boxShadow: "0px 3px 8px rgba(25, 118, 210, 0.3)",
                    }}
                  >
                    {rev.user?.username?.charAt(0).toUpperCase() || "?"}
                  </Avatar>
                )}
                <Box flex={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={1}>
                    <Typography variant="h6" fontWeight={600} textTransform="capitalize">
                      {rev.user?.username || "Anonymous"}
                    </Typography>
                    <Rating value={rev.rating} precision={0.5} size="medium" />
                  </Box>
                  <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.5 }}>
                    {rev.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    Reviewed on: {new Date(rev.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {selectedStar && filteredReviews?.length === 0 && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            No reviews yet for this star rating.
          </Typography>
        )}
      </Collapse>
    </Box>
  );
};

export default ProductReviews;

